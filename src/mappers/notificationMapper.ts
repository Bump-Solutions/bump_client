import { FetchedNotificationDTO } from "../dtos/NotificationDTO";
import { NotificationModel } from "../models/notificationModel";

export function fromNotificationDTO(
  dto: FetchedNotificationDTO
): NotificationModel {
  return {
    id: dto.id,
    sender: dto.sender_username,
    senderProfilePicture: dto.sender_profile_picture,

    type: dto.notification_type,
    targetId: dto.target_id,
    targetType: dto.target_type,

    verb: dto.verb,
    isRead: dto.is_read,

    updatedAt: dto.updated_at,
  };
}
