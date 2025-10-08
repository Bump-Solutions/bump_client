import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { saveProduct } from "../../services/productService";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import {
  InventoryModel,
  ProductListModel,
  ProductModel,
} from "../../models/productModel";
import { QUERY_KEY } from "../../utils/queryKeys";

type SaveProductVariables = {
  product: ProductModel | ProductListModel;
  ownerId: number;
};

type SaveProductCtx = {
  prev?: ProductModel;
  prevList?: InventoryModel;
  prevSaved?: InventoryModel;
};

export const useSaveProduct = (
  onSuccess?: (resp: ApiResponse, variables: SaveProductVariables) => void,
  onError?: (error: ApiError, variables: SaveProductVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiError,
    SaveProductVariables,
    SaveProductCtx
  >({
    mutationFn: ({ product }) => saveProduct(axiosPrivate, product.id),

    onMutate: async ({ product, ownerId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.getProduct, product.id],
        }),
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listProducts, ownerId],
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
        ownerId,
      ]);

      const prevSaved = queryClient.getQueryData<InventoryModel>([
        QUERY_KEY.listSavedProducts,
      ]);

      // 1) getProduct: optimista mentés
      if (prev) {
        queryClient.setQueryData<ProductModel>(
          [QUERY_KEY.getProduct, product.id],
          { ...prev, saved: true, saves: prev.saves + 1 }
        );
      }

      // 2) listProducts: optimista mentés
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
                  ? { ...p, saved: true, saves: p.saves + 1 }
                  : p
              ),
            })),
          };
        }
      );

      // 3) listSavedProducts: optimista mentés
      queryClient.setQueryData([QUERY_KEY.listSavedProducts], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: InventoryModel) => ({
            ...page,
            products: [
              { ...product, saved: true, saves: product.saves + 1 },
              ...page.products,
            ],
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
      const ownerId = variables.ownerId;

      if (context?.prev) {
        queryClient.setQueryData(
          [QUERY_KEY.getProduct, variables.product.id],
          context.prev
        );
      }

      if (context?.prevList) {
        queryClient.setQueryData(
          [QUERY_KEY.listProducts, ownerId],
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

    onSettled: (resp, error, { product, ownerId }) => {
      /*
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getProduct, product.id],
        refetchType: "active",
      });
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
