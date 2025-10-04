import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEY } from "./queryKeys";
import { listOrders } from "../services/orderService";
import { AxiosInstance } from "axios";

export const listOrdersQueryOptions = (
  axiosPrivate: AxiosInstance,
  pageNumber: number,
  pageSize: number = 1
) => {
  return queryOptions({
    queryKey: [QUERY_KEY.listOrders, { pageNumber }],
    queryFn: ({ signal }) =>
      listOrders(signal, axiosPrivate, pageSize, pageNumber),
  });
};
