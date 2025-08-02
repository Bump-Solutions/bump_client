import { useMutation } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { saveProduct } from "../../services/productService";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";

export const useSaveProduct = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (productId: number) => saveProduct(axiosPrivate, productId),
    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
