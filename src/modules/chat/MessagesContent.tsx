import { useEffect, useState } from "react";
import { useListMessages } from "../../hooks/chat/useListMessages";

import Spinner from "../../components/Spinner";

interface MessagesContentProps {
  chat: string;
}

const MessagesContent = ({ chat }: MessagesContentProps) => {
  const [pages, setPages] = useState<any[] | null>(null);

  const { isLoading, isFetchingNextPage, isError, fetchNextPage, data } =
    useListMessages([chat], {
      chat,
    });

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
    }
  }, [data]);

  console.log("pages", pages);

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

  return pages && pages[0].messages.length > 0 ? <h1>asd</h1> : <h1>todo</h1>;
};

export default MessagesContent;
