import { ROUTES } from "../../routes/routes";
import { useGetProfileMeta } from "../../hooks/profile/useGetProfileMeta";
import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { toast } from "sonner";
import { useCart } from "../../hooks/trade/useCart";

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

  const { auth } = useAuth();
  const { cartItemCount } = useCart();

  const { data: meta, isError, error } = useGetProfileMeta();

  if (isError) {
    toast.error(error?.response?.data.message);
  }

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
              {!!meta?.unreadNotifications && meta.unreadNotifications > 0 && (
                <span className='badge fw-600'>
                  {meta.unreadNotifications > 99
                    ? "99+"
                    : meta.unreadNotifications}
                </span>
              )}
              <Bell />
            </div>
          </div>
        </Tooltip>

        <Tooltip content='Kosár' showDelay={750} placement='bottom'>
          <div className='profile-menu__item no-hide'>
            <div onClick={() => navigate(ROUTES.CART)}>
              {cartItemCount > 0 && (
                <span className='badge fw-600'>
                  {cartItemCount > 99 ? "99+" : cartItemCount}
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
              src={meta?.profilePicture}
              alt={auth?.user?.username?.slice(0, 2)}
              placeholderColor='#212529'
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NavProfileMenu;
