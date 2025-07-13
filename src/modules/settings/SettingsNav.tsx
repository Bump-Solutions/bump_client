import { ROUTES } from "../../routes/routes";
import { ReactNode } from "react";
import { useLocation, NavLink } from "react-router";

import {
  CircleUser,
  Bell,
  LockKeyhole,
  List,
  SlidersHorizontal,
  Settings,
  MessagesSquare,
  Sparkles,
  CircleHelp,
  Cookie,
  ShieldCheck,
  KeyRound,
  Mails,
  ChevronRight,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";

interface NavItem {
  label: string;
  icon?: ReactNode;
  href: string;
  mobileHref?: string;
}

interface NavSection {
  title: string;
  icon: ReactNode;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: "Fiókom",
    icon: <CircleUser />,
    items: [
      {
        label: "Személyes adatok",
        icon: <CircleUser />,
        href: ROUTES.SETTINGS.ROOT,
        mobileHref: ROUTES.SETTINGS.PERSONAL,
      },
      {
        label: "Preferenciák",
        icon: <SlidersHorizontal />,
        href: ROUTES.SETTINGS.PREFERENCES,
      },
      { label: "Kezelés", icon: <Settings />, href: ROUTES.SETTINGS.MANAGE },
    ],
  },
  {
    title: "Értesítések",
    icon: <Bell />,
    items: [
      {
        label: "Üzenetek",
        icon: <MessagesSquare />,
        href: ROUTES.SETTINGS.INBOX,
      },
      {
        label: "Hírlevél",
        icon: <Mails />,
        href: ROUTES.SETTINGS.NEWSLETTER,
      },
    ],
  },
  {
    title: "Adatvédelem és biztonság",
    icon: <LockKeyhole />,
    items: [
      {
        label: "Jelszó csere",
        icon: <KeyRound />,
        href: ROUTES.SETTINGS.CHANGEPASSWORD,
      },
      { label: "Kétlépcsős azonosítás", icon: <ShieldCheck />, href: "/" },
      { label: "Cookie-k", icon: <Cookie />, href: "/" },
    ],
  },
  {
    title: "Egyéb",
    icon: <List />,
    items: [
      { label: "Megjelenés", icon: <Sparkles />, href: "/" },
      { label: "Segítség és kapcsolat", icon: <CircleHelp />, href: "/" },
    ],
  },
];

const SettingsNav = () => {
  const location = useLocation();

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  return (
    <aside className='settings__nav'>
      <ul className='settings__nav-list'>
        {NAV.map((item, index) => (
          <li key={index} className='settings__nav-list__item'>
            <h4>
              {item.icon} {item.title}
            </h4>
            <ul>
              {item.items.map((subItem, subIndex) => {
                const to = subItem.mobileHref || subItem.href;

                return (
                  <li key={subIndex} className='settings__nav-subitem'>
                    <NavLink
                      end
                      to={to}
                      state={{ from: location }}
                      className='link no-anim'>
                      {isMobile && subItem.icon}
                      {subItem.label}
                      {isMobile && <ChevronRight />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SettingsNav;
