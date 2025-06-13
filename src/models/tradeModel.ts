// Seller
export interface SellerModel {
  id: number;
  username: string;
}

// Single item of a product, aggregated
export interface TradeItemModel {
  id: number;
}

// Represents a product in a seller's package
export interface TradeProductModel {
  id: number;
  items: TradeItemModel[];
}

// Each Seller has one corresponding TradePackage
export interface TradePackageModel {
  id: number;
  products: TradeProductModel[];
}

// Represents the entire cart, containing multiple TradePackages from different sellers
// sellerId: TradePackage
export type CartModel = Record<number, TradePackageModel>;
