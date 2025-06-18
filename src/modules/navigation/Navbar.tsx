import "../../assets/css/navbar.css";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavbarTheme } from "../../hooks/useNavbarTheme";
import { useToggle } from "../../hooks/useToggle";

import NavMenu from "./NavMenu";
import NavMenuMobile from "./NavMenuMobile";
import NavSearch from "./NavSearch";
import NavProfileMenu from "./NavProfileMenu";
import ProfileMenuActions from "./ProfileMenuActions";
import NotificationMenu from "../notifications/NotificationMenu";

const Navbar = () => {
  const { isSolid } = useNavbarTheme();

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

  return (
    <>
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
        {isNotificationMenuOpen && (
          <NotificationMenu toggleNotificationMenu={toggleNotificationMenu} />
        )}
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {isProfileMenuOpen && (
          <ProfileMenuActions toggleProfileMenu={toggleProfileMenu} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
