import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { Address, NewAddress } from "../types/address";
import axios, { AxiosInstance } from "axios";

export const getAddressFromCoords = async (
  lat: number,
  lon: number
): Promise<any> => {
  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        format: "json",
        lat,
        lon,
      },
    }
  );

  return data;
};

export const listAddresses = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<Address[]> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.ADDRESS.LIST_ADDRESSES,
    {
      signal,
    }
  );

  return response.data.message;
};

export const addAddress = async (
  axiosPrivate: AxiosInstance,
  newAddress: NewAddress
): Promise<ApiResponse> => {
  return await axiosPrivate.post(API.ADDRESS.ADD_ADDRESS, {
    name: newAddress.name,
    country: newAddress.country,
    city: newAddress.city,
    zip: newAddress.zip,
    street: newAddress.street,
    default: newAddress.default,
  });
};

export const modifyAddress = async (
  axiosPrivate: AxiosInstance,
  address: Address
): Promise<ApiResponse> => {
  return await axiosPrivate.put(API.ADDRESS.UPDATE_ADDRESS(address.id), {
    name: address.name,
    country: address.country,
    city: address.city,
    zip: address.zip,
    street: address.street,
    default: address.default,
  });
};

export const deleteAddress = async (
  axiosPrivate: AxiosInstance,
  addressId: number
): Promise<ApiResponse> => {
  if (!addressId) throw new Error("Missing required parameter: addressId");

  return await axiosPrivate.delete(API.ADDRESS.DELETE_ADDRESS(addressId));
};
