export interface OrderModel {}

export interface OrdersPageModel {
  orders: OrderModel[];
  next: number | null;
  previous: string | null;
  count: number;
}
