import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError, ApiResponse } from "../../types/api";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress } from "../../services/addressService";
import { CreateAddressDTO } from "../../dtos/AddressDTO";

export const useAddAddress = (
  onSuccess?: (resp: ApiResponse, variables: CreateAddressDTO) => void,
  onError?: (error: ApiError, variables: CreateAddressDTO) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, CreateAddressDTO>({
    mutationFn: (addressDto: CreateAddressDTO) =>
      addAddress(axiosPrivate, addressDto),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.listAddresses] });
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      } else {
        addToast(
          error?.response?.data.type || "error",
          error?.response?.data.message
        );
      }
      return Promise.reject(error);
    },
  });
};
