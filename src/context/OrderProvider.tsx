import { createContext, ReactNode, useCallback, useMemo } from "react";
import { OrderModel } from "../models/orderModel";
import { Navigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useGetOrder } from "../hooks/order/useGetOrder";
import { QUERY_KEY } from "../utils/queryKeys";
import { ROUTES } from "../routes/routes";
import { displayUuid } from "../utils/functions";

interface OrderContextType {
  order: OrderModel | undefined;
  setOrder: (data: Partial<OrderModel>) => void;
  isLoading: boolean;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

interface OrderProviderProps {
  children: ReactNode;
}

const OrderProvider = ({ children }: OrderProviderProps) => {
  const { uuid } = useParams();
  if (!uuid) return null;

  const queryClient = useQueryClient();

  const { data: order, isLoading, isError } = useGetOrder([uuid], { uuid });

  const setOrder = useCallback(
    (data: Partial<OrderModel>) => {
      queryClient.setQueryData(
        [QUERY_KEY.getOrder, uuid],
        (prev: OrderModel | undefined) => ({
          ...prev,
          ...data,
        })
      );
    },
    [queryClient, uuid]
  );

  const contextValue = useMemo<OrderContextType>(
    () => ({
      order,
      setOrder,
      isLoading,
    }),
    [order, setOrder, isLoading]
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás rendelésazonosító",
            message: `Sajnáljuk, a(z) "${displayUuid(
              uuid
            )}" azonosítójú rendelés nem található. Megeshet, hogy elírás van az azonosítóban, vagy a rendelés törölve lett.`,
          },
        }}
      />
    );
  }

  return <OrderContext value={contextValue}>{children}</OrderContext>;
};

export default OrderProvider;
