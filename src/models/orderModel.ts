export type OrderState = number;

export type OrderAction = "cancel" | "confirm" | "complete" | "pay";

export interface OrderModel {
  id: number;
  uuid: string;

  state: OrderState;
  validActions: OrderAction[];

  isSeller: boolean;
  party: {
    id: number;
    username: string;
    profilePicture: string | null;
  };

  createdAt: string;
  expiresAt: string;
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
