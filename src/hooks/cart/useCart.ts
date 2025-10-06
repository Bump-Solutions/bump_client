import { use } from "react";
import { CartContext } from "../../context/CartProvider";

export const useCart = () => {
  const context = use(CartContext);

  if (!context) {
    throw new Error("useCart must be used within an CartProvider");
  }

  return context;
};
