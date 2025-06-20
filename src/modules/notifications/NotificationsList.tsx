import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { PaginatedListProps } from "../../types/ui";
import { NotificationsPageModel } from "../../models/notificationModel";

import NotificationsListItem from "./NotificationsListItem";
import Spinner from "../../components/Spinner";

const NotificationsList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<NotificationsPageModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <ul className='notifications__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.notifications.map((notification, idx) => (
              <NotificationsListItem key={idx} notification={notification} />
            ))}
          </Fragment>
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
  );
};

export default NotificationsList;
