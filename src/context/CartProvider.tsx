import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  CartItemModel,
  CartModel,
  CartPackageModel,
  CartProductModel,
  CatalogProductRefModel,
  MoneyModel,
  SellerModel,
} from "../models/cartModel";
import {
  emptyCart,
  loadCart,
  saveCart,
  userCartKey,
} from "../storage/cartStorage";
import { useAuth } from "../hooks/auth/useAuth";
import { clampDiscount, computeDiscounted } from "../utils/pricing";

// Cart time-to-live (ms)
const TTL = 48 * 60 * 60 * 1000; // 48 óra base
// const TTL = 24 * 60 * 60 * 1000;
// const TTL = 60 * 1000; // 1 perc teszteléshez

// ------------------------------
// Helpers: summary + pricing kalkuláció
// ------------------------------

/** Visszaadja a tétel fizetendő árát (minor units) */
function effectiveItemAmount(item: CartItemModel): number {
  // 1) ha van snapshotolt discountedPrice, azt használd
  if (item.discountedPrice?.amount != null) return item.discountedPrice.amount;

  // 2) ha van discountPercent, számold
  const discount = clampDiscount(item.discountPercent);
  if (discount) {
    // price * (100 - d) / 100, biztonságos kerekítéssel
    return computeDiscounted(item.price.amount, discount);
  }

  // 3) különben az alapár
  return item.price.amount;
}

function sumMoney(
  amounts: number[],
  currency: MoneyModel["currency"]
): MoneyModel {
  const total = amounts.reduce((acc, val) => acc + val, 0);
  return { amount: total, currency };
}

function computeSummary(
  packages: Record<number, CartPackageModel>,
  currency: MoneyModel["currency"] = "HUF"
): CartModel["summary"] {
  let itemsCount = 0;
  let packagesCount = 0;

  const grossParts: number[] = [];
  const effectiveParts: number[] = [];

  for (const pkg of Object.values(packages)) {
    packagesCount++;
    for (const prod of Object.values(pkg.products)) {
      for (const item of prod.items) {
        itemsCount++;
        grossParts.push(item.price.amount);
        effectiveParts.push(effectiveItemAmount(item));
      }
    }
  }

  const grossSubtotal = sumMoney(grossParts, currency);
  const indicativeSubtotal = sumMoney(effectiveParts, currency);
  const discountsTotal = {
    amount: Math.max(0, grossSubtotal.amount - indicativeSubtotal.amount),
    currency,
  };

  return {
    packagesCount,
    itemsCount,

    grossSubtotal,
    discountsTotal,
    indicativeSubtotal,

    computedAt: new Date().toISOString(),
  };
}

// ------------------------------
// Actions / Reducer
// ------------------------------
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        seller: SellerModel;
        productRef: CatalogProductRefModel;
        item: CartItemModel;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { sellerId: number; productId: number; itemId: number };
    }
  | {
      type: "REMOVE_PRODUCT";
      payload: { sellerId: number; productId: number };
    }
  | {
      type: "REMOVE_PACKAGE";
      payload: { sellerId: number };
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "PURGE_EXPIRED";
      payload: { now?: number };
    }
  | {
      type: "_REPLACE"; // hydrate/merge/reset
      payload: CartModel;
    };

function withSummary(next: CartModel): CartModel {
  return {
    ...next,
    summary: computeSummary(
      next.packages,
      next.summary.indicativeSubtotal.currency ?? "HUF"
    ),
  };
}

const cartReducer = (state: CartModel, action: CartAction): CartModel => {
  switch (action.type) {
    case "_REPLACE": {
      const incoming = action.payload;
      // alapvédelmek a struktúrára
      const safe =
        incoming && typeof incoming === "object"
          ? incoming
          : emptyCart(state.summary.indicativeSubtotal.currency);
      return withSummary({
        ...emptyCart(state.summary.indicativeSubtotal.currency),
        ...safe,
        version: 2,
      });
    }

    case "ADD_ITEM": {
      const { seller, productRef, item } = action.payload;
      const sellerId = seller.id;
      const productId = productRef.id;

      // snapshotolt kedvezményes ár beállítása, ha hiányzik
      let nextItem = item;
      if (item.discountPercent != null && item.discountedPrice == null) {
        const discount = Math.max(
          1,
          Math.min(100, Math.floor(item.discountPercent))
        );
        const effective = computeDiscounted(item.price.amount, discount);

        nextItem = {
          ...item,
          discountPercent: discount,
          discountedPrice: { amount: effective, currency: item.price.currency },
        };
      }

      const nextPackages: Record<number, CartPackageModel> = {
        ...state.packages,
      };
      const prevPkg = state.packages[sellerId];

      if (!prevPkg) {
        nextPackages[sellerId] = {
          seller,
          products: {
            [productId]: {
              product: productRef,
              items: [nextItem],
              lastUpdatedAt: new Date().toISOString(),
            },
          },
          lastUpdatedAt: new Date().toISOString(),
        };

        return withSummary({
          ...state,
          packages: nextPackages,
        });
      }

      const products = { ...prevPkg.products };
      const prevProd = prevPkg.products[productId];

      if (!prevProd) {
        products[productId] = {
          product: productRef,
          items: [nextItem],
          lastUpdatedAt: new Date().toISOString(),
        };
      } else {
        // duplikát ellenőrzés az adott terméken belül
        if (prevProd.items.find((it) => it.id === nextItem.id)) {
          return state; // már benne van
        }
        products[productId] = {
          ...prevProd,
          items: [...prevProd.items, nextItem],
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      nextPackages[sellerId] = {
        ...prevPkg,
        products,
        lastUpdatedAt: new Date().toISOString(),
      };

      return withSummary({
        ...state,
        packages: nextPackages,
      });
    }

    case "REMOVE_ITEM": {
      const { sellerId, productId, itemId } = action.payload;
      const prevPkg = state.packages[sellerId];
      if (!prevPkg) return state; // nincs ilyen csomag

      const prevProd = prevPkg.products[productId];
      if (!prevProd) return state;

      const remaining = prevProd.items.filter((it) => it.id !== itemId);

      const nextPackages: Record<number, CartPackageModel> = {
        ...state.packages,
      };
      const nextProducts: Record<number, CartProductModel> = {
        ...prevPkg.products,
      };

      if (remaining.length === 0) {
        delete nextProducts[productId]; // nincs több item ennél a terméknél → töröljük a productot
      } else {
        nextProducts[productId] = {
          ...prevProd,
          items: remaining,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      if (Object.keys(nextProducts).length === 0) {
        // nincs több product ennél az eladónál → töröljük a package-et
        delete nextPackages[sellerId];
      } else {
        nextPackages[sellerId] = {
          ...prevPkg,
          products: nextProducts,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      return withSummary({
        ...state,
        packages: nextPackages,
      });
    }

    case "REMOVE_PRODUCT": {
      const { sellerId, productId } = action.payload;
      const prevPkg = state.packages[sellerId];
      if (!prevPkg) return state; // nincs ilyen csomag

      const nextPackages: Record<number, CartPackageModel> = {
        ...state.packages,
      };
      const nextProducts: Record<number, CartProductModel> = {
        ...prevPkg.products,
      };
      delete nextProducts[productId];

      if (Object.keys(nextProducts).length === 0) {
        // nincs több product ennél az eladónál → töröljük a package-et
        delete nextPackages[sellerId];
      } else {
        nextPackages[sellerId] = {
          ...prevPkg,
          products: nextProducts,
          lastUpdatedAt: new Date().toISOString(),
        };
      }

      return withSummary({
        ...state,
        packages: nextPackages,
      });
    }

    case "REMOVE_PACKAGE": {
      const { sellerId } = action.payload;
      if (!state.packages[sellerId]) return state; // nincs ilyen csomag

      const nextPackages: Record<number, CartPackageModel> = {
        ...state.packages,
      };
      delete nextPackages[sellerId];

      return withSummary({
        ...state,
        packages: nextPackages,
      });
    }

    case "CLEAR_CART": {
      return withSummary({
        ...state,
        packages: {},
      });
    }

    case "PURGE_EXPIRED": {
      const now = action.payload.now ?? Date.now();
      const nextPackages: Record<number, CartPackageModel> = {};

      for (const [sid, pkg] of Object.entries(state.packages)) {
        const nextProducts: Record<number, CartProductModel> = {};
        for (const [pid, prod] of Object.entries(pkg.products)) {
          const freshItems = prod.items.filter((it) => {
            const t = Date.parse(it.addedAt);
            return !Number.isNaN(t) && now - t <= TTL;
          });
          if (freshItems.length) {
            nextProducts[+pid] = {
              ...prod,
              items: freshItems,
              lastUpdatedAt: new Date().toISOString(),
            };
          }
        }

        if (Object.keys(nextProducts).length) {
          nextPackages[+sid] = {
            ...pkg,
            products: nextProducts,
            lastUpdatedAt: new Date().toISOString(),
          };
        }
      }

      return withSummary({
        ...state,
        packages: nextPackages,
      });
    }

    default:
      return state;
  }
};

// ------------------------------
// Context + Provider
// ------------------------------
interface CartContextType {
  cart: CartModel;

  addItem: (
    seller: SellerModel,
    productRef: CatalogProductRefModel,
    item: CartItemModel
  ) => void;
  removeItem: (sellerId: number, productId: number, itemId: number) => void;
  removeProduct: (sellerId: number, productId: number) => void;
  removePackage: (sellerId: number) => void;
  clearCart: () => void;

  isHydrating: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  const { auth } = useAuth();
  const userId = auth?.user?.id;
  const key = userCartKey(userId);

  const [isHydrating, setIsHydrating] = useState(true);

  // Memória állapot (derived summary-vel)
  const [cart, dispatch] = useReducer(cartReducer, emptyCart("HUF"));

  // PURGE: lejárt tételek eltávolítása
  useEffect(() => {
    const run = () => dispatch({ type: "PURGE_EXPIRED", payload: {} });
    const onVis = () => {
      if (document.visibilityState === "visible") run();
    };

    document.addEventListener("visibilitychange", onVis);
    run(); // induláskor is

    return () => {
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // HYDRATE: IndexedDB -> memória
  useEffect(() => {
    let cancelled = false;

    // declare and call
    (async () => {
      setIsHydrating(true);

      const fromDb = userId ? await loadCart(key) : null;
      if (!cancelled && fromDb) {
        dispatch({ type: "_REPLACE", payload: fromDb });
      }
      setIsHydrating(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, key]);

  // PERSIST: memória -> IndexedDB
  useEffect(() => {
    if (!userId) return; // csak autentikált állapotban
    saveCart(key, cart); // aszinkron; hiba esetén csendes
  }, [cart, userId, key]);

  // public API
  const addItem = (
    seller: SellerModel,
    productRef: CatalogProductRefModel,
    item: CartItemModel
  ) => dispatch({ type: "ADD_ITEM", payload: { seller, productRef, item } });

  const removeItem = (sellerId: number, productId: number, itemId: number) =>
    dispatch({ type: "REMOVE_ITEM", payload: { sellerId, productId, itemId } });

  const removeProduct = (sellerId: number, productId: number) =>
    dispatch({ type: "REMOVE_PRODUCT", payload: { sellerId, productId } });

  const removePackage = (sellerId: number) =>
    dispatch({ type: "REMOVE_PACKAGE", payload: { sellerId } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  if (!userId) {
    // nem autentikált állapotban csak továbbadjuk a children-t (vagy fallbacket adhatsz)
    return <>{children}</>;
  }

  return (
    <CartContext
      value={{
        cart,
        addItem,
        removeItem,
        removeProduct,
        removePackage,
        clearCart,
        isHydrating,
      }}>
      {children}
    </CartContext>
  );
};

export default CartProvider;
