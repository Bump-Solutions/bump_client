import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderModel } from "../../models/orderModel";
import { ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { createOrder } from "../../services/orderService";
import { QUERY_KEY } from "../../utils/queryKeys";

export const useCreateOrder = (
  onSuccess?: (resp: ApiResponse, variables: CreateOrderModel) => void,
  onError?: (error: ApiResponse, variables: CreateOrderModel) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiResponse, CreateOrderModel>({
    mutationFn: (newOrder: CreateOrderModel) =>
      createOrder(axiosPrivate, newOrder),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.listOrders], refetchType: "all" });
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
