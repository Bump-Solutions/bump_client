export interface NotificationModel {
  id: number;
  sender: number; // The ID of the user who sent the notification
  recipient: number; // The ID of the user who received the notification
  type: string;

  targetId: number; // The ID of the target object (e.g., product, user, etc.)
  targetType: string; // The type of the target object (e.g., "product", "user", etc.)

  verb: string;
  isRead: boolean; // Whether the notification has been read

  createdAt: string; // The date and time when the notification was created
  updatedAt: string; // The date and time when the notification was last updated
}

export interface NotificationsPageModel {
  notifications: NotificationModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number;
}
