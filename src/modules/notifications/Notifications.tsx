import "../../assets/css/notification.css";
import { ENUM } from "../../utils/enum";
import { useLocation } from "react-router";
import { useTitle } from "react-use";
import { useState } from "react";
import { NotificationType } from "../../context/NotificationsProvider";

import NotificationsHeader from "./NotificationsHeader";
import NotificationsNav from "./NotificationsNav";
import NotificationsList from "./NotificationsList";

const Notifications = () => {
  useTitle(`Értesítések - ${ENUM.BRAND.NAME}`);

  const location = useLocation();
  const type: NotificationType = location.state?.type || 1; // Default to 1 if not provided

  const [activeTabIndex, setActiveTabIndex] = useState<NotificationType>(type);

  return (
    <section className='notifications'>
      <NotificationsHeader />

      <NotificationsNav
        activeTabIndex={activeTabIndex}
        setActiveTabIndex={setActiveTabIndex}
      />

      <NotificationsList activeTabIndex={activeTabIndex} />
    </section>
  );
};

export default Notifications;
