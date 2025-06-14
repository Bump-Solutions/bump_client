import { AxiosInstance } from "axios";
import { API } from "../utils/api";
import { NotificationsPageModel } from "../models/notificationModel";
import { NotificationsPageDTO } from "../dtos/NotificationDTO";
import { fromNotificationDTO } from "../mappers/notificationMapper";

export const listNotifications = async (
  signal: AbortSignal,
  axiosPrivate: AxiosInstance,
  size: number,
  page: number
): Promise<NotificationsPageModel> => {
  const response = await axiosPrivate.get<{ message: NotificationsPageDTO }>(
    API.NOTIFICATIONS.LIST_NOTIFICATIONS(size, page),
    {
      signal,
    }
  );

  const data: NotificationsPageDTO = response.data.message;

  if (data.next) {
    data.next = page + 1;
  }

  return {
    ...data,
    notifications: data.notifications.map(fromNotificationDTO),
  };
};
