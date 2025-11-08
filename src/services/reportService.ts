import { AxiosInstance } from "axios";
import { ApiResponse } from "../types/api";
import { API } from "../utils/api";

export const reportProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number,
  reason: number,
  description: string | undefined
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
  uid: number,
  reason: number,
  description: string | undefined
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.post(API.REPORT.USER, {
    user: uid,
    reason,
    description,
  });
};
