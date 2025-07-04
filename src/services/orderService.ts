import { AxiosInstance } from "axios";
import { OrdersPageModel } from "../models/orderModel";
import { ApiResponse } from "../types/api";
import { OrdersPageDTO } from "../dtos/OrderDTO";
import { API } from "../utils/api";
import { fromOrderDTO } from "../mappers/orderMapper";

export const listOrders = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number
): Promise<OrdersPageModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: OrdersPageDTO;
  }>(API.ORDERS.LIST_ORDERS(size, page), { signal });

  const data: OrdersPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  console.log("OrdersPageDTO", data);

  return {
    ...data,
    orders: data.orders.map(fromOrderDTO),
  };
};
