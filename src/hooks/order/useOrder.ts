import { use } from "react";
import { OrderContext } from "../../context/OrderProvider";

export const useOrder = () => {
  const context = use(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }

  return context;
};
