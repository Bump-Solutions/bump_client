import { motion } from "framer-motion";
import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { NotificationsPageModel } from "../../models/notificationModel";

interface NotificationMenuProps {
  toggleNotificationMenu: (bool: boolean) => void;
  pages: NotificationsPageModel[] | null;
}

const NotificationMenu = ({
  toggleNotificationMenu,
  pages,
}: NotificationMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleNotificationMenu(false),
  });

  console.log("NotificationMenu", pages);

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
      <motion.div ref={ref}></motion.div>
    </motion.div>
  );
};

export default NotificationMenu;
