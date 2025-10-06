import "../../assets/css/notification.css";
import { ENUM } from "../../utils/enum";
import { useLocation } from "react-router";
import { useTitle } from "react-use";
import { useState } from "react";
import { NotificationType } from "../../context/NotificationsProvider";
import { NotificationsPageModel } from "../../models/notificationModel";
import { useListNotifications } from "../../hooks/notifications/useListNotifications";

import NotificationsHeader from "./NotificationsHeader";
import NotificationsNav from "./NotificationsNav";
import NotificationsList from "./NotificationsList";
import Spinner from "../../components/Spinner";
import Empty from "../../components/Empty";

import { BellOff } from "lucide-react";

const Notifications = () => {
  useTitle(`Értesítések - ${ENUM.BRAND.NAME}`);

  const location = useLocation();
  const type: NotificationType = location.state?.type || 1; // Default to 1 if not provided

  const [activeTabIndex, setActiveTabIndex] = useState<NotificationType>(type);

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListNotifications([activeTabIndex], { type: activeTabIndex });

  const pages: NotificationsPageModel[] = data?.pages || [];

  const activeUnreadCount = data?.pages?.[0]?.unreadCount ?? 0;

  if (isError) {
    return (
      <h4 className='fc-red-500 ta-center py-5'>
        Hiba történt az értesítések betöltése közben.
      </h4>
    );
  }

  if (isLoading) {
    return (
      <div className='relative py-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <section className='notifications'>
      {pages.length > 0 && (
        <>
          {pages[0].notifications.length > 0 ? (
            <>
              <NotificationsHeader />

              <NotificationsNav
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                activeUnreadCount={activeUnreadCount}
              />

              <NotificationsList
                pages={pages}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </>
          ) : (
            <Empty
              icon={<BellOff className='svg-40' />}
              title='Nincsenek értesítések'
              description={
                activeTabIndex === 1
                  ? "Az értesítések itt jelennek meg, amikor valaki kapcsolatba lép veled. Térj vissza később."
                  : "Az értesítések itt jelennek meg, amikor valaki reagál a termékeidre vagy a profilodra. Térj vissza később."
              }
            />
          )}
        </>
      )}
    </section>
  );
};

export default Notifications;
