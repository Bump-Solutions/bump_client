export interface NotificationModel {
  id: number;
  sender: string; // The username of the user who sent the notification
  senderProfilePicture: string; // The profile picture URL of the sender
  type: number;

  targetId: number | string; // The ID of the target object (e.g., product, user, etc.)
  targetType: string; // The type of the target object (e.g., "product", "user", etc.)

  verb: string;
  isRead: boolean; // Whether the notification has been read

  updatedAt: string; // The date and time when the notification was last updated
}

export interface NotificationsPageModel {
  notifications: NotificationModel[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number;
  unreadCount: number; // The number of unread notifications
}
