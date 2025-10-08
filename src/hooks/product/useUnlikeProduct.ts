import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { unlikeProduct } from "../../services/productService";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "../../models/productModel";
import { QUERY_KEY } from "../../utils/queryKeys";

type UnlikeProductVariables = {
  product: ProductModel | ProductListModel;
  ownerId: number;
};

type UnlikeProductCtx = {
  prevList?: InventoryModel;
  prevSaved?: InventoryModel;
};

export const useUnlikeProduct = (
  onSuccess?: (resp: ApiResponse, variables: UnlikeProductVariables) => void,
  onError?: (error: ApiError, variables: UnlikeProductVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    UnlikeProductVariables,
    UnlikeProductCtx
  >({
    mutationFn: ({ product }) => unlikeProduct(axiosPrivate, product.id),

    onMutate: async ({ product, ownerId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listProducts, ownerId],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listSavedProducts],
        }),
      ]);

      const prevList = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listProducts,
        ownerId,
      ]);

      const prevSaved = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listSavedProducts,
      ]);

      // 1) owner list
      queryClient.setQueryData(
        [QUERY_KEY.listProducts, ownerId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InventoryModel) => ({
              ...page,
              products: page.products.map((p: ProductListModel) =>
                p.id === product.id
                  ? {
                      ...p,
                      liked: false,
                      likes: p.likes - 1,
                    }
                  : p
              ),
            })),
          };
        }
      );

      // 2) saved list: csak akkor ha mentve van
      if (product.saved) {
        queryClient.setQueryData([QUERY_KEY.listSavedProducts], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InventoryModel) => ({
              ...page,
              products: page.products.map((p: ProductListModel) =>
                p.id === product.id
                  ? {
                      ...p,
                      liked: false,
                      likes: p.likes - 1,
                    }
                  : p
              ),
            })),
          };
        });
      }

      return { prevList, prevSaved };
    },

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

    onSettled: (resp, error, { product, ownerId }) => {
      /*
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, ownerId],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listSavedProducts],
        refetchType: "active",
      });
      */
    },
  });
};
