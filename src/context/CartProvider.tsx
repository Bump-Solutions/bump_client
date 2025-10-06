import { createContext, ReactNode, useMemo } from "react";
import { useGetCart } from "../hooks/cart/useGetCart";
import { CartModel } from "../models/cartModel";
import { useAddItems, useClearCart } from "../hooks/cart/useCartMutations";

interface CartContextType {
  cart: CartModel | undefined;
  isLoading: boolean;

  actions?: {
    addItems: ReturnType<typeof useAddItems>;
    clearCart: ReturnType<typeof useClearCart>;
  };
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  const { data: cart, isLoading, isError, error } = useGetCart([]);

  console.log("CART DATA:", cart, isLoading, isError, error);

  // Mutations
  const add = useAddItems();
  const clear = useClearCart();

  const contextValue = useMemo<CartContextType>(() => {
    let out: CartContextType = {
      cart,
      isLoading,
      actions: { addItems: add, clearCart: clear },
    };

    if (isError) {
      // Prevent blocking the entire app if cart fetch fails
      console.error("Failed to fetch cart:", error);
      out = { cart: undefined, isLoading: false, actions: undefined };
    }

    return out;
  }, [cart, isLoading, isError]);

  return <CartContext value={contextValue}>{children}</CartContext>;
};

export default CartProvider;
