import localforage from "localforage";
import { CartModel, MoneyModel } from "../models/cartModel";

// -- localForage init (IndexedDB wrapper) ------------------------------------
localforage.config({
  name: "bump_cart_db",
  storeName: "carts_v1", // csak [a-z0-9_]
  // driver sorrend (opcionális): IndexedDB -> WebSQL -> localStorage
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
});

// -- Helpers -----------------------------------------------------------------
export const userCartKey = (userId?: number | string | null): string =>
  `CART_${userId ?? "ANON"}`;

export const emptyCart = (
  currency: MoneyModel["currency"] = "HUF"
): CartModel => ({
  packages: {},
  summary: {
    packagesCount: 0,
    itemsCount: 0,
    indicativeSubtotal: { amount: 0, currency },
    computedAt: new Date().toISOString(),
  },
  version: 1,
});

// -- CRUD --------------------------------------------------------------------
export async function loadCart(key: string): Promise<CartModel | null> {
  try {
    const cart = await localforage.getItem<CartModel>(key);
    return cart ?? null;
  } catch (error) {
    console.error("Error loading cart:", error);
    return null;
  }
}

export async function saveCart(key: string, cart: CartModel): Promise<void> {
  try {
    await localforage.setItem(key, cart);
  } catch (error) {
    // kvóta/engedély hiba: ne blokkolja a UI-t
    console.error("Error saving cart:", error);
  }
}

export async function removeCart(key: string): Promise<void> {
  try {
    await localforage.removeItem(key);
  } catch (error) {
    console.error("Error removing cart:", error);
  }
}
