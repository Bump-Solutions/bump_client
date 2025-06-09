import { InboxModel } from "../../models/chatModel";
import { useInView } from "react-intersection-observer";
import { PaginatedListProps } from "../../types/ui";
import { Fragment, useEffect } from "react";

import Spinner from "../../components/Spinner";
import InboxListItem from "./InboxListItem";

const InboxList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: PaginatedListProps<InboxModel>) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <>
      <ul className='inbox__list'>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.messages.map((group, idx) => (
              <InboxListItem key={idx} group={group} />
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

export default InboxList;
