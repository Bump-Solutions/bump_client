import { FetchedOrderDTO, CreateOrderDTO } from "../dtos/OrderDTO";
import { CreateOrderModel, OrderModel } from "../models/orderModel";

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
  return {
    seller: newOrder.sellerId,
    inventory_item_ids: newOrder.itemIds,
  };
}
