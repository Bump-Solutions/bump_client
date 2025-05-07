import { API } from "../utils/api";
import { IProduct } from "../types/product";
import { User } from "../types/user";
import { AxiosInstance } from "axios";

export const reportProduct = async (
  axiosPrivate: AxiosInstance,
  pid: IProduct["id"],
  reason: number,
  description: string
) => {
  if (!pid) return;

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
) => {
  if (!uid) return;

  return await axiosPrivate.post(API.REPORT.USER, {
    user: uid,
    reason,
    description,
  });
};
