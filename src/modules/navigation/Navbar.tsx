import "../../assets/css/navbar.css";

import { useEffect, createContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavbarTheme } from "../../hooks/useNavbarTheme";
import { useToggle } from "../../hooks/useToggle";

import NavMenu from "./NavMenu";
import NavMenuMobile from "./NavMenuMobile";
import NavSearch from "./NavSearch";
import NavProfileMenu from "./NavProfileMenu";
import ProfileMenuActions from "./ProfileMenuActions";

// TODO: Implement NotificationsContext
export const NotificationsContext = createContext(undefined);

const Navbar = () => {
  const { isSolid } = useNavbarTheme();

  // TODO: Implement notifications (interface, context, provider, etc.)
  const [notifications, setNotifications] = useState([]);

  const [isProfileMenuOpen, toggleProfileMenu] = useToggle(false);
  const [isNotificationMenuOpen, toggleNotificationMenu] = useToggle(false);

  useEffect(() => {
    document.body.style.overflow =
      isProfileMenuOpen || isNotificationMenuOpen ? "hidden" : "auto";
    // document.body.style.pointerEvents = isProfileMenuOpen || isNotificationMenuOpen ? 'none' : 'auto';

    return () => {
      document.body.style.overflow = "auto";
      // document.body.style.pointerEvents = 'auto';
    };
  }, [isProfileMenuOpen, isNotificationMenuOpen]);

  useEffect(() => {
    // TODO: Fetch notifications
    setNotifications([
      {
        id: 1,
        type: "message",
        read: false,
        title: "Új üzenet",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: new Date(),
      },
      {
        id: 2,
        type: "message",
        read: false,
        title: "Új üzenet",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: new Date(),
      },
      {
        id: 3,
        type: "message",
        read: false,
        title: "Új üzenet",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: new Date(),
      },
      {
        id: 4,
        type: "message",
        read: false,
        title: "Új üzenet",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: new Date(),
      },
      {
        id: 5,
        type: "general",
        read: false,
        title: "Új értesítés",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: new Date(),
      },
    ]);
  }, []);

  return (
    <NotificationsContext value={{ notifications, setNotifications }}>
      <nav className={`navbar ${isSolid ? "solid" : ""}`}>
        <NavMenuMobile />
        <NavMenu />
        <NavSearch />
        <NavProfileMenu
          toggleNotificationMenu={toggleNotificationMenu}
          toggleProfileMenu={toggleProfileMenu}
        />
      </nav>

      <AnimatePresence mode='wait'>
        {isProfileMenuOpen && (
          <ProfileMenuActions toggleProfileMenu={toggleProfileMenu} />
        )}
      </AnimatePresence>
    </NotificationsContext>
  );
};

export default Navbar;
