import { UserModel } from "./userModel";

export interface SearchPageModel<T> {
  search_result: T[]; // Array of search results, can be products or users
  next: number | null;
  previous: string | null;
  count: number;
}

export type UserSearchModel = Partial<UserModel>;

export interface ProductSearchModel {
  id: number;
  title: string;
  label: string;
  description: string;
  username: string;
  createdAt: string;
  image: string;
  /* 
  product: {
    brand: string;
    model: string;
    colorWay: string;
    colors: string;
  };
  */
}

export interface SearchHistoryItemModel {
  id: number;
  type: number; // 0 | 1
  query: string;
}
