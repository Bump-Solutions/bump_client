import { createContext, Dispatch, ReactNode } from "react";
import { useLocalStorage } from "react-use";
import {
  CartModel,
  SellerModel,
  TradeItemModel,
  TradeProductModel,
} from "../models/tradeModel";

type TradeAction =
  | {
      type: "ADD_ITEM";
      payload: {
        seller: SellerModel;
        productId: TradeProductModel["id"];
        item: TradeItemModel;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: {
        sellerId: SellerModel["id"];
        productId: TradeProductModel["id"];
        itemId: TradeItemModel["id"];
      };
    }
  | {
      type: "REMOVE_PACKAGE";
      payload: {
        sellerId: SellerModel["id"];
      };
    }
  | {
      type: "CLEAR_CART";
    };

interface TradeContextType {
  cart: CartModel;
  addItem: (
    seller: SellerModel,
    productId: number,
    item: TradeItemModel
  ) => void;
  removeItem: (sellerId: number, productId: number, itemId: number) => void;
  removePackage: (sellerId: number) => void;
  clearCart: () => void;
}

export const TradeContext = createContext<TradeContextType | undefined>(
  undefined
);

interface TradeProviderProps {
  children: ReactNode;
}

function tradeReducer(state: CartModel, action: TradeAction): CartModel {
  switch (action.type) {
    case "ADD_ITEM": {
      const { seller, productId, item } = action.payload;
      const sellerId = seller.id;
      const prevPackage = state[sellerId] || { seller, products: [] };

      // Megkeressük, van-e már ilyen termékblokk
      const existingProductIndex = prevPackage.products.findIndex(
        (p) => p.id === productId
      );

      let newProducts: TradeProductModel[];

      if (existingProductIndex > -1) {
        // Már van ilyen termék, csak hozzáadjuk a tételt
        const existingProduct = prevPackage.products[existingProductIndex];
        const updatedProduct: TradeProductModel = {
          ...existingProduct,
          items: [...existingProduct.items, item],
        };
        newProducts = [...prevPackage.products];
        newProducts[existingProductIndex] = updatedProduct;
      } else {
        // Nincs ilyen termék, új blokkot hozunk létre
        newProducts = [
          ...prevPackage.products,
          {
            id: productId,
            items: [item],
          },
        ];
      }

      return {
        ...state,
        [sellerId]: {
          ...prevPackage,
          products: newProducts,
        },
      };
    }

    case "REMOVE_ITEM": {
      const { sellerId, productId, itemId } = action.payload;
      const prevPackage = state[sellerId];
      if (!prevPackage) return state;

      // Frissített terméklista: csak azok, amelyek maradnak
      const updatedProducts = prevPackage.products
        .map((product) => {
          if (product.id !== productId) return product;
          const filteredItems = product.items.filter((it) => it.id !== itemId);
          return {
            ...product,
            items: filteredItems,
          };
        })
        // Ha egy termék blokkban nincs több tétel, töröljük magát a blokkot
        .filter((product) => {
          product.items.length > 0;
        });

      // Ha már nincs több termék sem ebben a csomagban, töröljük a csomagot
      if (updatedProducts.length === 0) {
        const { [sellerId]: _, ...rest } = state;
        return rest;
      }

      return {
        ...state,
        [sellerId]: {
          ...prevPackage,
          products: updatedProducts,
        },
      };
    }

    case "REMOVE_PACKAGE": {
      const { sellerId } = action.payload;
      const { [sellerId]: _, ...rest } = state;
      return rest;
    }

    case "CLEAR_CART":
      return {};

    default:
      return state;
  }
}

const TradeProvider = ({ children }: TradeProviderProps) => {
  const [cart = {}, setCart] = useLocalStorage<CartModel>("CART", {});

  const dispatch: Dispatch<TradeAction> = (action) => {
    setCart((prev) => tradeReducer(prev || {}, action));
  };

  const addItem = (
    seller: SellerModel,
    productId: number,
    item: TradeItemModel
  ) =>
    dispatch({
      type: "ADD_ITEM",
      payload: { seller, productId, item },
    });

  const removeItem = (sellerId: number, productId: number, itemId: number) =>
    dispatch({
      type: "REMOVE_ITEM",
      payload: { sellerId, productId, itemId },
    });

  const removePackage = (sellerId: number) =>
    dispatch({ type: "REMOVE_PACKAGE", payload: { sellerId } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <TradeContext
      value={{
        cart,
        addItem,
        removeItem,
        removePackage,
        clearCart,
      }}>
      {children}
    </TradeContext>
  );
};

export default TradeProvider;
