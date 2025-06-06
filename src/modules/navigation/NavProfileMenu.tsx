import { ROUTES } from "../../routes/routes";

import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetProfilePicture } from "../../hooks/profile/useGetProfilePicture";
import { useToast } from "../../hooks/useToast";
import { useCart } from "../../hooks/trade/useCart";
import { useNotifications } from "../../hooks/notifications/useNotifications";

import Tooltip from "../../components/Tooltip";
import Image from "../../components/Image";

import { ArrowUpRight, Bell, ShoppingBag } from "lucide-react";

interface NavProfileMenuProps {
  toggleNotificationMenu: (bool: boolean) => void;
  toggleProfileMenu: (bool: boolean) => void;
}

const NavProfileMenu = ({
  toggleNotificationMenu,
  toggleProfileMenu,
}: NavProfileMenuProps) => {
  const navigate = useNavigate();

  const { notifications } = useNotifications();
  const { cart } = useCart();

  const { auth } = useAuth();

  const { addToast } = useToast();

  const unreadNotificationCount = () => {
    // TODO: notification
    return notifications.filter((notification: any) => !notification.read)
      .length;
  };

  const cartPackageCount = () => {
    // Return the number of packages in the cart
    return Object.keys(cart).length;
  };

  const {
    data: pc,
    isError,
    error,
  } = useGetProfilePicture([auth?.user?.profilePicture]);

  useEffect(() => {
    if (isError) {
      addToast(
        error?.response?.data.type || "error",
        error?.response?.data.message
      );
    }
  }, [isError]);

  return (
    <div className='navbar__profile-menu'>
      <div className='profile-menu__wrapper'>
        <div className='profile-menu__item '>
          <NavLink
            to={ROUTES.PROFILE(auth?.user?.username!).SAVED}
            className='link black fw-600'>
            Mentett
          </NavLink>
        </div>

        <div className='profile-menu__item '>
          <Link to='' className='link no-anim icon--reverse fw-600'>
            <ArrowUpRight />
            <span>Pro</span>
          </Link>
        </div>

        <Tooltip content='Értesítések' showDelay={750} placement='bottom'>
          <div className='profile-menu__item no-hide '>
            <div onClick={() => toggleNotificationMenu(true)}>
              {unreadNotificationCount() > 0 && (
                <span className='badge fw-600'>
                  {unreadNotificationCount() > 99
                    ? "99+"
                    : unreadNotificationCount()}
                </span>
              )}
              <Bell />
            </div>
          </div>
        </Tooltip>

        <Tooltip content='Kosár' showDelay={750} placement='bottom'>
          <div className='profile-menu__item no-hide'>
            <div onClick={() => navigate(ROUTES.CART)}>
              {cartPackageCount() > 0 && (
                <span className='badge fw-600'>
                  {cartPackageCount() > 99 ? "99+" : cartPackageCount()}
                </span>
              )}

              <ShoppingBag />
            </div>
          </div>
        </Tooltip>

        <Tooltip content='Profil' showDelay={750} placement='bottom'>
          <button
            type='button'
            onClick={() => toggleProfileMenu(true)}
            aria-label='Profil'>
            <Image
              src={pc?.profilePicture}
              alt={auth?.user?.username?.slice(0, 2)!}
              placeholderColor='#212529'
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavProfileMenu;
