import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listMessages } from "../../services/chatService";
import { ChatGroupModel } from "../../models/chatModel";

const MAX_MESSAGES_PER_PAGE = 20;

export const useListMessages = (
  dependencies: any[] = [],
  params: {
    chat: ChatGroupModel["name"];
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listMessages, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listMessages(
        signal,
        axiosPrivate,
        params.chat,
        MAX_MESSAGES_PER_PAGE,
        pageParam as number
      ),
    enabled: !!params.chat,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
