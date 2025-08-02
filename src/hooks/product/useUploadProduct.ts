import { QUERY_KEY } from "../../utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadProduct } from "../../services/productService";
import { useAuth } from "../auth/useAuth";
import { CreateProductModel } from "../../models/productModel";

export const useUploadProduct = (
  onSuccess?: (resp: ApiResponse, variables: CreateProductModel) => void,
  onError?: (error: ApiError, variables: CreateProductModel) => void
) => {
  const { auth } = useAuth();

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiError, CreateProductModel>({
    mutationFn: (newProduct: CreateProductModel) =>
      uploadProduct(axiosPrivate, newProduct),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, auth?.user?.id],
        refetchType: "all",
      });
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
