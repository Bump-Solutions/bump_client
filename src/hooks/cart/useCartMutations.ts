import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { addItems, clearCart, removePackage } from "../../services/cartService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { CartModel } from "../../models/cartModel";

type MutationCtx = {
  prev?: CartModel;
};

export const useAddItems = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number[], MutationCtx>({
    mutationFn: (itemIds: number[]) => addItems(axiosPrivate, itemIds),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.getCart],
      });

      const prev = queryClient.getQueryData<CartModel>([QUERY_KEY.getCart]);

      /* 
      if (prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], {
          ...prev,
          summary: {
            ...prev.summary,
            itemsCount: prev.summary.itemsCount + variables.length,
          },
        });
      }
        */

      return { prev };
    },

    onError: (error, variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], context.prev);
      }

      return Promise.reject(error);
    },

    // onSuccess: (resp, variables) => {},

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getCart],
      });
    },
  });
};

export const useRemovePackage = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, number, MutationCtx>({
    mutationFn: (sellerId: number) => removePackage(axiosPrivate, sellerId),

    onMutate: async (sellerId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.getCart],
      });

      const prev = queryClient.getQueryData<CartModel>([QUERY_KEY.getCart]);
      if (!prev) return { prev };

      const next = prev.packages.filter((pkg) => pkg.seller.id !== sellerId);

      queryClient.setQueryData([QUERY_KEY.getCart], {
        ...prev,
        packages: next,
      });

      return { prev };
    },

    onError: (error, variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData([QUERY_KEY.getCart], context.prev);
      }

      return Promise.reject(error);
    },

    // onSuccess: (resp, variables) => {},

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
