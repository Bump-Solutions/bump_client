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

export interface BrandDTO {
  brand: string;
}

export interface BrandsPageDTO {
  products: BrandDTO[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of brands available
}

export interface ModelDTO {
  model: string;
}

export interface ModelsPageDTO {
  products: ModelDTO[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of models available
}

export interface ColorwayDTO {
  id: number; // Catalog product ID (brand + model + colorway)
  color_way: string;
}

export interface ColorwaysPageDTO {
  products: ColorwayDTO[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of colorways available
}

export interface CreateProductDTO {
  title: string;
  description: string;

  product: {
    is_catalog: boolean; // true if the product is a catalog product, false if it's a custom product
    id: number | null; // Catalog product ID, null if creating a new product
    brand?: string; // Required if isCatalog is false
    model?: string; // Required if isCatalog is false
    color_way?: string; // Required if isCatalog is false
    category?: number; // Required if isCatalog is false
    colors?: string; // Comma separated colors, required if isCatalog is false
  };

  items: {
    condition: number;
    gender: number;
    size: number;
    price: number;
    state: number;
  }[];

  county: number;

  images: { file: File }[];
}
