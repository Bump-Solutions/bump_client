import { ROUTES } from "../../routes/routes";
import { useState, useRef, useEffect } from "react";
import { useLocation, Link, NavLink } from "react-router";

import { useToggle } from "../../hooks/useToggle";
import { useNavbarTheme } from "../../hooks/useNavbarTheme";
import { useClickOutside } from "../../hooks/useClickOutside";

import MenuBrowse from "./MenuBrowse";
import MenuCommunity from "./MenuCommunity";

const NOT_SOLID_ROUTES = ["/profile"];

const NavMenu = () => {
  const location = useLocation();
  const { setIsSolid } = useNavbarTheme();
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const [browseOpen, toggleBrowse] = useToggle(false);
  const [communityOpen, toggleCommunity] = useToggle(false);

  const browseRef = useRef<HTMLDivElement | null>(null);
  const browseToggleRef = useRef<HTMLLIElement | null>(null);

  const communityRef = useRef<HTMLDivElement | null>(null);
  const communityToggleRef = useRef<HTMLLIElement | null>(null);

  useClickOutside({
    ref: browseRef,
    callback: () => onHoverOrTouch(),
    ignoreRefs: [browseToggleRef],
  });

  useClickOutside({
    ref: communityRef,
    callback: () => onHoverOrTouch(),
    ignoreRefs: [communityToggleRef],
  });

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    setIsTouchDevice(!canHover);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      browseOpen || communityOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [browseOpen, communityOpen]);

  const onHoverOrTouch = (menu?: "browse" | "community") => {
    switch (menu) {
      case "browse":
        setIsSolid(true);
        toggleBrowse(isTouchDevice ? !browseOpen : true);
        toggleCommunity(false);
        break;
      case "community":
        setIsSolid(true);
        toggleCommunity(isTouchDevice ? !communityOpen : true);
        toggleBrowse(false);
        break;
      default:
        toggleBrowse(false);
        toggleCommunity(false);

        if (
          window.scrollY === 0 &&
          NOT_SOLID_ROUTES.some((route) => location.pathname.startsWith(route))
        ) {
          setIsSolid(false);
        } else {
          setIsSolid(true);
        }
    }
  };

  return (
    <div className='navbar__menu'>
      <Link className='navbar__menu__logo fw-800' to={ROUTES.HOME}>
        bump.
      </Link>
      <ul
        className='navbar__menu__list'
        onMouseLeave={() => !isTouchDevice && onHoverOrTouch()}>
        <li
          ref={browseToggleRef}
          className={`fw-600 ${browseOpen ? "active" : ""}`}
          onMouseEnter={() => !isTouchDevice && onHoverOrTouch("browse")}
          onTouchStart={() => onHoverOrTouch("browse")}>
          <span>Böngéssz</span>
        </li>

        <li
          ref={communityToggleRef}
          className={`fw-600 ${communityOpen ? "active" : ""}`}
          onMouseEnter={() => !isTouchDevice && onHoverOrTouch("community")}
          onTouchStart={() => onHoverOrTouch("community")}>
          <span>Közösség</span>
        </li>

        <li
          className='fw-600'
          onMouseEnter={() => !isTouchDevice && onHoverOrTouch()}>
          <NavLink to={ROUTES.DISCOVER}>Fedezd fel</NavLink>
        </li>

        {browseOpen && (
          <MenuBrowse ref={browseRef} onHoverOrTouch={onHoverOrTouch} />
        )}
        {communityOpen && (
          <MenuCommunity ref={communityRef} onHoverOrTouch={onHoverOrTouch} />
        )}
      </ul>
    </div>
  );
};

export default NavMenu;
