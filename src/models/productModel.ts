import { FileUpload } from "../types/form";

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
  userId: number;
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
    category: number;
    colors: string; // Comma separated colors
  }; // Catalog product

  items: {
    id: number;
    condition: number;
    price: number;
    size: string;
    state: number;
    gender: number;
  }[]; // Array of items in the product

  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    bio: string;
    profilePicture: string | null;
    profileBackgroundColor: string | null;
    profilePictureColorPalette: string | null;
  };

  saves: number;
  saved: boolean; // if the authenticated user has saved this product
  likes: number;
  liked: boolean; // if the authenticated user has liked this product
  badges: BadgeCollection;
  ownProduct: boolean; // if the authenticated user is the owner of this product
}

export interface BrandModel {
  brand: string;
}

export interface BrandsPageModel {
  products: BrandModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of brands available
}

export interface ModelModel {
  model: string;
}

export interface ModelsPageModel {
  products: ModelModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of models available
}

export interface ColorwayModel {
  id: number; // Catalog product ID (brand + model + colorway)
  colorWay: string;
}

export interface ColorwaysPageModel {
  products: ColorwayModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of colorways available
}

// Product upload model on client side
export interface CreateProductModel {
  // 1st step
  title: string;
  description: string;

  // 2nd step - catalog or not: if isCatalog, then we only need the product ID
  product: {
    isCatalog: boolean; // true if the product is a catalog product
    id: number | null; // Catalog product ID, required if isCatalog is true
    brand?: string; // Required if isCatalog is false
    model?: string; // Required if isCatalog is false
    colorWay?: string; // Required if isCatalog is false
  };

  // 3rd step - items
  items: {
    condition: number | null; // Condition of the item, null if not set
    gender: number | null;
    size: number | null;
    price: number | null;
  }[];

  // 4th step - images
  images: FileUpload[];
}

export interface Badge {
  text: string;
  type: string;
  priority: number;
  value?: string | number;
}

export type BadgeType = "new" | "discount" | "recommended" | "popular";

export type BadgeCollection = Partial<Record<BadgeType, Badge>>;
