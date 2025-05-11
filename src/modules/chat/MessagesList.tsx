import { MessageGroup, MessagesPage } from "../../types/chat";
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
import { API } from "../../utils/api";

interface MessagesListProps {
  pages: MessagesPage[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const GROUP_TIMEOUT = 10; // 10 perc

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
            <MessageListItem key={`msg-${msg.id}`} message={msg} />
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

  // 1) lapozott oldalakból egységes tömb
  const allMessages = pages.flatMap((page) => page.messages);

  // 2) készítünk egy 'elements' listát, amiben vagy
  //    <MessageDateDivider/> vagy <div className="batch"> lesz
  const elements: JSX.Element[] = [];
  let lastDay: Date | null = null;
  let currentGroup: MessageGroup | null = null;

  [...allMessages].reverse().forEach((message, idx) => {
    const createdAt = new Date(message.created_at);
    const msgDay = startOfDay(createdAt);
    const isOwn = message.author_username === me;
    const timestamp = formatTimestamp(createdAt, "hh:mm");

    let detail = null;
    if (!lastDay || !isSameDay(msgDay, lastDay)) {
      if (idx === 0) {
        detail = "Beszélgetés létrehozva";
      }
      elements.unshift(
        <MessageDateDivider
          key={`divider-${idx}`}
          date={createdAt}
          detail={detail}
        />
      );
      lastDay = msgDay;
      currentGroup = null;
    }

    // --- 2) batch-break logika ---
    // uj batch akkor kezdődik, ha:
    // - nincs currentGroup
    // - szerzője más, mint az előző batch-nek
    // - a batch utolsó üzenete óta eltelt idő > BATCH_TIMEOUT

    let mustBreak = false;
    if (!currentGroup) {
      mustBreak = true;
    } else if (currentGroup.isOwn !== isOwn) {
      mustBreak = true;
    } else if (
      differenceInMinutes(currentGroup.lastAt, createdAt) > GROUP_TIMEOUT
    ) {
      mustBreak = true;
    }

    if (mustBreak) {
      if (currentGroup) {
        elements.unshift(renderGroup(currentGroup, idx));
      }

      currentGroup = {
        author: message.author_username,
        partner: isOwn ? null : partner,
        isOwn,
        timestamp,
        messages: [message],
        lastAt: createdAt,
      } as MessageGroup;
    } else {
      currentGroup.messages.push(message);
      currentGroup.lastAt = createdAt;
    }
  });

  if (currentGroup) {
    elements.unshift(renderGroup(currentGroup, allMessages.length));
  }

  // flex-direction: column-reverse miatt a legutolsó elem a legelső
  return (
    <div className='messages__list'>
      {elements}
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
