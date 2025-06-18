import { useInView } from "react-intersection-observer";
import { useNotifications } from "../../hooks/notifications/useNotifications";
import { useEffect } from "react";

import NotificationsListItem from "./NotificationsListItem";
import Spinner from "../../components/Spinner";

import { BellOff } from "lucide-react";

interface NotificationsListProps {
  activeTabIndex: 1 | 2;
}

const NotificationsList = ({ activeTabIndex }: NotificationsListProps) => {
  const { ref, inView } = useInView();

  const { getTab } = useNotifications();
  const { notifications, fetchNextPage, isFetchingNextPage } =
    getTab(activeTabIndex);

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return notifications && notifications.length > 0 ? (
    <>
      <ul className='notifications__list'>
        {notifications.map((notification, idx) => (
          <NotificationsListItem key={idx} notification={notification} />
        ))}
      </ul>

      <div ref={ref}>
        {isFetchingNextPage && (
          <div className='relative py-3'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  ) : (
    <div className='notifications__list empty'>
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

export default NotificationsList;
