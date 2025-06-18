import "../../assets/css/settings.css";
import { ENUM } from "../../utils/enum";
import { Outlet, useLocation } from "react-router";
import { useTitle } from "react-use";
import { useMediaQuery } from "react-responsive";

import BasicSettingsProvider from "../../context/PersonalSettingsProvider";
import SettingsNav from "./SettingsNav";
import Back from "../../components/Back";

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
