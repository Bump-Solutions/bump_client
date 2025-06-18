import "../../assets/css/notification.css";
import { ENUM } from "../../utils/enum";
import { useLocation } from "react-router";
import { useNotifications } from "../../hooks/notifications/useNotifications";
import { useTitle } from "react-use";

const Notifications = () => {
  useTitle(`Értesítések - ${ENUM.BRAND.NAME}`);

  const location = useLocation();
  const type: 1 | 2 = location.state?.type || 1; // Default to 1 if not provided

  const { getTab } = useNotifications();
  const { ...tab } = getTab(type);
  console.log(tab);

  return <section className='notifications'>activeTabIndex: {type}</section>;
};

export default Notifications;
