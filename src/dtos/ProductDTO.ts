import { BadgeCollection } from "../models/productModel";

export interface InventoryDTO {
  products: ListProductDTO[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of products available
}

// A backend “GET /product/list_products” válaszában érkező terméklista adatok.
export interface ListProductDTO {
  id: number;
  title: string;
  description: string;
  images: { src: string }[];
  category: string;
  condition: string;
  size?: string; // Single item
  price?: number; // Single item
  min_price?: number; // Multiple items with different prices
  discounted_price?: number;
  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  badges: BadgeCollection;
  items_count: number; // the number of items in the product
  own_product: boolean; // if the authenticated user is the owner of this product
}

// A backend “GET /product/:pid válaszában érkező termék adatok. (single product)
export interface FetchedProductDTO {
  id: number;
  title: string;
  description: string;
  images: { src: string }[];

  product: {
    id: number;
    brand: string;
    model: string;
    color_way: string;
    category: string;
    colors: string; // Comma separated colors
  }; // Catalog product

  items: {
    id: number;
    condition: number;
    price: number;
    size: string;
    state: number;
    gender: number;
    on_sale: boolean; // if the item is on sale
  }[]; // Array of items in the product

  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    bio: string;
    profile_picture: string | null;
    profile_background_color: string | null;
    profile_picture_color_palette: string | null;
  }; // The user who created the product

  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  badges: BadgeCollection;
  own_product: boolean; // if the authenticated user is the owner of this product
}
