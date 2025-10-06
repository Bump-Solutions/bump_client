import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { addItems, clearCart } from "../../services/cartService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { CartModel } from "../../models/cartModel";

type MutationCtx = {
  prev?: CartModel;
};

export const useAddItems = (
  onSuccess?: (resp: ApiResponse, variables: number[]) => void,
  onError?: (error: ApiError, variables: number[]) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number[], MutationCtx>({
    mutationFn: (itemIds: number[]) => addItems(axiosPrivate, itemIds),

    onMutate: async (variables) => {
      console.log("Adding to cart (optimistic):", variables);

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.getCart],
      });

      const prev = queryClient.getQueryData<CartModel>([QUERY_KEY.getCart]);

      if (prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], {
          ...prev,
          summary: {
            ...prev.summary,
            itemsCount: prev.summary.itemsCount + variables.length,
          },
        });
      }

      return { prev };
    },

    onError: (error, variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], context.prev);
      }
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },

    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getCart],
      });
    },
  });
};

export const useClearCart = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, void, MutationCtx>({
    mutationFn: () => clearCart(axiosPrivate),

    // 1) Optimista üresítés
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.getCart],
      });

      const prev = queryClient.getQueryData<CartModel>([QUERY_KEY.getCart]);

      // az üres kosár Model:
      const EMPTY: CartModel = {
        packages: [],

        summary: {
          packagesCount: 0,
          itemsCount: 0,

          grossSubtotal: { amount: 0, currency: "HUF" },
          discountsTotal: { amount: 0, currency: "HUF" },
          indicativeSubtotal: { amount: 0, currency: "HUF" },
        },
      };

      queryClient.setQueryData([QUERY_KEY.getCart], EMPTY);

      return { prev };
    },

    // 2) Hiba esetén visszaállítjuk
    onError: (error, variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], context.prev);
      }
      return Promise.reject(error);
    },

    // 3) Siker
    /* onSuccess: (resp) => {}, */

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getCart],
      });
    },
  });
};
