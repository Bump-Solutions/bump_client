import { useNotifications } from "../../hooks/notifications/useNotifications";
import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";

import NotificationMenuListItem from "./NotificationsListItem";

import { BellOff } from "lucide-react";

interface NotificationMenuListProps {
  activeTabIndex: 1 | 2;
  toggleNotificationMenu: (bool: boolean) => void;
}

const LIMIT = 5;

const NotificationMenuList = ({
  activeTabIndex,
  toggleNotificationMenu,
}: NotificationMenuListProps) => {
  const { getTab } = useNotifications();
  const { notifications, count } = getTab(activeTabIndex);

  return notifications && notifications.length > 0 ? (
    <>
      <ul className='notification-menu__list'>
        {notifications.slice(0, LIMIT).map((notification, idx) => (
          <NotificationMenuListItem
            key={idx}
            notification={notification}
            toggleNotificationMenu={toggleNotificationMenu}
          />
        ))}
      </ul>

      {count > LIMIT && (
        <div>
          <Link
            to={ROUTES.NOTIFICATIONS}
            state={{ type: activeTabIndex }}
            onClick={() => toggleNotificationMenu(false)}
            className='mx-auto p-1 link blue w-full'>
            Összes megtekintése
          </Link>
        </div>
      )}
    </>
  ) : (
    <div className='notification-menu__list empty'>
      <BellOff />
      <div>
        <h5>Nincsenek értesítések</h5>
        <p>
          {activeTabIndex === 1
            ? "Az értesítések itt jelennek meg, amikor valaki kapcsolatba lép veled. Térj vissza később."
            : "Az értesítések itt jelennek meg, amikor valaki reagál a termékeidre vagy a profilodra. Térj vissza később."}
        </p>
      </div>
    </div>
  );
};

export default NotificationMenuList;
