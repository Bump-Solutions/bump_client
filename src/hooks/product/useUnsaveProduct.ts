import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { unsaveProduct } from "../../services/productService";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "../../models/productModel";
import { QUERY_KEY } from "../../utils/queryKeys";

type UnsaveProductVariables = {
  product: ProductModel | ProductListModel;
  userId: number;
};

type UnsaveProductCtx = {
  prev?: ProductModel;
  prevList?: InventoryModel;
  prevSaved?: InventoryModel;
};

export const useUnsaveProduct = (
  onSuccess?: (resp: ApiResponse, variables: UnsaveProductVariables) => void,
  onError?: (error: ApiError, variables: UnsaveProductVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    UnsaveProductVariables,
    UnsaveProductCtx
  >({
    mutationFn: ({ product }) => unsaveProduct(axiosPrivate, product.id),

    onMutate: async ({ product, userId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.getProduct, product.id],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listProducts, userId],
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
        userId,
      ]);

      const prevSaved = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listSavedProducts,
      ]);

      // 1) getProduct: optimista mentés
      if (prev) {
        queryClient.setQueryData<ProductModel>(
          [QUERY_KEY.getProduct, product.id],
          { ...prev, saved: false, saves: prev.saves - 1 }
        );
      }

      // 2) listProducts: optimista mentés
      queryClient.setQueryData([QUERY_KEY.listProducts, userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: InventoryModel) => ({
            ...page,
            products: page.products.map((p: ProductListModel) =>
              p.id === product.id
                ? { ...p, saved: false, saves: p.saves - 1 }
                : p
            ),
          })),
        };
      });

      // 3) listSavedProducts: optimista mentés
      queryClient.setQueryData([QUERY_KEY.listSavedProducts], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: InventoryModel) => ({
            ...page,
            products: page.products.filter(
              (p: ProductListModel) => p.id !== product.id
            ),
          })),
        };
      });

      return { prev, prevList, prevSaved };
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onError: (error, variables, context) => {
      const userId = variables.userId;

      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY.getProduct, variables.product.id],
          context.prev
        );
      }

      if (context?.prevList) {
        queryClient.setQueryData(
          [QUERY_KEY.listProducts, userId],
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

    onSettled: (resp, error, { product, userId }) => {
      /*
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getProduct, product.id],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, userId],
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
