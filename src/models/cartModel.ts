// Seller
export interface SellerModel {
  id: number;
  username: string;
  profilePicture: string | null;
  // ...
}

// Represents a product in a seller's package
export interface CartItemModel {
  id: number;
  label: string;
  image: string;
  // ...
}

// Each Seller has one corresponding package
export interface CartPackageModel {
  // id: string;
  seller: SellerModel;
  items: CartItemModel[];
}

// Represents the entire cart, containing multiple TradePackages from different sellers
// sellerId: TradePackage
export type CartModel = Record<number, CartPackageModel>;
