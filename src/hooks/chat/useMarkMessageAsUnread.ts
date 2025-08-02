import { ApiError, ApiResponse } from "../../types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { markMessageAsUnread } from "../../services/chatService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { ChatGroupModel, InboxModel } from "../../models/chatModel";

export const useMarkMessageAsUnread = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: (chat: ChatGroupModel["name"]) =>
      markMessageAsUnread(axiosPrivate, chat),
    onSuccess: (resp, variables) => {
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
                  if (chatGroup.name === variables) {
                    return {
                      ...chatGroup,
                      lastMessage: {
                        ...chatGroup.lastMessage,
                        isRead: false,
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

      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
