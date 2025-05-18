import { ChatGroup, IInbox } from "../../types/chat";
import { ApiError, ApiResponse } from "../../types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { markMessageAsUnread } from "../../services/chatService";
import { QUERY_KEY } from "../../utils/queryKeys";

export const useMarkMessageAsUnread = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: (chat: ChatGroup["name"]) =>
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
            pages: prev.pages.map((page: IInbox) => {
              return {
                ...page,
                messages: page.messages.map((chatGroup: ChatGroup) => {
                  if (chatGroup.name === variables) {
                    return {
                      ...chatGroup,
                      last_message: {
                        ...chatGroup.last_message,
                        is_read: false,
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
      } else {
        addToast(
          error?.response?.data.type || "error",
          error?.response?.data.message
        );
      }
      return Promise.reject(error);
    },
  });
};
