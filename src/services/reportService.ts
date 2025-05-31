import { API } from "../utils/api";
import { IProduct } from "../types/product";
import { User } from "../types/user";
import { AxiosInstance } from "axios";
import { ApiResponse } from "../types/api";

export const reportProduct = async (
  axiosPrivate: AxiosInstance,
  pid: IProduct["id"],
  reason: number,
  description: string
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.post(API.REPORT.PRODUCT, {
    product: pid,
    reason,
    description,
  });
};

export const reportUser = async (
  axiosPrivate: AxiosInstance,
  uid: User["id"],
  reason: number,
  description: string
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.post(API.REPORT.USER, {
    user: uid,
    reason,
    description,
  });
};
