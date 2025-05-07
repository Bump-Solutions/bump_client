import { useMutation } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { IProduct } from "../../types/product";
import { likeProduct } from "../../services/productService";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";

export const useLikeProduct = (
  onSuccess?: (resp: ApiResponse, variables: IProduct["id"]) => void,
  onError?: (error: ApiError, variables: IProduct["id"]) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, IProduct["id"]>({
    mutationFn: (productId: IProduct["id"]) =>
      likeProduct(axiosPrivate, productId),
    onSuccess: (resp, variables) => {
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
