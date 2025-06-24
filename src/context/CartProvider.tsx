import CryptoJS from "crypto-js";
import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useSessionStorage } from "react-use";
import {
  CartItemModel,
  CartModel,
  CartPackageModel,
  SellerModel,
} from "../models/cartModel";
import { useAuth } from "../hooks/auth/useAuth";

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { seller: SellerModel; item: CartItemModel };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { sellerId: number; itemId: number };
    }
  | {
      type: "REMOVE_PACKAGE";
      payload: { sellerId: number };
    }
  | {
      type: "CLEAR_CART";
    };

interface CartContextType {
  cart: CartModel;
  addItem: (seller: SellerModel, item: CartItemModel) => void;
  removeItem: (sellerId: number, itemId: number) => void;
  removePackage: (sellerId: number) => void;
  clearCart: () => void;
  cartPackageCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

const encryptCart = (cart: CartModel, key: string): string => {
  // JSON → string → AES-kódolt Base64
  return CryptoJS.AES.encrypt(JSON.stringify(cart), key).toString();
};

const decryptCart = (cipher: string, key: string): CartModel => {
  // AES visszafejtés → UTF8 → JSON.parse
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  return text ? JSON.parse(text) : {};
};

const cartReducer = (state: CartModel, action: CartAction): any => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { seller, item } = action.payload;
      const sellerId = seller.id;

      // Megnézzük, van-e már csomag erre az eladóra
      const prevPackage = state[sellerId];
      if (prevPackage) {
        // Frissítjük a meglévőt: csak bővítjük az items tömböt
        const exists = prevPackage.items.some((i) => i.id === item.id);
        if (exists) {
          // Ha már benne van az item, nem csinálunk semmit
          return state;
        }

        return {
          ...state,
          [sellerId]: {
            ...prevPackage,
            items: [...prevPackage.items, item],
          },
        };
      } else {
        // Új csomagot hozunk létre az eladóhoz
        const newPackage: CartPackageModel = {
          // id: cuid(),
          seller,
          items: [item],
        };
        return {
          ...state,
          [sellerId]: newPackage,
        };
      }
    }

    case "REMOVE_ITEM": {
      const { sellerId, itemId } = action.payload;

      const prevPackage = state[sellerId];
      if (!prevPackage) {
        // Ha nincs ilyen csomag, nem csinálunk semmit
        return state;
      }

      // Szűrjük ki a törölni kívánt item-et
      const remainingItems = prevPackage.items.filter((i) => i.id !== itemId);
      if (remainingItems.length === 0) {
        // Ha az összes item törlődött, eltávolítjuk a csomagot
        const { [sellerId]: _, ...rest } = state;
        return rest;
      } else {
        // Ha maradtak item-ek, frissítjük a csomagot
        return {
          ...state,
          [sellerId]: {
            ...prevPackage,
            items: remainingItems,
          },
        };
      }
    }

    case "REMOVE_PACKAGE": {
      const { sellerId } = action.payload;
      // Töröljük az adott sellerId-hez tartozó bejegyzést
      const { [sellerId]: _, ...rest } = state;
      return rest;
    }

    case "CLEAR_CART":
      return {};

    default:
      return state;
  }
};

const CartProvider = ({ children }: CartProviderProps) => {
  const { auth } = useAuth();
  const userId = auth?.user?.id;

  // 1) Betöltés sessionStorage-ból
  const storageKey = `CART__${userId}`;
  const [storedCipher, setStoredCipher] = useSessionStorage<string | null>(
    storageKey,
    null
  );

  // 2) Inicializáljuk a state-et:
  const initCart = (cipher: string | null) =>
    cipher ? decryptCart(cipher, String(userId)) : {};
  const [cart, dispatch] = useReducer(cartReducer, storedCipher, initCart);

  // 3) Minden state változásnál frissítjük a storage-t
  useEffect(() => {
    if (userId) {
      const cipher = encryptCart(cart, String(userId));
      setStoredCipher(cipher);
    }
  }, [cart, userId, setStoredCipher]);

  const addItem = (seller: SellerModel, item: CartItemModel) =>
    dispatch({ type: "ADD_ITEM", payload: { seller, item } });

  const removeItem = (sellerId: number, itemId: number) =>
    dispatch({ type: "REMOVE_ITEM", payload: { sellerId, itemId } });

  const removePackage = (sellerId: number) =>
    dispatch({ type: "REMOVE_PACKAGE", payload: { sellerId } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartPackageCount = useMemo(() => {
    // Return the number of packages in the cart
    return Object.keys(cart).length;
  }, [cart]);

  if (!userId) {
    return <>{children}</>;
  }

  return (
    <CartContext
      value={{
        cart,
        addItem,
        removeItem,
        removePackage,
        clearCart,
        cartPackageCount,
      }}>
      {children}
    </CartContext>
  );
};

export default CartProvider;
