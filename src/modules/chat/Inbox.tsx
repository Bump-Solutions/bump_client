import { IInbox } from "../../types/chat";
import { useEffect, useState } from "react";
import { useListChatGroups } from "../../hooks/chat/useListChatGroups";

import InboxHeader from "./InboxHeader";
import InboxList from "./InboxList";
import Spinner from "../../components/Spinner";

import { MessageSquareOff, SearchX } from "lucide-react";

const Inbox = () => {
  const [searchKeyDebounced, setSearchKeyDebounced] = useState<string>("");
  const [pages, setPages] = useState<IInbox[] | null>(null);

  const { isLoading, isFetchingNextPage, isError, fetchNextPage, data } =
    useListChatGroups([searchKeyDebounced], {
      searchKey: searchKeyDebounced,
    });

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
    }
  }, [data]);

  return (
    <div className='inbox__panel'>
      <InboxHeader
        searchKeyDebounced={searchKeyDebounced}
        onSearchDebounced={(debouncedValue) => {
          setSearchKeyDebounced(debouncedValue);
        }}
      />

      {isError && (
        <h4 className='fc-red-500 ta-center py-5'>
          Hiba történt a chatek betöltése közben.
        </h4>
      )}

      {isLoading && (
        <div className='relative py-5'>
          <Spinner />
        </div>
      )}

      {!isLoading && !isError && (
        <div className='inbox__content'>
          {pages && pages[0].messages.length > 0 ? (
            <InboxList
              pages={pages}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <div className='no-messages'>
              {searchKeyDebounced ? (
                <>
                  <SearchX className='svg-32' />
                  <div className='ta-center'>
                    <h4 className='fw-600 mb-0_25'>Nincs találat</h4>
                    <p className='fc-light fs-14'>
                      Próbálkozz egy másik kifejezéssel.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <MessageSquareOff className='svg-32' />
                  <div className='ta-center'>
                    <h4 className='fw-600 mb-0_25'>Nincsenek üzeneteid</h4>
                    <p className='fc-light fs-14'>
                      Az új üzenetek itt jelennek meg.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
