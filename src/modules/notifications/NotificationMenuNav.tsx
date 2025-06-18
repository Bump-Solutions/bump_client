import { Settings } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { useNotifications } from "../../hooks/notifications/useNotifications";

interface NotificationMenuNavProps {
  activeTabIndex: 1 | 2;
  setActiveTabIndex: (index: 1 | 2) => void;
}

const NotificationMenuNav = ({
  activeTabIndex,
  setActiveTabIndex,
}: NotificationMenuNavProps) => {
  const { getTab } = useNotifications();
  const { unreadCount: unreadMessageCount } = getTab(1);
  const { unreadCount: unreadGeneralCount } = getTab(2);

  return (
    <nav className='notification-menu__nav'>
      <ul>
        <li
          className={`${activeTabIndex === 1 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(1)}>
          <div>Üzenetek</div>
          {unreadMessageCount > 0 && (
            <span className='notification-menu__nav-count'>
              {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
            </span>
          )}
        </li>

        <li
          className={`${activeTabIndex === 2 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(2)}>
          <div>Általános</div>
          {unreadGeneralCount > 0 && (
            <span className='notification-menu__nav-count'>
              {unreadGeneralCount > 99 ? "99+" : unreadGeneralCount}
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
