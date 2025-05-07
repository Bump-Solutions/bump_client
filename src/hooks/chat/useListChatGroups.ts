import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { listChatGroups } from "../../services/chatService";

const MAX_CHAT_PER_PAGE = 20;

export const useListChatGroups = (
  dependencies: any[] = [],
  params: {
    searchKey?: string;
  }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listChatGroups, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listChatGroups(
        signal,
        axiosPrivate,
        MAX_CHAT_PER_PAGE,
        pageParam as number,
        params.searchKey
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};
