import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { OrderModel } from "../../models/orderModel";
import { ApiError } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { getOrder } from "../../services/orderService";
import { ENUM } from "../../utils/enum";

export const useGetOrder = (
  dependencies: any[] = [],
  params: { orderId: number }
) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery<OrderModel, ApiError>({
    queryKey: [QUERY_KEY.getOrder, ...dependencies],
    queryFn: ({ signal }) => getOrder(signal, axiosPrivate, params.orderId),
    enabled: Boolean(params.orderId),
    retry: 1,
    staleTime: ENUM.GLOBALS.staleTime5,
  });
};
