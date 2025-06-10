export interface InventoryModel {
  products: ProductListModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of products available
}

export interface ProductListModel {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  size?: string; // Single item
  price?: number;
  minPrice?: number;
  discountedPrice?: number;
  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  badges: BadgeCollection;
  itemsCount: number; // the number of items in the product
  ownProduct: boolean; // if the authenticated user is the owner of this product
}

export interface ProductModel {
  id: number;
  title: string;
  description: string;
  images: string[];

  product: {
    id: number;
    brand: string;
    model: string;
    colorWay: string;
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
    onSale: boolean; // if the item is on sale
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
  };

  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  badges: BadgeCollection;
  ownProduct: boolean; // if the authenticated user is the owner of this product
}

export interface Badge {
  text: string;
  type: string;
  priority: number;
  value?: string | number;
}

export type BadgeType = "new" | "discount" | "recommended" | "popular";

export type BadgeCollection = Partial<Record<BadgeType, Badge>>;
