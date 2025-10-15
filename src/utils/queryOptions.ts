import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEY } from "./queryKeys";
import { listOrders } from "../services/orderService";
import { AxiosInstance } from "axios";
import { ENUM } from "./enum";

export const listOrdersQueryOptions = (
  axiosPrivate: AxiosInstance,
  pageNumber: number,
  pageSize: number
) => {
  return queryOptions({
    queryKey: [QUERY_KEY.listOrders, { pageNumber }],
    queryFn: ({ signal }) =>
      listOrders(signal, axiosPrivate, pageSize, pageNumber),
    retry: false,
    placeholderData: (prev) => prev,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
