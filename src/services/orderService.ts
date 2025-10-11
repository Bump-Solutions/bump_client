import { AxiosInstance } from "axios";
import {
  CreateOrderModel,
  OrderModel,
  OrdersPageModel,
} from "../models/orderModel";
import { ApiResponse } from "../types/api";
import {
  CreateOrderDTO,
  FetchedOrderDTO,
  OrdersPageDTO,
} from "../dtos/OrderDTO";
import { API } from "../utils/api";
import { fromOrderDTO, toCreateOrderDTO } from "../mappers/orderMapper";

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

  return {
    ...data,
    orders: data.orders.map(fromOrderDTO),
  };
};

export const createOrder = async (
  axiosPrivate: AxiosInstance,
  newOrder: CreateOrderModel
): Promise<ApiResponse> => {
  if (!newOrder) throw new Error("Missing required parameter: newOrder");

  const payload: CreateOrderDTO = toCreateOrderDTO(newOrder);

  return await axiosPrivate.post(API.ORDERS.CREATE_ORDER, payload);
};

export const confirmOrder = async (orderId: number): Promise<void> => {};

export const cancelOrder = async (orderId: number): Promise<void> => {};

export const getOrder = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  orderId: number
): Promise<OrderModel> => {
  if (!orderId) throw new Error("Missing required parameter: orderId");

  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedOrderDTO;
  }>(API.ORDERS.GET_ORDER(orderId), { signal });

  return fromOrderDTO(response.data.message);
};
