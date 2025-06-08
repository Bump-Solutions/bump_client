import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { AxiosInstance } from "axios";
import {
  ProductSearchModel,
  SearchHistoryItemModel,
  SearchPageModel,
  UserSearchModel,
} from "../models/searchModel";
import { ProductSearchDTO, UserSearchDTO } from "../dtos/SearchDTO";
import {
  fromProductSearchDTO,
  fromUserSearchDTO,
} from "../mappers/searchMapper";

export const listSearchHistory = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<SearchHistoryItemModel[]> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: SearchHistoryItemModel[];
  }>(API.SEARCH.LIST_HISTORY, { signal });

  return response.data.message;
};

export const deleteSearchHistory = async (
  axiosPrivate: AxiosInstance,
  id: SearchHistoryItemModel["id"]
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
): Promise<SearchPageModel<ProductSearchModel>> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: SearchPageModel<ProductSearchDTO>;
  }>(API.SEARCH.PRODUCTS(size, page, searchKey), { signal });

  const data: SearchPageModel<ProductSearchDTO> = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    search_result: data.search_result.map(fromProductSearchDTO),
  };
};

export const searchUsers = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
): Promise<SearchPageModel<UserSearchModel>> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: SearchPageModel<UserSearchDTO>;
  }>(API.SEARCH.USERS(size, page, searchKey), { signal });

  const data: SearchPageModel<UserSearchDTO> = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    search_result: data.search_result.map(fromUserSearchDTO),
  };
};
