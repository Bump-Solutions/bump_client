import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { UserModel } from "../models/userModel";
import { AxiosInstance } from "axios";
import { FileUpload } from "../types/form";
import {
  ChatGroupModel,
  InboxModel,
  MessagesPageModel,
} from "../models/chatModel";
import { InboxDTO, MessagesPageDTO } from "../dtos/ChatDTO";
import { fromChatGroupDTO, fromMessageDTO } from "../mappers/chatMapper";

export const listChatGroups = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
): Promise<InboxModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: InboxDTO;
  }>(API.CHAT.LIST_CHAT_GROUPS(size, page, searchKey), { signal });

  const data: InboxDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    messages: data.messages.map(fromChatGroupDTO),
  };
};

export const createChatGroup = async (
  axiosPrivate: AxiosInstance,
  uid: UserModel["id"]
): Promise<ApiResponse> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  return await axiosPrivate.post(API.CHAT.CREATE_CHAT_GROUP, {
    user_id: uid,
  });
};

export const markMessageAsUnread = async (
  axiosPrivate: AxiosInstance,
  chat: ChatGroupModel["name"]
): Promise<ApiResponse> => {
  if (!chat) throw new Error("Missing required parameter: chat");

  return await axiosPrivate.put(API.CHAT.MARK_MESSAGE_AS_UNREAD(chat));
};

export const listMessages = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  chat: ChatGroupModel["name"],
  size: number,
  page: number
): Promise<MessagesPageModel> => {
  const response: ApiResponse = await axiosPrivate.get<{
    message: MessagesPageDTO;
  }>(API.CHAT.LIST_MESSAGES(chat, size, page), { signal });

  const data: MessagesPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    messages: data.messages.map(fromMessageDTO),
  };
};

export const uploadChatImages = async (
  axiosPrivate: AxiosInstance,
  chat: ChatGroupModel["name"],
  images: FileUpload[]
): Promise<ApiResponse> => {
  if (!chat) throw new Error("Missing required parameter: chat");

  const formData = new FormData();

  images.forEach((image) => {
    formData.append("images", image.file);
  });

  return await axiosPrivate.post(API.CHAT.UPLOAD_CHAT_IMAGES(chat), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
