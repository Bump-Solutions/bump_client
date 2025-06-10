import { UserModel } from "../models/userModel";

export type Seller = { id: number } & Partial<Omit<UserModel, "id">>;

export interface TradeItem {
  id: number;
}

export interface TradeProduct {
  id: number;
  items: TradeItem[];
}

/**
 * Represents a package of products from a single seller in the cart.
 * Each TradePackage contains all products (and their items) from one seller.
 */
export interface ITradePackage {
  seller: Seller;
  products: TradeProduct[];
}

/**
 * The entire state of the cart, grouping TradePackages by seller.
 */
export type ICart = Record<string, ITradePackage>;
