import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

import NotificationMenuNav from "./NotificationMenuNav";
import NotificationMenuList from "./NotificationMenuList";

interface NotificationMenuProps {
  toggleNotificationMenu: (bool: boolean) => void;
}

const NotificationMenu = ({
  toggleNotificationMenu,
}: NotificationMenuProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<1 | 2>(1);

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleNotificationMenu(false),
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}>
      <motion.div ref={ref} className='notification-menu'>
        <header className='notification-menu__header'>
          <h4 className='fw-600'>Értesítések</h4>
          <button type='button'>Összes megjelölése olvasottként</button>
        </header>

        <NotificationMenuNav
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
        />

        <NotificationMenuList activeTabIndex={activeTabIndex} />
      </motion.div>
    </motion.div>
  );
};

export default NotificationMenu;
