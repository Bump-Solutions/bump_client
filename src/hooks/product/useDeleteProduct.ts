import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { deleteProduct } from "../../services/productService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useProfile } from "../profile/useProfile";
import {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "../../models/productModel";

type DeleteProductVariables = {
  product: ProductListModel;
};

type DeleteProductContext = {
  prev?: ProductModel;
  prevList?: InventoryModel;
  prevSaved?: InventoryModel;
};

export const useDeleteProduct = (
  onSuccess?: (resp: ApiResponse, variables: DeleteProductVariables) => void,
  onError?: (error: ApiError, variables: DeleteProductVariables) => void
) => {
  const { user } = useProfile();

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    DeleteProductVariables,
    DeleteProductContext
  >({
    mutationFn: ({ product }) => deleteProduct(axiosPrivate, product.id),

    onMutate: async ({ product }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.getProduct, product.id],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listProducts, user?.id],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listSavedProducts],
        }),
      ]);

      const prev = queryClient.getQueryData<ProductModel>([
        QUERY_KEY.getProduct,
        product.id,
      ]);

      const prevList = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listProducts,
        user?.id,
      ]);

      const prevSaved = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listSavedProducts,
      ]);

      // 1) getProduct: optimista mentés - delete
      queryClient.removeQueries({
        queryKey: [QUERY_KEY.getProduct, product.id],
      });

      // 2) listProducts: optimista mentés
      queryClient.setQueryData(
        [QUERY_KEY.listProducts, user?.id],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InventoryModel) => {
              return {
                ...page,
                products: page.products.filter(
                  (p: ProductListModel) => p.id !== product.id
                ),
              };
            }),
          };
        }
      );

      // 3) listSavedProducts: optimista mentés
      if (product.saved) {
        queryClient.setQueryData([QUERY_KEY.listSavedProducts], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: InventoryModel) => {
              return {
                ...page,
                products: page.products.filter(
                  (p: ProductListModel) => p.id !== product.id
                ),
              };
            }),
          };
        });
      }

      return { prev, prevList, prevSaved };
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables, context) => {
      const product = variables.product;

      if (context?.prev) {
        queryClient.setQueryData<ProductModel>(
          [QUERY_KEY.getProduct, product.id],
          context.prev
        );
      }

      if (context?.prevList) {
        queryClient.setQueryData(
          [QUERY_KEY.listProducts, user?.id],
          context.prevList
        );
      }

      if (context?.prevSaved) {
        queryClient.setQueryData(
          [QUERY_KEY.listSavedProducts],
          context.prevSaved
        );
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },
  });
};
