import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderModel } from "../../models/orderModel";
import { ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { createOrder } from "../../services/orderService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { CartModel } from "../../models/cartModel";

type CreateOrderVariables = {
  newOrder: CreateOrderModel;
};

type CreateOrderCtx = {
  prevCart?: CartModel;
};

export const useCreateOrder = (
  onSuccess?: (resp: ApiResponse, variables: CreateOrderVariables) => void,
  onError?: (error: ApiResponse, variables: CreateOrderVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse,
    ApiResponse,
    CreateOrderVariables,
    CreateOrderCtx
  >({
    mutationFn: ({ newOrder }) => createOrder(axiosPrivate, newOrder),

    onMutate: async ({ newOrder }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.getCart],
        }),
        /* 
        queryClient.cancelQueries({
          queryKey: [QUERY_KEY.listOrders],
        }),
        */
      ]);

      const prevCart = queryClient.getQueryData<CartModel>([QUERY_KEY.getCart]);

      // 1) If hooks is called from cart, remove package by sellerId
      switch (newOrder.source) {
        case "cart":
          queryClient.setQueryData(
            [QUERY_KEY.getCart],
            (old: CartModel | undefined) => {
              if (!old) return old;

              const updatedPackages = old.packages.filter(
                (pkg) => pkg.seller.id !== newOrder.sellerId
              );

              return { ...old, packages: updatedPackages };
            }
          );

          break;

        case "product":
          // Remove items from the seller's package if found
          queryClient.setQueryData(
            [QUERY_KEY.getCart],
            (old: CartModel | undefined) => {
              if (!old) return old;

              const updatedPackages = old.packages.map((pkg) => {
                if (pkg.seller.id !== newOrder.sellerId) return pkg;

                const updatedProducts = pkg.products.map((product) => {
                  const filteredItems = product.items.filter(
                    (item) => !newOrder.itemIds.includes(item.id)
                  );

                  return { ...product, items: filteredItems };
                });

                return { ...pkg, products: updatedProducts };
              });

              return { ...old, packages: updatedPackages };
            }
          );

          break;

        default:
          return { prevCart };
      }

      return { prevCart };
    },

    onError: (error, variables, context) => {
      const newOrder = variables.newOrder;

      switch (newOrder.source) {
        case "cart":
          if (context?.prevCart) {
            queryClient.setQueryData([QUERY_KEY.getCart], context.prevCart);
          }
          break;

        case "product":
          if (context?.prevCart) {
            queryClient.setQueryData([QUERY_KEY.getCart], context.prevCart);
          }
          break;

        default:
          break;
      }

      if (onError) {
        onError(error, variables);
      }

      return Promise.reject(error);
    },

    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getCart],
        refetchType: "active",
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listOrders],
        refetchType: "active",
      });

      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
  });
};
