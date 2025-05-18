import { API } from "../utils/api";
import { ApiResponse } from "../types/api";
import { ChatGroup } from "../types/chat";
import { User } from "../types/user";
import { AxiosInstance } from "axios";
import { UploadedFile } from "../types/form";

export const listChatGroups = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number,
  searchKey: string
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.CHAT.LIST_CHAT_GROUPS(size, page, searchKey),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const createChatGroup = async (
  axiosPrivate: AxiosInstance,
  uid: User["id"]
): Promise<ApiResponse> => {
  return await axiosPrivate.post(API.CHAT.CREATE_CHAT_GROUP, {
    user_id: uid,
  });
};

export const listMessages = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  chat: ChatGroup["name"],
  size: number,
  page: number
): Promise<ApiResponse> => {
  const response: ApiResponse = await axiosPrivate.get(
    API.CHAT.LIST_MESSAGES(chat, size, page),
    { signal }
  );

  const data = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return data;
};

export const uploadChatImages = async (
  axiosPrivate: AxiosInstance,
  chat: ChatGroup["name"],
  images: UploadedFile[]
): Promise<ApiResponse> => {
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
