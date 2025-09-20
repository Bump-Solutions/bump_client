import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { NotificationType } from "../../context/NotificationsProvider";
import { NotificationsPageModel } from "../../models/notificationModel";
import { useListNotifications } from "../../hooks/notifications/useListNotifications";

import NotificationMenuNav from "./NotificationMenuNav";
import NotificationMenuList from "./NotificationMenuList";
import Spinner from "../../components/Spinner";

import { BellOff } from "lucide-react";

interface NotificationMenuProps {
  toggleNotificationMenu: (bool: boolean) => void;
}

const NotificationMenu = ({
  toggleNotificationMenu,
}: NotificationMenuProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState<NotificationType>(1);

  const ref = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: ref,
    callback: () => toggleNotificationMenu(false),
  });

  const { data, isLoading, isError } = useListNotifications([activeTabIndex], {
    type: activeTabIndex,
  });

  const pages: NotificationsPageModel[] = data?.pages || [];

  const activeUnreadCount = data?.pages?.[0]?.unreadCount ?? 0;

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
          activeUnreadCount={activeUnreadCount}
        />

        {isError && (
          <h4 className='fc-red-500 ta-center py-3'>
            Hiba történt az értesítések betöltése közben.
          </h4>
        )}

        {isLoading && (
          <div className='relative py-5'>
            <Spinner />
          </div>
        )}

        {pages.length > 0 && (
          <>
            {pages[0].notifications.length > 0 ? (
              <NotificationMenuList
                pages={pages}
                activeTabIndex={activeTabIndex}
                toggleNotificationMenu={toggleNotificationMenu}
              />
            ) : (
              <div className='notification-menu__list empty'>
                <BellOff />
                <div>
                  <h4 className='nh-fw-600'>Nincsenek értesítések</h4>
                  <p>
                    {activeTabIndex === 1
                      ? "Az értesítések itt jelennek meg, amikor valaki kapcsolatba lép veled. Térj vissza később."
                      : "Az értesítések itt jelennek meg, amikor valaki reagál a termékeidre vagy a profilodra. Térj vissza később."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationMenu;
