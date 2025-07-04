export interface FetchedOrderDTO {}

export interface OrdersPageDTO {
  orders: FetchedOrderDTO[];
  next: number | null;
  previous: string | null;
  count: number;
}
