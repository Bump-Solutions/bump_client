import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router";
import useWebSocket from "react-use-websocket";
import { useAuth } from "../../hooks/auth/useAuth";
import { ChatGroupModel, InboxModel } from "../../models/chatModel";
import { API } from "../../utils/api";
import { QUERY_KEY } from "../../utils/queryKeys";

import { MessageDTO } from "../../dtos/ChatDTO";
import { fromMessageDTO } from "../../mappers/chatMapper";

import MessagesContent from "./MessagesContent";
import MessagesFooter from "./MessagesFooter";
import MessagesHeader from "./MessagesHeader";

interface OutletContextType {
  chat: string;
}

const Messages = () => {
  const { chat } = useOutletContext<OutletContextType>();
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const URL = useMemo(() => `${API.WS_BASE_URL}/chat/${chat}/`, [chat]);
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(URL, {
    queryParams: {
      token: auth?.accessToken!,
    },
    shouldReconnect: (closeEvent) => {
      return true;
    },
    share: false,
  });

  // Mark message as read when opening chat
  useEffect(() => {
    queryClient.setQueriesData(
      {
        queryKey: [QUERY_KEY.listChatGroups],
        exact: false,
      },
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: InboxModel) => {
            return {
              ...page,
              messages: page.messages.map((chatGroup: ChatGroupModel) => {
                if (chatGroup.name === chat) {
                  const last = chatGroup.lastMessage;

                  if (!last) {
                    return chatGroup;
                  }

                  // Ha mar olvasott, vagy own, akkor return
                  if (last.isRead || last.ownMessage) {
                    return chatGroup;
                  }

                  // Ha nem, akkor frissítjük az üzenetet
                  return {
                    ...chatGroup,
                    lastMessage: {
                      ...last,
                      isRead: true, // csak ezt a mezőt változtatjuk
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
  }, [chat]);

  // Handle real-time update on new messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    const newMessage = fromMessageDTO(lastJsonMessage as MessageDTO);
    const isOwn = auth?.user?.username === newMessage.authorUsername;

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
          pages: prev.pages.map((page: InboxModel) => {
            return {
              ...page,
              messages: page.messages.map((chatGroup: ChatGroupModel) => {
                if (chatGroup.name === chat) {
                  return {
                    ...chatGroup,
                    lastMessage: {
                      id: newMessage.id,
                      authorUsername: newMessage.authorUsername,
                      body: newMessage.body,
                      isRead: isOwn,
                      createdAt: newMessage.createdAt,
                      ownMessage: isOwn,
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
