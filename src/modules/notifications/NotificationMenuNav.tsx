import { Settings } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { NotificationType } from "../../context/NotificationsProvider";
import { useGetProfileMeta } from "../../hooks/profile/useGetProfileMeta";

interface NotificationMenuNavProps {
  activeTabIndex: NotificationType;
  setActiveTabIndex: (index: NotificationType) => void;
  activeUnreadCount: number;
}

const NotificationMenuNav = ({
  activeTabIndex,
  setActiveTabIndex,
  activeUnreadCount,
}: NotificationMenuNavProps) => {
  const { data: meta } = useGetProfileMeta();
  const totalUnread = meta?.unreadNotifications ?? 0;
  const inactiveUnreadCount = Math.max(0, totalUnread - activeUnreadCount);

  const renderCount = (tabIndex: NotificationType) => {
    if (tabIndex === activeTabIndex) {
      return activeUnreadCount > 0
        ? activeUnreadCount > 99
          ? "99+"
          : activeUnreadCount
        : null;
    }

    return inactiveUnreadCount > 0
      ? inactiveUnreadCount > 99
        ? "99+"
        : inactiveUnreadCount
      : null;
  };

  return (
    <nav className='notification-menu__nav'>
      <ul>
        <li
          className={`${activeTabIndex === 1 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(1)}>
          <div>Üzenetek</div>
          {renderCount(1) && (
            <span className='notification-menu__nav-count'>
              {renderCount(1)}
            </span>
          )}
        </li>

        <li
          className={`${activeTabIndex === 2 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(2)}>
          <div>Általános</div>
          {renderCount(2) && (
            <span className='notification-menu__nav-count'>
              {renderCount(2)}
            </span>
          )}
        </li>

        <li>
          <Link to={ROUTES.SETTINGS.INBOX}>
            <Settings />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NotificationMenuNav;
