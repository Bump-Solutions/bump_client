import { QUERY_KEY } from "../../utils/queryKeys";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddress } from "../../services/addressService";

export const useDeleteAddress = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (addressId: number) => deleteAddress(axiosPrivate, addressId),
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
