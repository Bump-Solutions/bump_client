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

      const pkg = prev.packages.find((p) => p.seller.id === sellerId);
      if (!pkg) return { prev };

      // 1) csomag hozzájárulása (delta)
      const itemsCountDelta = pkg.products.reduce(
        (acc, p) => acc + p.items.length,
        0
      );

      const grossDelta = pkg.products.reduce(
        (acc, p) => acc + p.items.reduce((s, it) => s + it.price.amount, 0),
        0
      );

      const indicativeDelta = pkg.products.reduce(
        (acc, p) =>
          acc +
          p.items.reduce(
            (s, it) => s + (it.discountedPrice?.amount ?? it.price.amount),
            0
          ),
        0
      );

      const discountsDelta = grossDelta - indicativeDelta;

      // 2) új állapot (clamp 0-ra, valuta megőrzés)
      const cur = prev.summary.grossSubtotal.currency;
      const next: CartModel = {
        ...prev,
        packages: prev.packages.filter((p) => p.seller.id !== sellerId),
        summary: {
          packagesCount: Math.max(0, prev.summary.packagesCount - 1),
          itemsCount: Math.max(0, prev.summary.itemsCount - itemsCountDelta),

          grossSubtotal: {
            amount: Math.max(0, prev.summary.grossSubtotal.amount - grossDelta),
            currency: cur,
          },

          discountsTotal: {
            amount: Math.max(
              0,
              prev.summary.discountsTotal.amount - discountsDelta
            ),
            currency: cur,
          },

          indicativeSubtotal: {
            amount: Math.max(
              0,
              prev.summary.indicativeSubtotal.amount - indicativeDelta
            ),
            currency: cur,
          },
        },
      };

      queryClient.setQueryData([QUERY_KEY.getCart], next);

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
