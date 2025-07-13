import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listNotifications } from "../../services/notificationService";
import { useAuth } from "../auth/useAuth";
import { ENUM } from "../../utils/enum";

const MAX_NOTIFICATIONS_PER_PAGE = 5;

export const useListNotifications = (
  dependencies: any[] = [],
  params: {
    type: number; // 0 for all, 1 for message-related, 2 for general
  }
) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listNotifications, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listNotifications(
        signal,
        axiosPrivate,
        params.type,
        MAX_NOTIFICATIONS_PER_PAGE,
        pageParam as number
      ),
    enabled: Boolean(auth), // Only fetch if user is authenticated
    refetchOnWindowFocus: true,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: ENUM.GLOBALS.staleTime1,
  });
};
