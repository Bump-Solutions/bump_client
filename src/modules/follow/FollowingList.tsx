import { Fragment, useEffect } from "react";
import { PaginatedListProps } from "../../types/ui";
import { useInView } from "react-intersection-observer";
import { FollowingsPageModel } from "../../models/userModel";

import Spinner from "../../components/Spinner";
import FollowingListItem from "./FollowingListItem";

const FollowingList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<FollowingsPageModel>) => {
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
            {page.followings.map((following, idx) => (
              <FollowingListItem key={idx} following={following} />
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

export default FollowingList;
