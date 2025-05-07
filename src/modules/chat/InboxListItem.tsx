import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";
import { Message } from "../../types/chat";
import { User } from "../../types/user";
import { NavLink } from "react-router";
import { formatTimestamp } from "../../utils/functions";

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

  const now = new Date();

  const isToday =
    now.getFullYear() === referenceDate.getFullYear() &&
    now.getMonth() === referenceDate.getMonth() &&
    now.getDate() === referenceDate.getDate();

  const isThisYear = now.getFullYear() === referenceDate.getFullYear();

  const formattedTimestamp = isToday
    ? formatTimestamp(referenceDate, "hh:mm")
    : isThisYear
    ? formatTimestamp(referenceDate, "MM.DD")
    : formatTimestamp(referenceDate, "YYYY.MM.DD");

  return (
    <li className='inbox__item'>
      <NavLink
        to={ROUTES.INBOX.CHAT(message.name)}
        state={{ partner: message.user }}>
        <Image
          src={API.BASE_URL + message.user.profile_picture}
          alt={message.user.username.slice(0, 2)}
          placeholderColor='#212529'
        />

        <div
          className={`inbox__item__details ${
            message.last_message && !message.last_message.is_read
              ? "unread"
              : ""
          }`}>
          <div>
            <span className='truncate'>{message.user.username}</span>
            <span className='fs-12'>{formattedTimestamp}</span>
          </div>

          {message?.last_message && (
            <div>
              {!message.last_message.is_read && (
                <span className='new-indicator' />
              )}
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
