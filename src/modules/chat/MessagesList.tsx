import { API } from "../../utils/api";
import { User } from "../../types/user";
import { Message, MessageGroup, MessagesPage } from "../../types/chat";
import {
  differenceInMinutes,
  formatTimestamp,
  isSameDay,
  startOfDay,
} from "../../utils/functions";
import { useLocation } from "react-router";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../hooks/auth/useAuth";
import { JSX, useEffect } from "react";

import Spinner from "../../components/Spinner";
import MessageDateDivider from "./MessageDateDivider";
import MessageListItem from "./MessageListItem";
import Image from "../../components/Image";

interface MessagesListProps {
  pages: MessagesPage[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const GROUP_TIMEOUT = 10; // 10 perc

const groupMessages = (
  messages: Message[],
  me: string,
  partner: Partial<User>
): JSX.Element[] => {
  const elements: JSX.Element[] = [];
  let lastDay: Date | null = null;
  let currentGroup: MessageGroup | null = null;

  const reversedMessages = [...messages].reverse(); // Feldolgozás: legrégebbitől a legfrissebbig

  for (let i = 0; i < reversedMessages.length; i++) {
    const message = reversedMessages[i];
    const createdAt = new Date(message.created_at);
    const msgDay = startOfDay(createdAt);
    const isOwn = message.author_username === me;
    const timestamp = formatTimestamp(createdAt, "hh:mm");

    // Ha új nap következik, akkor:
    // 1. lezárjuk az aktuális üzenetcsoportot (ha van)
    // 2. beszúrunk egy dátumelválasztót
    if (!lastDay || !isSameDay(msgDay, lastDay)) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i));
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

    // Eldöntjük, kell-e új batch/csoport
    const mustBreak =
      !currentGroup || // nincs csoport
      currentGroup.isOwn !== isOwn || // más a szerzője
      differenceInMinutes(currentGroup.lastAt, createdAt) > GROUP_TIMEOUT; // több mint x perc telt el

    if (mustBreak) {
      if (currentGroup) {
        elements.push(renderGroup(currentGroup, i));
      }

      currentGroup = {
        author: message.author_username,
        partner: isOwn ? null : partner,
        isOwn,
        timestamp,
        messages: [message],
        lastAt: createdAt,
      };
    } else {
      currentGroup.messages.push(message);
      currentGroup.lastAt = createdAt;
    }
  }

  // Utolsó üzenetcsoport lezárása, ha maradt feldolgozatlan
  if (currentGroup) {
    elements.push(renderGroup(currentGroup, reversedMessages.length));
  }

  return elements.reverse();
};

const renderGroup = (group: MessageGroup, index: number) => {
  return (
    <div
      key={`group-${index}`}
      className={`message__group ${group.isOwn ? "own" : ""}`}>
      {group.partner && (
        <div className='group__avatar'>
          <Image
            src={API.BASE_URL + group.partner.profile_picture}
            alt={group.partner.username.slice(0, 2)}
            placeholderColor='#212529'
          />
        </div>
      )}

      <div className='group__wrapper'>
        <div className='group__header'>
          {!group.isOwn && (
            <span className='fw-700 mr-0_25'>{group.author}</span>
          )}
          <span>{group.timestamp}</span>
        </div>

        <div className='group__messages'>
          {group.messages.map((msg, idx) => (
            <MessageListItem
              key={`msg-${msg.id}-${msg.created_at}`}
              message={msg}
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
  const me = auth?.user.username;

  // Infinite scroll trigger
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const allMessages = pages.flatMap((page) => page.messages);
  const groupedElements = groupMessages(allMessages, me, partner);

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
    </div>
  );
};

export default MessagesList;
