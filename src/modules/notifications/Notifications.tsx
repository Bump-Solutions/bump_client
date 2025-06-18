import "../../assets/css/notification.css";
import { ENUM } from "../../utils/enum";
import { useLocation } from "react-router";
import { useTitle } from "react-use";
import { useState } from "react";

import NotificationsHeader from "./NotificationsHeader";
import NotificationsNav from "./NotificationsNav";
import NotificationsList from "./NotificationsList";

const Notifications = () => {
  useTitle(`Értesítések - ${ENUM.BRAND.NAME}`);

  const location = useLocation();
  const type: 1 | 2 = location.state?.type || 1; // Default to 1 if not provided

  const [activeTabIndex, setActiveTabIndex] = useState<1 | 2>(type);

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
