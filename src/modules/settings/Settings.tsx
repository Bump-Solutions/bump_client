import { useMediaQuery } from "react-responsive";
import { Outlet, useLocation } from "react-router";
import { useTitle } from "react-use";
import "../../assets/css/settings.css";
import { ENUM } from "../../utils/enum";

import Back from "../../components/Back";
import BasicSettingsProvider from "../../context/PersonalSettingsProvider";
import SettingsNav from "./SettingsNav";

const Settings = () => {
  useTitle(`Beállítások - ${ENUM.BRAND.NAME}`);

  const { pathname } = useLocation();
  const isRoot = pathname === "/settings";

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  if (isMobile) {
    return (
      <section className='settings'>
        <BasicSettingsProvider>
          {isRoot ? (
            <SettingsNav />
          ) : (
            <>
              <Back className='link back' />
              <Outlet />
            </>
          )}
        </BasicSettingsProvider>
      </section>
    );
  }

  return (
    <section className='settings'>
      <BasicSettingsProvider>
        <SettingsNav />
        <Outlet />
      </BasicSettingsProvider>
    </section>
  );
};

export default Settings;
