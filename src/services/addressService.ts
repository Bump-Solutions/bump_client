import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import axios, { AxiosInstance } from "axios";
import { AddressModel } from "../models/addressModel";
import { CreateAddressDTO, FetchedAddressDTO } from "../dtos/AddressDTO";
import {
  fromFetchedAddressDTO,
  toCreateAddressDTO,
} from "../mappers/addressMapper";

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
): Promise<AddressModel[]> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedAddressDTO[];
  }>(API.ADDRESS.LIST_ADDRESSES, {
    signal,
  });

  return response.data.message.map(fromFetchedAddressDTO);
};

export const addAddress = async (
  axiosPrivate: AxiosInstance,
  newAddress: Omit<AddressModel, "id">
): Promise<ApiResponse> => {
  const payload: CreateAddressDTO = toCreateAddressDTO(newAddress);
  return await axiosPrivate.post(API.ADDRESS.ADD_ADDRESS, payload);
};

export const modifyAddress = async (
  axiosPrivate: AxiosInstance,
  address: AddressModel
): Promise<ApiResponse> => {
  const payload: CreateAddressDTO = toCreateAddressDTO(address);
  return await axiosPrivate.put(
    API.ADDRESS.UPDATE_ADDRESS(address.id),
    payload
  );
};

export const deleteAddress = async (
  axiosPrivate: AxiosInstance,
  addressId: AddressModel["id"]
): Promise<ApiResponse> => {
  if (!addressId) throw new Error("Missing required parameter: addressId");

  return await axiosPrivate.delete(API.ADDRESS.DELETE_ADDRESS(addressId));
};
