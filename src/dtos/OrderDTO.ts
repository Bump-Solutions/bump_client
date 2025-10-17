import { OrderAction, OrderListModel, OrderState } from "../models/orderModel";

export interface ListOrderDTO {
  id: number;
  uuid: string;

  state: OrderState;
  valid_actions: OrderAction[];

  is_seller: boolean; // true if the current user is the seller
  party: {
    id: number;
    username: string;
    profile_picture: string | null;
  };

  created_at: string;
  expires_at: string;
}

export interface FetchedOrderDTO {
  id: number;
  uuid: string;

  state: OrderState;
  valid_actions: OrderAction[];

  is_seller: boolean; // true if the current user is the seller
  party: {
    id: number;
    username: string;
    profile_picture: string | null;
  };

  inventory_items: {}[];

  created_at: string;
  expires_at: string;
}

export interface OrdersPageDTO {
  orders: ListOrderDTO[];
  next: number | null;
  previous: string | null;
  count: number;
  total_pages: number;
}

export interface CreateOrderDTO {
  seller: number;
  inventory_item_ids?: number[];
}
