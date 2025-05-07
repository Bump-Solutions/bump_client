import { ROUTES } from "../../routes/routes";
import { useProfile } from "../../hooks/profile/useProfile";
import { useEffect, useRef } from "react";
import { useToggle } from "../../hooks/useToggle";
import { NavLink } from "react-router";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface Tab {
  label: string;
  href: string;
  private?: boolean;
}

const TABS = (username: string): Tab[] => [
  {
    label: "Termékek",
    href: ROUTES.PROFILE(username).PRODUCTS,
  },
  {
    label: "Mentett",
    href: ROUTES.PROFILE(username).SAVED,
    private: true,
  },
];

const ProfileTabs = () => {
  const { user, isOwnProfile } = useProfile();

  const tabsRef = useRef<HTMLUListElement | null>(null);

  const [isScrollable, toggleScrollable] = useToggle(false);
  const [showLeftArrow, toggleLeftArrow] = useToggle(false);
  const [showRightArrow, toggleRightArrow] = useToggle(false);

  useEffect(() => {
    const currentTab = tabsRef.current;

    const checkScrollability = () => {
      if (!tabsRef.current) return;

      const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;

      const scrollable = scrollWidth > clientWidth;

      toggleScrollable(scrollable);
      toggleLeftArrow(scrollable && scrollLeft > 0);
      toggleRightArrow(scrollable && scrollLeft < scrollWidth - clientWidth);
    };

    checkScrollability();

    window.addEventListener("resize", checkScrollability);
    currentTab?.addEventListener("scroll", checkScrollability);

    return () => {
      window.removeEventListener("resize", checkScrollability);
      currentTab?.removeEventListener("scroll", checkScrollability);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!tabsRef.current) return;

    const { scrollLeft, clientWidth } = tabsRef.current;
    const scrollAmount = clientWidth / 2;
    const newScrollPosition =
      direction === "left"
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;

    tabsRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className='profile__tabs__wrapper'>
      {isScrollable && showLeftArrow && (
        <span className='scroll-indicator left'>
          <button
            type='button'
            title='Left'
            onClick={() => handleScroll("left")}>
            <ArrowLeft />
          </button>
        </span>
      )}
      {isScrollable && showRightArrow && (
        <span className='scroll-indicator right'>
          <button
            type='button'
            title='Right'
            onClick={() => handleScroll("right")}>
            <ArrowRight />
          </button>
        </span>
      )}

      <ul ref={tabsRef} className='profile__tabs'>
        {TABS(user.username)
          .filter((tab) => !tab.private || isOwnProfile)
          .map((tab, index) => (
            <li key={index} className='profile__tab'>
              <NavLink to={tab.href} end>
                {tab.label}
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ProfileTabs;
