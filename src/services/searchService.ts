import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { SearchHistoryItem } from "../types/search";
import { AxiosInstance } from "axios";

export const listSearchHistory = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<SearchHistoryItem[]> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.SEARCH.LIST_HISTORY,
    { signal }
  );

  return response.data.message;
};

export const deleteSearchHistory = async (
  axiosPrivate: AxiosInstance,
  id: SearchHistoryItem["id"]
): Promise<ApiResponse> => {
  if (!id) throw new Error("Missing required parameter: id");

  return await axiosPrivate.delete(API.SEARCH.DELETE_HISTORY(id));
};

export const searchProducts = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
) => {
  const response: ApiResponse = await axiosPrivate.get(
    API.SEARCH.PRODUCTS(size, page, searchKey),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const searchUsers = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
) => {
  const response: ApiResponse = await axiosPrivate.get(
    API.SEARCH.USERS(size, page, searchKey),
    { signal }
  );

  const data = response.data.message;
  if (data.next) {
    data.next = page + 1;
  }

  return data;
};
