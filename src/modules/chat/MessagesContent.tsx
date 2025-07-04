import { useListMessages } from "../../hooks/chat/useListMessages";
import { useLocation } from "react-router";
import { MessagesPageModel } from "../../models/chatModel";

import Spinner from "../../components/Spinner";
import MessagesList from "./MessagesList";
import MessageDateDivider from "./MessageDateDivider";

interface MessagesContentProps {
  chat: string;
}

const MessagesContent = ({ chat }: MessagesContentProps) => {
  const location = useLocation();
  const createdAt = location.state?.createdAt
    ? new Date(location.state.createdAt)
    : new Date();

  const { isLoading, isFetchingNextPage, isError, fetchNextPage, data } =
    useListMessages([chat], {
      chat,
    });

  const pages: MessagesPageModel[] = data?.pages || [];

  if (isError) {
    return (
      <div className='abs-center'>
        <h4 className='fc-red-500 ta-center '>
          Hiba történt az üzenetek betöltése közben.
        </h4>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    pages.length > 0 && (
      <>
        {pages[0].messages.length > 0 ? (
          <MessagesList
            pages={pages}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        ) : (
          <div className='messages__list'>
            <MessageDateDivider
              date={createdAt}
              detail='Beszélgetés létrehozva'
            />
          </div>
        )}
      </>
    )
  );
};

export default MessagesContent;
