import { createContext, ReactNode, useMemo } from "react";
import { useGetCart } from "../hooks/cart/useGetCart";
import { CartModel } from "../models/cartModel";
import {
  useAddItems,
  useClearCart,
  useRemovePackage,
} from "../hooks/cart/useCartMutations";

interface CartContextType {
  cart: CartModel | undefined;
  isLoading: boolean;

  itemsCount: number;

  actions?: {
    addItems: ReturnType<typeof useAddItems>;
    removePackage: ReturnType<typeof useRemovePackage>;
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

  // Mutations
  const addItems = useAddItems();
  const removePackage = useRemovePackage();
  const clearCart = useClearCart();

  const contextValue = useMemo<CartContextType>(() => {
    let out: CartContextType = {
      cart,
      isLoading,

      itemsCount: cart
        ? cart.packages.reduce((sum, pkg) => {
            return (
              sum +
              pkg.products.reduce((pSum, prod) => pSum + prod.items.length, 0)
            );
          }, 0)
        : 0,

      actions: { addItems, removePackage, clearCart },
    };

    if (isError) {
      // Prevent blocking the entire app if cart fetch fails
      console.error("Failed to fetch cart:", error);
      out = {
        cart: undefined,
        isLoading: false,
        itemsCount: 0,
        actions: undefined,
      };
    }

    return out;
  }, [cart, isLoading, isError]);

  return <CartContext value={contextValue}>{children}</CartContext>;
};

export default CartProvider;
