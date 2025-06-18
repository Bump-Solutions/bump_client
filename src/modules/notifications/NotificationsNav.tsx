import { Link } from "react-router";
import { useNotifications } from "../../hooks/notifications/useNotifications";
import { ROUTES } from "../../routes/routes";

import { Settings } from "lucide-react";
import Tooltip from "../../components/Tooltip";

interface NotificationsNavProps {
  activeTabIndex: 1 | 2;
  setActiveTabIndex: (index: 1 | 2) => void;
}

const NotificationsNav = ({
  activeTabIndex,
  setActiveTabIndex,
}: NotificationsNavProps) => {
  const { getTab } = useNotifications();
  const { unreadCount: unreadMessageCount } = getTab(1);
  const { unreadCount: unreadGeneralCount } = getTab(2);

  return (
    <nav className='notifications__nav'>
      <ul>
        <li
          className={`${activeTabIndex === 1 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(1)}>
          <div>Üzenetek</div>
          {unreadMessageCount > 0 && (
            <span className='notification__nav-count'>
              {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
            </span>
          )}
        </li>

        <li
          className={`${activeTabIndex === 2 ? "active" : ""}`}
          onClick={() => setActiveTabIndex(2)}>
          <div>Általános</div>
          {unreadGeneralCount > 0 && (
            <span className='notification__nav-count'>
              {unreadGeneralCount > 99 ? "99+" : unreadGeneralCount}
            </span>
          )}
        </li>

        <li>
          <Tooltip content='Beállítások' placement='bottom' showDelay={750}>
            <Link to={ROUTES.SETTINGS.INBOX}>
              <Settings />
            </Link>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export default NotificationsNav;
