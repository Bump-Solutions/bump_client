export interface FetchedNotificationDTO {
  id: number;
  sender: number; // The ID of the user who sent the notification
  recipient: number; // The ID of the user who received the notification
  notification_type: string; // The type of notification (e.g., "like", "comment", etc.)

  target_id: number; // The ID of the target object (e.g., product, user, etc.)
  target_type: string; // The type of the target object (e.g., "product", "user", etc.)

  verb: string; // The action performed (e.g., "liked", "commented", etc.)
  is_read: boolean; // Whether the notification has been read

  created_at: string; // The date and time when the notification was created
  updated_at: string; // The date and time when the notification was last updated
}

export interface NotificationsPageDTO {
  notifications: FetchedNotificationDTO[];
  next: number | null; // The next page number, or null if there are no more pages
  previous: string | null; // The previous page URL, or null if there are no previous pages
  count: number; // The total number of notifications available
}
