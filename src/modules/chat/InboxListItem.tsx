import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";
import { AnimatePresence } from "framer-motion";
import { ChatGroup } from "../../types/chat";
import { useEffect } from "react";
import { NavLink } from "react-router";
import { useLongPress } from "react-use";
import {
  formatTimestamp,
  isThisYear,
  isToday,
  now,
} from "../../utils/functions";
import { useToggle } from "../../hooks/useToggle";

import Image from "../../components/Image";
import InboxContextMenu from "./InboxContextMenu";

import { Ellipsis } from "lucide-react";

interface InboxListItemProps {
  group: ChatGroup;
}

const InboxListItem = ({ group }: InboxListItemProps) => {
  const [isContextMenuOpen, toggleContextMenu] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow = isContextMenuOpen ? "hidden" : "auto";
    document.body.style.pointerEvents = isContextMenuOpen ? "none" : "auto";

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, [isContextMenuOpen]);

  const onLongPress = () => {
    toggleContextMenu(true);
  };

  const longPressEvent = useLongPress(onLongPress, {
    isPreventDefault: true,
    delay: 500,
  });

  const referenceDate = new Date(
    group?.last_message?.created_at || group.created_at
  );

  const formattedTimestamp = isToday(referenceDate)
    ? formatTimestamp(referenceDate, "hh:mm")
    : isThisYear(referenceDate, now())
    ? formatTimestamp(referenceDate, "MM.DD")
    : formatTimestamp(referenceDate, "YYYY.MM.DD");

  const showUnread =
    !group?.last_message?.is_read && !group?.last_message?.own_message;

  return (
    <li className='inbox__item'>
      <AnimatePresence mode='wait'>
        {isContextMenuOpen && (
          <InboxContextMenu
            group={group}
            toggleContextMenu={toggleContextMenu}
          />
        )}
      </AnimatePresence>

      <NavLink
        to={ROUTES.INBOX.CHAT(group.name)}
        state={{ partner: group.user, createdAt: group.created_at }}
        {...longPressEvent}>
        <Image
          src={API.BASE_URL + group.user.profile_picture}
          alt={group.user.username.slice(0, 2)}
          placeholderColor='#212529'
        />

        <div
          className={`inbox__item__details ${
            group.last_message && showUnread ? "unread" : ""
          }`}>
          <div>
            <span className='truncate'>{group.user.username}</span>
            <span className='fs-12'>{formattedTimestamp}</span>
          </div>

          {group?.last_message && (
            <div>
              {showUnread && <span className='new-indicator' />}
              <span className='truncate'>
                {group.last_message.own_message && "Te: "}
                {group.last_message.body}
              </span>
            </div>
          )}
        </div>

        <span
          className='inbox__item-actions'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleContextMenu(true);
          }}>
          <Ellipsis strokeWidth={3} />
        </span>
      </NavLink>
    </li>
  );
};

export default InboxListItem;
