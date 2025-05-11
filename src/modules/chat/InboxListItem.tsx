import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";
import { Message } from "../../types/chat";
import { User } from "../../types/user";
import { NavLink } from "react-router";
import {
  formatTimestamp,
  isThisYear,
  isToday,
  now,
} from "../../utils/functions";

import Image from "../../components/Image";

interface InboxListItemProps {
  message: {
    id: number;
    name: string;
    user: Partial<User>;
    last_message?: Message;
    created_at: string;
  };
}

const InboxListItem = ({ message }: InboxListItemProps) => {
  const referenceDate = new Date(
    message?.last_message?.created_at || message.created_at
  );

  const formattedTimestamp = isToday(referenceDate)
    ? formatTimestamp(referenceDate, "hh:mm")
    : isThisYear(referenceDate, now())
    ? formatTimestamp(referenceDate, "MM.DD")
    : formatTimestamp(referenceDate, "YYYY.MM.DD");

  const showUnread =
    !message?.last_message?.is_read && !message?.last_message?.own_message;

  return (
    <li className='inbox__item'>
      <NavLink
        to={ROUTES.INBOX.CHAT(message.name)}
        state={{ partner: message.user, createdAt: message.created_at }}>
        <Image
          src={API.BASE_URL + message.user.profile_picture}
          alt={message.user.username.slice(0, 2)}
          placeholderColor='#212529'
        />

        <div
          className={`inbox__item__details ${
            message.last_message && showUnread ? "unread" : ""
          }`}>
          <div>
            <span className='truncate'>{message.user.username}</span>
            <span className='fs-12'>{formattedTimestamp}</span>
          </div>

          {message?.last_message && (
            <div>
              {showUnread && <span className='new-indicator' />}
              <span className='truncate'>
                {message.last_message.own_message && "Te: "}
                {message.last_message.body}
              </span>
            </div>
          )}
        </div>
      </NavLink>
    </li>
  );
};

export default InboxListItem;
