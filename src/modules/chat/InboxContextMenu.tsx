import { motion } from "framer-motion";
import { ChatGroup } from "../../types/chat";
import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useMarkMessageAsUnread } from "../../hooks/chat/useMarkMessageAsUnread";

interface InboxContextMenuProps {
  group: ChatGroup;
  toggleContextMenu: (value?: boolean) => void;
}

const InboxContextMenu = ({
  group,
  toggleContextMenu,
}: InboxContextMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleContextMenu(false),
  });

  const markMessageAsUnreadMutation = useMarkMessageAsUnread((response) => {
    toggleContextMenu(false);
  });

  const handleUnreadMessage = () => {
    if (!group.last_message) return;

    // Ha mar olvasatlan, vagy own, akkor return
    if (!group.last_message.is_read || group.last_message.own_message) {
      toggleContextMenu(false);
      return;
    }

    return markMessageAsUnreadMutation.mutateAsync(group.name);
  };

  return (
    <motion.div
      ref={ref}
      className='inbox__menu-actions'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      <ul className='action-list no-border'>
        <li className='action-list-item'>
          <div onClick={handleUnreadMessage}>
            <span>Megjelölés olvasatlanként</span>
          </div>
        </li>
      </ul>
    </motion.div>
  );
};

export default InboxContextMenu;
