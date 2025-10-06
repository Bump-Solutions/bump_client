import { AxiosInstance } from "axios";
import { ApiResponse } from "../types/api";
import { API } from "../utils/api";
import { CartModel } from "../models/cartModel";
import { CartDTO } from "../dtos/CartDTO";
import { fromCartDTO } from "../mappers/cartMapper";

export const getCart = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<CartModel> => {
  const response: ApiResponse = await axiosPrivate.get<{ message: CartDTO }>(
    API.CART.GET_CART,
    { signal }
  );

  return fromCartDTO(response.data.message);
};

export const addItems = async (
  axiosPrivate: AxiosInstance,
  itemIds: number[]
): Promise<ApiResponse> => {
  if (!itemIds || itemIds.length === 0)
    throw new Error("Missing required parameter: itemIds");

  return await axiosPrivate.post(API.CART.ADD_ITEMS, {
    inventory_item_id_list: itemIds,
  });
};

export const removeItem = async (
  axiosPrivate: AxiosInstance,
  itemId: number
): Promise<ApiResponse> => {
  if (!itemId) throw new Error("Missing required parameter: itemId");

  return await axiosPrivate.delete(API.CART.REMOVE_ITEM(itemId));
};

export const removeProduct = async (
  axiosPrivate: AxiosInstance,
  productId: number
): Promise<ApiResponse> => {
  if (!productId) throw new Error("Missing required parameter: productId");

  return await axiosPrivate.delete(API.CART.REMOVE_PRODUCT(productId));
};

export const removePackage = async (
  axiosPrivate: AxiosInstance,
  sellerId: number
): Promise<ApiResponse> => {
  if (!sellerId) throw new Error("Missing required parameter: sellerId");

  return await axiosPrivate.delete(API.CART.REMOVE_PACKAGE(sellerId));
};

export const clearCart = async (
  axiosPrivate: AxiosInstance
): Promise<ApiResponse> => {
  return await axiosPrivate.delete(API.CART.CLEAR);
};
