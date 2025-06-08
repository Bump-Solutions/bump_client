import { FetchedUserDTO, FollowerDTO, FollowingDTO } from "../dtos/UserDTO";
import { FollowerModel, FollowingModel, UserModel } from "../models/userModel";

export function fromFetchedUserDTO(dto: FetchedUserDTO): UserModel {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    firstName: dto.first_name,
    lastName: dto.last_name,
    phoneNumber: dto.phone_number,
    joined: dto.joined,

    profilePicture: dto.profile_picture ?? null,
    profilePictureHash: dto.profile_picture_hash ?? null,
    profileBackgroundColor: dto.profile_background_color ?? null,
    profilePictureColorPalette: dto.profile_picture_color_palette ?? null,

    chatName: dto.chat_name ?? null,

    following: dto.following,
    followersCount: dto.followers_count,
    followingsCount: dto.followings_count,
  };
}

export function fromFollowerDTO(dto: FollowerDTO): FollowerModel {
  return {
    userId: dto.user_id,
    username: dto.username,
    profilePicture: dto.profile_picture ?? null,
    myFollowing: dto.my_following,
    role: dto.role,
  };
}

export function fromFollowingDTO(dto: FollowingDTO): FollowingModel {
  return {
    userId: dto.following_user_id,
    username: dto.username,
    profilePicture: dto.profile_picture ?? null,
    myFollowing: dto.my_following,
    role: dto.role,
  };
}
