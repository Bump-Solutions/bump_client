import { useNotifications } from "../../hooks/notifications/useNotifications";
import { ROUTES } from "../../routes/routes";
import { Link } from "react-router";

import { BellOff } from "lucide-react";
import NotificationMenuListItem from "./NotificationMenuListItem";

interface NotificationMenuListProps {
  activeTabIndex: 1 | 2;
}

const NotificationMenuList = ({
  activeTabIndex,
}: NotificationMenuListProps) => {
  const { getTab } = useNotifications();

  const { ...tab } = getTab(activeTabIndex);
  console.log("Tab", tab);

  return tab.notifications.length > 0 ? (
    <>
      <ul className='notification-menu__list'>
        {tab.notifications.map((notification, idx) => (
          <NotificationMenuListItem key={idx} notification={notification} />
        ))}
      </ul>

      {tab.hasNextPage && (
        <div>
          <Link
            to={ROUTES.NOTIFICATIONS}
            state={{ type: activeTabIndex }}
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
