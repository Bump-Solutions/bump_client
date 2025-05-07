import { API } from "../../utils/api";
import { ROUTES } from "../../routes/routes";

import { useEffect, use } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetProfilePicture } from "../../hooks/profile/useGetProfilePicture";
import { useToast } from "../../hooks/useToast";

import { NotificationsContext } from "./Navbar";

import { ArrowUpRight, Bell } from "lucide-react";
import Tooltip from "../../components/Tooltip";
import Image from "../../components/Image";

interface NavProfileMenuProps {
  toggleNotificationMenu: (bool: boolean) => void;
  toggleProfileMenu: (bool: boolean) => void;
}

const NavProfileMenu = ({
  toggleNotificationMenu,
  toggleProfileMenu,
}: NavProfileMenuProps) => {
  const { notifications } = use(NotificationsContext);

  const { auth } = useAuth();

  const { addToast } = useToast();

  const unreadNotificationCount = () => {
    // TODO: notification
    return notifications.filter((notification: any) => !notification.read)
      .length;
  };

  const {
    data: image,
    isError,
    error,
  } = useGetProfilePicture([auth.user.profile_picture]);

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
            to={ROUTES.PROFILE(auth.user.username).SAVED}
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

        <button
          type='button'
          onClick={() => toggleProfileMenu(true)}
          title='Profil'>
          <Image
            src={API.BASE_URL + image}
            alt={auth.user.username.slice(0, 2)}
            placeholderColor='#212529'
          />
        </button>
      </div>
    </div>
  );
};

export default NavProfileMenu;
