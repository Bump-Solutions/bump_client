export interface CartItemDTO {
  id: number; // Inventory item ID

  size: string;
  gender: number;
  condition: number;

  price: number;

  has_discount: boolean;
  discount_percentage?: number;
  discounted_price?: number;
}

export interface CatalogProductRefDTO {
  brand: string;
  model: string;
  color_way: string;
  category: number;
  colors: string;
}

export interface CartProductDTO {
  id: number; // Product ID
  title: string; // Product title

  product: CatalogProductRefDTO; // Product snapshot

  image: string;

  items: CartItemDTO[];
}

export interface CartPackageDTO {
  id: number; // Seller ID
  username: string; // Seller username
  profile_picture: string | null; // Seller profile picture URL

  inventories: CartProductDTO[]; // List of products in this package
}

export interface CartSummaryDTO {
  packages_count: number;
  items_count: number;

  gross_total: number; // Total price before discount
  total_discount_value: number; // Total discount value
  discounted_total: number; // Total price after discount
}

export interface CartDTO {
  packages: CartPackageDTO[];
  summary: CartSummaryDTO;
}
