import { QUERY_KEY } from "../../utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadProduct } from "../../services/productService";
import { useAuth } from "../auth/useAuth";
import { CreateProductModel, InventoryModel } from "../../models/productModel";

type UploadProductVariables = {
  newProduct: CreateProductModel;
};

type UploadProductContext = {
  prevList?: InventoryModel;
};

export const useUploadProduct = (
  onSuccess?: (resp: ApiResponse, variables: UploadProductVariables) => void,
  onError?: (error: ApiError, variables: UploadProductVariables) => void
) => {
  const { auth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    UploadProductVariables,
    UploadProductContext
  >({
    mutationFn: ({ newProduct }) => uploadProduct(axiosPrivate, newProduct),

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables, context) => {
      if (context?.prevList) {
        queryClient.setQueryData(
          [QUERY_KEY.listProducts, auth?.user?.id],
          context.prevList
        );
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, auth?.user?.id],
        refetchType: "all",
      });
    },
  });
};
