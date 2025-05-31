import { User } from "../../types/user";
import { Message, MessageGroup, MessagesPage } from "../../types/chat";
import { useToggle } from "../../hooks/useToggle";
import {
  differenceInMinutes,
  formatTimestamp,
  isSameDay,
  startOfDay,
} from "../../utils/functions";
import { useLocation } from "react-router";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../hooks/auth/useAuth";
import { JSX, useEffect, useMemo, useState } from "react";

import Spinner from "../../components/Spinner";
import MessageDateDivider from "./MessageDateDivider";
import MessageListItem from "./MessageListItem";
import Image from "../../components/Image";
import Lightbox from "../../components/Lightbox";

interface MessagesListProps {
  pages: MessagesPage[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const GROUP_TIMEOUT = 10; // 10 perc

const groupMessages = (
  messages: Message[],
  me: string | undefined,
  partner: Partial<User>,
  openLightbox: (src: string, messageId: number) => void
): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  let lastDay: Date | null = null;
  let currentGroup: MessageGroup | null = null;

  const reversed = [...messages].reverse(); // Feldolgozás: legrégebbitől a legfrissebbig

  for (let i = 0; i < reversed.length; i++) {
    const message = reversed[i];
    const createdAt = new Date(message.created_at!);
    const msgDay = startOfDay(createdAt);
    const isOwn = message.author_username === me;
    const timestamp = formatTimestamp(createdAt, "hh:mm");

    // Ha új nap következik, akkor:
    // 1. lezárjuk az aktuális üzenetcsoportot (ha van)
    // 2. beszúrunk egy dátumelválasztót
    if (!lastDay || !isSameDay(msgDay, lastDay)) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i, openLightbox));
        currentGroup = null;
      }

      const detail = i === 0 ? "Beszélgetés létrehozva" : null;
      elements.push(
        <MessageDateDivider
          key={`divider-${i}`}
          date={createdAt}
          detail={detail}
        />
      );

      lastDay = msgDay;
    }

    // Attachmentek száma
    const attachmentsCount = message.attachment
      ? message.attachment.split(";;").filter((x) => x).length
      : 0;

    // --- bontás: switch a type+attachmentsCount alapján ---
    let splitMessages: Message[] = [];
    switch (true) {
      // csak szöveg
      case message.type === 0 || attachmentsCount === 0:
        splitMessages = [message];
        break;

      // több kép: mindig külön group, text+pics két feldolgozott üzenetben
      case attachmentsCount > 1:
        // flush előző csoport
        if (currentGroup) {
          elements.push(renderGroup(currentGroup, i, openLightbox));
          currentGroup = null;
        }

        if (message.body.trim()) {
          splitMessages.push({ ...message, type: 0, attachment: "" });
        }
        splitMessages.push({ ...message, type: 1, body: "" });

        // és azonnal ki is rendereljük
        elements.push(
          renderGroup(
            {
              author: message.author_username,
              partner: isOwn ? null : partner,
              isOwn,
              timestamp,
              messages: splitMessages,
              lastAt: createdAt,
              attachmentsCount,
            },
            i,
            openLightbox
          )
        );
        continue;

      // pontosan 1 kép + szöveg
      case message.type === 2 && attachmentsCount === 1:
        if (message.body.trim()) {
          splitMessages.push({ ...message, type: 0, attachment: "" });
        }
        splitMessages.push({ ...message, type: 1, body: "" });
        break;

      // csak kép
      case message.type === 1:
        splitMessages = [message];
        break;
    }

    // Eldöntjük, kell-e új batch/csoport
    const mustBreak =
      !currentGroup || // nincs csoport
      currentGroup.isOwn !== isOwn || // más a szerzője
      differenceInMinutes(currentGroup.lastAt, createdAt) > GROUP_TIMEOUT; // több mint x perc telt el

    if (mustBreak) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i, openLightbox));
      }

      currentGroup = {
        author: message.author_username,
        partner: isOwn ? null : partner,
        isOwn,
        timestamp,
        messages: splitMessages,
        lastAt: createdAt,
      };
    } else {
      if (currentGroup) {
        currentGroup.messages.push(...splitMessages);
        currentGroup.lastAt = createdAt;
      }
    }
  }

  // Utolsó üzenetcsoport lezárása, ha maradt feldolgozatlan
  if (currentGroup) {
    elements.push(renderGroup(currentGroup, reversed.length, openLightbox));
  }

  return elements.reverse();
};

const renderGroup = (
  group: MessageGroup,
  index: number,
  openLightbox: (src: string, messageId: number) => void
) => {
  return (
    <div
      key={`group-${group.lastAt}-${index}`}
      className={`message__group ${group.isOwn ? "own" : ""}`}>
      {group.partner && (
        <div className='group__avatar'>
          <Image
            src={group.partner.profile_picture}
            alt={group.partner.username?.slice(0, 2)}
            placeholderColor='#212529'
          />
        </div>
      )}

      <div className='group__wrapper'>
        <div className='group__header'>
          {!group.isOwn && (
            <span className='fw-700 mr-0_5'>{group.author}</span>
          )}

          {group.attachmentsCount && (
            <span className='mr-0_5'>
              {group.attachmentsCount} képet{" "}
              {group.isOwn ? "küldtél" : "küldött"}
            </span>
          )}

          <span>{group.timestamp}</span>
        </div>

        <div className='group__messages'>
          {group.messages.map((msg, idx) => (
            <MessageListItem
              key={`msg-${msg.id}-${msg.created_at}-${idx}`}
              message={msg}
              onImageClick={openLightbox}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MessagesList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: MessagesListProps) => {
  const location = useLocation();
  const partner = location.state?.partner;

  const { auth } = useAuth();
  const me = auth?.user?.username;

  // Lightbox state
  const [lightboxOpen, toggleLightbox] = useToggle(false);
  const [lightboxAttachments, setLightboxAttachments] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Infinite scroll
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // Flatten messages
  const allMessages = pages.flatMap((page) => page.messages);

  // Get all attachments
  const allAttachments: string[] = [];
  const attachmentIndexes: Record<string, number> = {};

  useMemo(() => {
    allMessages.forEach((msg) => {
      if (msg.attachment) {
        const parts = msg.attachment.split(";;").filter(Boolean);
        parts.forEach((src) => {
          attachmentIndexes[`${msg.id}-${src}`] = allAttachments.length;
          allAttachments.push(src);
        });
      }
    });
  }, [allMessages]);

  const openLightbox = (src: string, messageId: number) => {
    const key = `${messageId}-${src}`;
    const index = attachmentIndexes[key] ?? 0;
    setLightboxAttachments(allAttachments);
    setCurrentIndex(index);
    toggleLightbox(true);
  };

  const groupedElements = useMemo(
    () => groupMessages(allMessages, me, partner, openLightbox),
    [allMessages, me, partner]
  );

  return (
    <div className='messages__list'>
      {groupedElements}

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          attachments={lightboxAttachments}
          initialIndex={currentIndex}
          onClose={() => toggleLightbox(false)}
        />
      )}
    </div>
  );
};

export default MessagesList;
