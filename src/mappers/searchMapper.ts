import { ProductSearchDTO, UserSearchDTO } from "../dtos/SearchDTO";
import { ProductSearchModel, UserSearchModel } from "../models/searchModel";

export function fromUserSearchDTO(dto: UserSearchDTO): UserSearchModel {
  return {
    username: dto.username,
    email: dto.email,
    // bio: dto.bio ?? null,
    profilePicture: dto.profile_picture ?? null,
    followersCount: dto.followers_count,
  };
}

export function fromProductSearchDTO(
  dto: ProductSearchDTO
): ProductSearchModel {
  return {
    id: dto.id,
    title: dto.title,
    label: dto.label,
    description: dto.description,
    username: dto.username,
    createdAt: dto.created_at,
    image: dto.image,
  };
}
