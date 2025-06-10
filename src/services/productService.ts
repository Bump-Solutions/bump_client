import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { AxiosInstance } from "axios";
import { SellFormData } from "../context/SellProvider";
import { UserModel } from "../models/userModel";
import { InventoryModel, ProductModel } from "../models/productModel";
import { FetchedProductDTO, InventoryDTO } from "../dtos/ProductDTO";
import {
  fromFetchedProductDTO,
  fromListProductDTO,
} from "../mappers/productMapper";

export const listAvailableBrands = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.PRODUCT.LIST_AVAILABLE_BRANDS(size, page, searchKey),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const listAvailableModels = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  brand: string,
  size: number,
  page: number,
  searchKey: string
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.PRODUCT.LIST_AVAILABLE_MODELS(brand, size, page, searchKey),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const listAvailableColorways = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  brand: string,
  model: string,
  size: number,
  page: number,
  searchKey: string
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.PRODUCT.LIST_AVAILABLE_COLORWAYS(brand, model, size, page, searchKey),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const uploadProduct = async (
  axiosPrivate: AxiosInstance,
  data: SellFormData
): Promise<ApiResponse> => {
  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      title: data.title,
      description: data.description,
      product: data.product?.id // Ha van id, akkor CatalogProduct
        ? data.product.id
        : {
            brand: data.product?.brand,
            model: data.product?.model,
            color_way: data.product?.color_way,
            category: 1, // TODO
            colors: "#fff", // TODO
          },
      county: 1, // TODO
      items: data.items.map((item) => ({
        condition: item.condition?.value,
        gender: item.gender?.value,
        price: item.price,
        size: item.size?.value,
        state: 1,
      })),
    })
  );

  data.images.forEach((image) => {
    formData.append("images", image.file);
  });

  return await axiosPrivate.post(API.PRODUCT.UPLOAD_PRODUCT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listProducts = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"],
  size: number,
  page: number
): Promise<InventoryModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const response: ApiResponse = await axiosPrivate.get<{
    message: InventoryDTO;
  }>(API.PRODUCT.LIST_PRODUCTS(uid, size, page), { signal });

  const data: InventoryDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    products: data.products.map(fromListProductDTO),
  };
};

export const listSavedProducts = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number
): Promise<InventoryModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: InventoryDTO;
  }>(API.PRODUCT.LIST_SAVED_PRODUCTS(size, page), { signal });

  const data: InventoryDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    products: data.products.map(fromListProductDTO),
  };
};

export const getProduct = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ProductModel> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedProductDTO;
  }>(API.PRODUCT.GET_PRODUCT(pid), { signal });

  return fromFetchedProductDTO(response.data.message);
};

export const deleteProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.delete(API.PRODUCT.DELETE_PRODUCT(pid));
};

export const likeProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.post(API.PRODUCT.LIKE_PRODUCT, {
    product_id: pid,
  });
};

export const unlikeProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.post(API.PRODUCT.UNLIKE_PRODUCT, {
    product_id: pid,
  });
};

export const saveProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.post(API.PRODUCT.SAVE_PRODUCT, {
    product_id: pid,
  });
};

export const unsaveProduct = async (
  axiosPrivate: AxiosInstance,
  pid: number
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await axiosPrivate.delete(API.PRODUCT.UNSAVE_PRODUCT(pid));
};
