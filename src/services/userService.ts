import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { AxiosInstance } from "axios";
import {
  FollowersPageModel,
  FollowingsPageModel,
  UserModel,
} from "../models/userModel";
import {
  FetchedUserDTO,
  FollowersPageDTO,
  FollowingsPageDTO,
} from "../dtos/UserDTO";
import {
  fromFetchedUserDTO,
  fromFollowerDTO,
  fromFollowingDTO,
} from "../mappers/userMapper";

export const listUsers = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance
): Promise<UserModel[]> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedUserDTO[];
  }>(API.USER.LIST_USERS, {
    signal,
  });

  return response.data.message.map(fromFetchedUserDTO);
};

export const getUser = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  uname: UserModel["username"]
): Promise<UserModel> => {
  if (!uname) throw new Error("Missing required parameter: uname");

  const response: ApiResponse = await axiosPrivate.get<{
    message: FetchedUserDTO;
  }>(API.USER.GET_USER(uname), {
    signal,
  });

  return fromFetchedUserDTO(response.data.message);
};

export const listFollowers = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"],
  size: number,
  page: number,
  searchKey: string
): Promise<FollowersPageModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const response: ApiResponse = await axiosPrivate.get<{
    message: FollowersPageDTO;
  }>(API.USER.LIST_FOLLOWERS(uid, size, page, searchKey), { signal });

  const data: FollowersPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    followers: data.followers.map(fromFollowerDTO),
  };
};

export const listFollowings = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"],
  size: number,
  page: number,
  searchKey: string
): Promise<FollowingsPageModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const response: ApiResponse = await axiosPrivate.get<{
    message: FollowingsPageDTO;
  }>(API.USER.LIST_FOLLOWING(uid, size, page, searchKey), { signal });

  const data: FollowingsPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    followings: data.followings.map(fromFollowingDTO),
  };
};

export const follow = async (
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"]
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.post(API.USER.FOLLOW, {
    following_user_id: uid,
  });
};

export const unfollow = async (
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"]
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.delete(API.USER.UNFOLLOW, {
    data: {
      following_user_id: uid,
    },
  });
};

export const deleteFollower = async (
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"]
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.delete(API.USER.DELETE_FOLLOWER, {
    data: {
      user_id: uid,
    },
  });
};
