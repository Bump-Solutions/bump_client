import {
  FetchedOrderDTO,
  CreateOrderDTO,
  OrdersPageDTO,
} from "../dtos/OrderDTO";
import {
  CreateOrderModel,
  OrderModel,
  OrdersPageModel,
} from "../models/orderModel";

export function fromOrdersPageDTO(dto: OrdersPageDTO): OrdersPageModel {
  return {
    orders: dto.orders.map(fromOrderDTO),
    next: dto.next,
    previous: dto.previous,
    count: dto.count,
    totalPages: dto.total_pages,
  };
}

export function fromOrderDTO(dto: FetchedOrderDTO): OrderModel {
  return {
    id: dto.id,
    uuid: dto.uuid,

    state: dto.state,
    validActions: dto.valid_actions,

    isSeller: dto.is_seller,
    party: {
      id: dto.party.id,
      username: dto.party.username,
      profilePicture: dto.party.profile_picture,
    },

    createdAt: dto.created_at,
    expiresAt: dto.expires_at,
  };
}

export function toCreateOrderDTO(newOrder: CreateOrderModel): CreateOrderDTO {
  switch (newOrder.source) {
    case "cart":
      return {
        seller: newOrder.sellerId,
      };

    // case "product":
    default:
      return {
        seller: newOrder.sellerId,
        inventory_item_ids: newOrder.itemIds,
      };
  }
}
