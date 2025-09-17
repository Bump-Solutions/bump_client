export type OrderState = number;

export interface OrderModel {
  id: number;
  state: OrderState;
  createdAt: string;
  expiresAt: string;
  sellerUsername: string;
  buyerUsername: string;
  products: {
    id: number;
    title: string;
  }[];
}

export interface OrdersPageModel {
  orders: OrderModel[];
  next: number | null;
  previous: string | null;
  count: number;
}

export interface CreateOrderModel {
  sellerId: number;
  itemIds: number[];
}

export interface CreateOrderDTO {
  seller: number;
  inventory_item_ids: number[];
}
