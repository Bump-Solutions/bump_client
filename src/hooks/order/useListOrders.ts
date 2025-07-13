import { useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { listOrders } from "../../services/orderService";
import { ENUM } from "../../utils/enum";

const MAX_ORDERS_PER_PAGE = 20;

export const useListOrders = (dependencies: any[] = []) => {
  const axiosPrivate = useAxiosPrivate();

  return useInfiniteQuery<any, ApiError>({
    queryKey: [QUERY_KEY.listOrders, ...dependencies],
    queryFn: ({ signal, pageParam }) =>
      listOrders(
        signal,
        axiosPrivate,
        MAX_ORDERS_PER_PAGE,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
