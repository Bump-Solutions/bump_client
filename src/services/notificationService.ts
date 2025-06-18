import { AxiosInstance } from "axios";
import { API } from "../utils/api";
import { NotificationsPageModel } from "../models/notificationModel";
import { NotificationsPageDTO } from "../dtos/NotificationDTO";
import { fromNotificationDTO } from "../mappers/notificationMapper";
import { ApiResponse } from "../types/api";

export const listNotifications = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  type: number,
  size: number,
  page: number
): Promise<NotificationsPageModel> => {
  let endpoint: string;
  switch (type) {
    case 1: // Message-related notifications
      endpoint = API.NOTIFICATIONS.LIST_MESSAGE_RELATED_NOTIFICATIONS(
        size,
        page
      );
      break;
    case 2: // General notifications
      endpoint = API.NOTIFICATIONS.LIST_GENERAL_NOTIFICATIONS(size, page);
      break;
    default:
      throw new Error("Invalid notification type");
  }

  const response = await axiosPrivate.get<{ message: NotificationsPageDTO }>(
    endpoint,
    {
      signal,
    }
  );

  const data: NotificationsPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  const { unread_count, ...rest } = data;

  return {
    ...rest,
    unreadCount: unread_count,
    notifications: data.notifications.map(fromNotificationDTO),
  };
};

export const markNotificationAsRead = async (
  axiosPrivate: AxiosInstance,
  notificationId: number
): Promise<ApiResponse> => {
  if (!notificationId) {
    throw new Error("Missing required parameter: notificationId");
  }

  return await axiosPrivate.put(
    API.NOTIFICATIONS.MARK_NOTIFICATION_AS_READ(notificationId)
  );
};
