import { use } from "react";
import { NotificationsContext } from "../../modules/navigation/Navbar";

export const useNotifications = () => {
  const context = use(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within an NotificationsProvider"
    );
  }

  return context;
};
