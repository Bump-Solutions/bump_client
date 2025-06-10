import { Option } from "./form";

export interface CatalogProduct {
  id: number | null;
  brand: string;
  model: string;
  color_way: string;
  category: number;
  colors: string;
}

export interface Item {
  id?: number;
  size: Option | null;
  condition: Option | null;
  price: number | null;
  gender: Option | null;
  state?: number;
}
