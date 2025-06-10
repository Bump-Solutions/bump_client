import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { AxiosInstance } from "axios";
import { UserModel } from "../models/userModel";
import {
  BrandsPageModel,
  ColorwaysPageModel,
  CreateProductModel,
  InventoryModel,
  ModelsPageModel,
  ProductModel,
} from "../models/productModel";
import {
  BrandsPageDTO,
  ColorwaysPageDTO,
  FetchedProductDTO,
  InventoryDTO,
  ModelsPageDTO,
} from "../dtos/ProductDTO";
import {
  fromBrandDTO,
  fromColorwayDTO,
  fromFetchedProductDTO,
  fromListProductDTO,
  fromModelDTO,
  toCreateProductDTO,
} from "../mappers/productMapper";

export const listAvailableBrands = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
): Promise<BrandsPageModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: BrandsPageDTO;
  }>(API.PRODUCT.LIST_AVAILABLE_BRANDS(size, page, searchKey), { signal });

  const data: BrandsPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    products: data.products.map(fromBrandDTO),
  };
};

export const listAvailableModels = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  brand: string,
  size: number,
  page: number,
  searchKey: string
): Promise<ModelsPageModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: ModelsPageDTO;
  }>(API.PRODUCT.LIST_AVAILABLE_MODELS(brand, size, page, searchKey), {
    signal,
  });

  const data: ModelsPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    products: data.products.map(fromModelDTO),
  };
};

export const listAvailableColorways = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  brand: string,
  model: string,
  size: number,
  page: number,
  searchKey: string
): Promise<ColorwaysPageModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: ColorwaysPageDTO;
  }>(
    API.PRODUCT.LIST_AVAILABLE_COLORWAYS(brand, model, size, page, searchKey),
    { signal }
  );

  const data: ColorwaysPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    products: data.products.map(fromColorwayDTO),
  };
};

export const uploadProduct = async (
  axiosPrivate: AxiosInstance,
  newProduct: CreateProductModel
): Promise<ApiResponse> => {
  const dto = toCreateProductDTO(newProduct);
  const { images, ...payload } = dto;

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  images.forEach((image) => {
    formData.append("images", image.file);
  });

  console.log("FormData:", formData, images);

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
