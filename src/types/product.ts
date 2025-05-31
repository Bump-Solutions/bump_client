import { Option } from "./form";
import { User } from "./user";

export interface CatalogProduct {
  id?: number | null;
  brand: string;
  model: string;
  colorway: string;
  category: number;
  colors: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  product: CatalogProduct;
  items: Item[];
  user: Partial<User>;
  images: ProductImage[];
  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  own_product: boolean; // if the authenticated user is the owner of this product
  badges: BadgeCollection;

  // for the product list page
  min_price?: number; // the minimum price of the product's items
  price?: number; // if only one item
  discounted_price?: number; // the discounted price of the product's items
  size?: string; // if only one item
  condition?: string; // the condition of the product's items
  items_count?: number; // the number of items in the product
}

export interface Item {
  id?: number;
  size: Option | null;
  condition: Option | null;
  price: number | null;
  gender: Option | null;
  state?: number;
}

export interface ProductImage {
  src: string;
}

export interface Badge {
  text: string;
  type: string;
  priority: number;
  value?: string | number;
}

export type BadgeType = "new" | "discount" | "recommended" | "popular";

export type BadgeCollection = Partial<Record<BadgeType, Badge>>;

export interface Inventory {
  products: IProduct[];
  next?: number;
}
