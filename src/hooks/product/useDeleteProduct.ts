import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { deleteProduct } from "../../services/productService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useProfile } from "../profile/useProfile";
import { InventoryModel, ProductListModel } from "../../models/productModel";

export const useDeleteProduct = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const { user } = useProfile();

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (productId: number) => deleteProduct(axiosPrivate, productId),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getProduct, variables],
      });

      queryClient.setQueryData([QUERY_KEY.listSavedProducts], (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page: InventoryModel) => {
            return {
              ...page,
              products: page.products.filter(
                (p: ProductListModel) => p.id !== variables
              ),
            };
          }),
        };
      });

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
