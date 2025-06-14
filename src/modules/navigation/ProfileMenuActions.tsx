import { ROUTES } from "../../routes/routes";
import { AuthModel } from "../../models/authModel";

import { useRef, JSX } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

import { useAuth } from "../../hooks/auth/useAuth";
import { useLogout } from "../../hooks/auth/useLogout";
import { useClickOutside } from "../../hooks/useClickOutside";

import {
  Tag,
  Bookmark,
  Settings,
  ArrowUpRight,
  User,
  MessagesSquare,
} from "lucide-react";

type MenuAction = {
  icon: JSX.Element;
  label: string;
  route: string;
  class: string;
};

const ACTIONS = (auth: AuthModel): MenuAction[] => {
  return [
    {
      icon: <MessagesSquare />,
      label: "Üzenetek",
      route: ROUTES.INBOX.ROOT,
      class: "",
    },
    {
      icon: <User />,
      label: "Bump profilom",
      route: ROUTES.PROFILE(auth?.user?.username!).ROOT,
      class: "",
    },
    {
      icon: <Bookmark />,
      label: "Mentett",
      route: ROUTES.PROFILE(auth?.user?.username!).SAVED,
      class: "show-sm-only",
    },
    {
      icon: <Settings />,
      label: "Beállítások",
      route: ROUTES.SETTINGS.ROOT,
      class: "",
    },
  ];
};

interface ProfileMenuActionsProps {
  toggleProfileMenu: (bool: boolean) => void;
}

const ProfileMenuActions = ({ toggleProfileMenu }: ProfileMenuActionsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { auth } = useAuth();
  const logout = useLogout();
  const location = useLocation();

  useClickOutside({
    ref: ref,
    callback: () => toggleProfileMenu(false),
  });

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
      <motion.div
        ref={ref}
        className='profile-menu__actions'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <ul className='action-list no-border'>
          <li className='px-0_5 pt-0_5'>
            <Link
              onClick={() => toggleProfileMenu(false)}
              to={ROUTES.PROFILE(auth?.user?.username!).ROOT}
              className='fs-16 truncate fw-600 link black'>
              {auth?.user?.username}
            </Link>
          </li>
          <li>
            <div className='truncate fs-14 fc-light px-0_5'>
              {auth?.user?.email}
            </div>
          </li>
        </ul>

        <ul className='action-list'>
          <li className='action-list-item btn'>
            <Link
              onClick={() => toggleProfileMenu(false)}
              to={ROUTES.SELL}
              state={{ background: location }}>
              <Tag />
              <span>Add el most!</span>
            </Link>
          </li>
        </ul>

        <ul className='action-list'>
          {ACTIONS(auth!).map((action, index) => (
            <li key={index} className={`action-list-item ${action.class}`}>
              <Link onClick={() => toggleProfileMenu(false)} to={action.route}>
                {action.icon}
                <span>{action.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className='action-list no-border'>
          <li className='action-list-item blue icon-end show-sm-only'>
            <div>
              <ArrowUpRight />
              <span>Pro</span>
            </div>
          </li>

          <li className='action-list-item icon-end'>
            <Link to={ROUTES.CONTACT} target='_blank'>
              <ArrowUpRight />
              <span>Kapcsolat</span>
            </Link>
          </li>

          <li className='action-list-item red'>
            <div onClick={() => logout()}>
              <span>Kijelentkezés</span>
            </div>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ProfileMenuActions;
