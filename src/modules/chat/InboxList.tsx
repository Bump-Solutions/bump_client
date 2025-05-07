import { IInbox } from "../../types/chat";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

import Spinner from "../../components/Spinner";
import InboxListItem from "./InboxListItem";

interface InboxListProps {
  pages: IInbox[];
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const InboxList = ({
  pages,
  fetchNextPage,
  isFetchingNextPage,
}: InboxListProps) => {
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
            {page.messages.map((message, idx) => (
              <InboxListItem key={idx} message={message} />
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
