import { PaginatedListProps } from "../../types/ui";
import { FollowersPageModel } from "../../models/userModel";
import { useInView } from "react-intersection-observer";

import Spinner from "../../components/Spinner";
import { Fragment, useEffect } from "react";
import FollowerListItem from "./FollowerListItem";

const FollowerList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<FollowersPageModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <ul className='user__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.followers.map((follower, idx) => (
              <FollowerListItem key={idx} follower={follower} />
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

export default FollowerList;
