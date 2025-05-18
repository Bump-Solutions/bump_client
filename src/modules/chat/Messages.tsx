import { API } from "../../utils/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { ChatGroup, IInbox, Message, MessagesPage } from "../../types/chat";
import { useOutletContext } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import MessagesHeader from "./MessagesHeader";
import MessagesContent from "./MessagesContent";
import MessagesFooter from "./MessagesFooter";

interface OutletContextType {
  chat: string;
}

const Messages = () => {
  const { chat } = useOutletContext<OutletContextType>();
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const URL = `${API.WS_BASE_URL}/chat/${chat}/`;
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(URL, {
    queryParams: {
      token: auth?.accessToken,
    },
    shouldReconnect: (closeEvent) => {
      return true;
    },
  });

  // Handle real-time update on new messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    const newMessage = lastJsonMessage as Message;
    const isOwn = auth?.user?.username === newMessage.author_username;

    // Update messages
    queryClient.setQueryData([QUERY_KEY.listMessages, chat], (prev: any) => {
      if (!prev) return prev;

      return {
        ...prev,
        pages: [
          {
            ...prev.pages[0],
            messages: [newMessage, ...prev.pages[0].messages],
          },
          ...prev.pages.slice(1),
        ],
      };
    });

    // Update chat list (!!searchKey)
    queryClient.setQueriesData(
      {
        queryKey: [QUERY_KEY.listChatGroups],
        exact: false,
      },
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: IInbox) => {
            return {
              ...page,
              messages: page.messages.map((chatGroup: ChatGroup) => {
                if (chatGroup.name === chat) {
                  return {
                    ...chatGroup,
                    last_message: {
                      id: newMessage.id,
                      author_username: newMessage.author_username,
                      body: newMessage.body,
                      is_read: isOwn,
                      created_at: newMessage.created_at,
                      own_message: isOwn,
                    },
                  };
                }
                return chatGroup;
              }),
            };
          }),
        };
      }
    );
  }, [lastJsonMessage, chat, queryClient]);

  return (
    <div className='messages__panel'>
      <MessagesHeader />
      <div className='messages__content'>
        <MessagesContent chat={chat} />
      </div>
      <MessagesFooter chat={chat} onSend={sendJsonMessage} />
    </div>
  );
};

export default Messages;
