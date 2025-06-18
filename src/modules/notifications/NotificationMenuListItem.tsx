import { ROUTES } from "../../routes/routes";
import { useMarkNotificationAsRead } from "../../hooks/notifications/useMarkNotificationAsRead";
import { MouseEvent } from "react";
import { useNavigate } from "react-router";
import { NotificationModel } from "../../models/notificationModel";
import { formatRelativeTime } from "../../utils/functions";

import Image from "../../components/Image";

interface NotificationMenuListItemProps {
  notification: NotificationModel;
  toggleNotificationMenu: (bool: boolean) => void;
}

const IMAGE_IDENTIFIER = "fbad7900-a30c-4700-a52b-dc9f29dfb1f2";

const NotificationMenuListItem = ({
  notification,
  toggleNotificationMenu,
}: NotificationMenuListItemProps) => {
  const navigate = useNavigate();

  const markNotificationAsRead = useMarkNotificationAsRead();

  const renderContent = () => {
    const { updatedAt, type, sender, verb } = notification;

    switch (type) {
      case 0: // Message
        if (verb === IMAGE_IDENTIFIER) {
          return (
            <>
              <p>
                <strong>{sender}</strong> képet küldött <br />
                <span>{formatRelativeTime(updatedAt)}</span>
              </p>
            </>
          );
        } else {
          return (
            <>
              <p>
                <strong>{sender}</strong> üzenetet küldött <br />
                <span>{formatRelativeTime(updatedAt)}</span>
              </p>
              <p className='verb'>{verb}</p>
            </>
          );
        }

      case 1: // Follow
        return (
          <>
            <p>
              <strong>{sender}</strong> követni kezdett <br />
              <span>{formatRelativeTime(updatedAt)}</span>
            </p>
          </>
        );

      case 2: // Like
        return (
          <>
            <p>
              <strong>{sender}</strong> kedvelte egy <strong>termékedet</strong>{" "}
              <br />
              <span>{formatRelativeTime(updatedAt)}</span>
            </p>
          </>
        );

      default:
        return null;
    }
  };

  const handleOnClick = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { isRead, targetType, targetId } = notification;

    if (!targetId) return;

    if (!isRead) {
      markNotificationAsRead.mutateAsync(notification.id);
    }

    toggleNotificationMenu(false);

    switch (targetType) {
      case "product":
        navigate(ROUTES.PRODUCT(targetId as number).ROOT);
        break;

      case "user":
        navigate(ROUTES.PROFILE(String(targetId)).ROOT);
        break;

      case "message":
        navigate(ROUTES.INBOX.CHAT(String(targetId)), {
          state: {
            partner: {
              username: notification.sender,
              profilePicture: notification.senderProfilePicture,
            },
          },
        });
        break;

      default:
        return;
    }
  };

  return (
    <li
      className={`notification-menu__item ${
        notification.isRead ? "" : "unread"
      }`}
      onClick={handleOnClick}>
      <div className='item__avatar'>
        <Image
          src={notification.senderProfilePicture}
          alt={notification.sender.slice(0, 2)}
        />
      </div>

      <div className='item__content'>{renderContent()}</div>

      {!notification.isRead && <div className='item__indicator' />}
    </li>
  );
};

export default NotificationMenuListItem;
