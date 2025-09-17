import { FetchedOrderDTO } from "../dtos/OrderDTO";
import {
  CreateOrderDTO,
  CreateOrderModel,
  OrderModel,
} from "../models/orderModel";

export function fromOrderDTO(dto: FetchedOrderDTO): OrderModel {
  return {};
}

export function toCreateOrderDTO(newOrder: CreateOrderModel): CreateOrderDTO {
  return {
    seller: newOrder.sellerId,
    inventory_item_ids: newOrder.itemIds,
  };
}
