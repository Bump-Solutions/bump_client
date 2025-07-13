import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";
import { NotificationType } from "../../context/NotificationsProvider";
import { NotificationsPageModel } from "../../models/notificationModel";
import { useMemo } from "react";

import NotificationMenuListItem from "./NotificationsListItem";

interface NotificationMenuListProps {
  pages: NotificationsPageModel[];
  activeTabIndex: NotificationType;
  toggleNotificationMenu: (bool: boolean) => void;
}

const LIMIT = 3;

const NotificationMenuList = ({
  pages,
  activeTabIndex,
  toggleNotificationMenu,
}: NotificationMenuListProps) => {
  const notifications = useMemo(() => {
    return pages.flatMap((page) => page.notifications);
  }, [pages]);

  const count = useMemo(() => {
    return pages[0].count;
  }, [pages]);

  return (
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
  );
};

export default NotificationMenuList;
