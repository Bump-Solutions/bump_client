import { ROUTES } from "../../routes/routes";
import { ReactNode } from "react";
import { useLocation, NavLink } from "react-router";

import { CircleUser, Bell, LockKeyhole, List } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
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
      { label: "Személyes adatok", href: ROUTES.SETTINGS.ROOT },
      { label: "Preferenciák", href: ROUTES.SETTINGS.PREFERENCES },
      { label: "Kezelés", href: ROUTES.SETTINGS.MANAGE },
    ],
  },
  {
    title: "Értesítések",
    icon: <Bell />,
    items: [
      { label: "Üzenetek", href: ROUTES.SETTINGS.INBOX },
      { label: "Hírlevél", href: ROUTES.SETTINGS.NEWSLETTER },
    ],
  },
  {
    title: "Adatvédelem és biztonság",
    icon: <LockKeyhole />,
    items: [
      { label: "Jelszó csere", href: ROUTES.SETTINGS.CHANGEPASSWORD },
      { label: "Kétlépcsős azonosítás", href: "/" },
      { label: "Cookie-k", href: "/" },
    ],
  },
  {
    title: "Egyéb",
    icon: <List />,
    items: [
      { label: "Megjelenés", href: "/" },
      { label: "Segítség és kapcsolat", href: "/" },
    ],
  },
];

const SettingsNav = () => {
  const location = useLocation();

  return (
    <aside className='settings__nav'>
      <ul className='settings__nav-list'>
        {NAV.map((item, index) => (
          <li key={index} className='settings__nav-list__item'>
            <h4>
              {item.icon} {item.title}
            </h4>
            <ul>
              {item.items.map((subItem, subIndex) => (
                <li key={subIndex} className='settings__nav-subitem'>
                  <NavLink
                    end
                    to={subItem.href}
                    state={{ from: location }}
                    className='link'>
                    {subItem.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SettingsNav;
