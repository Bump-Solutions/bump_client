import "../../assets/css/settings.css";

import { Outlet } from "react-router";
import { useTitle } from "react-use";

import BasicSettingsProvider from "../../context/PersonalSettingsProvider";
import SettingsNav from "./SettingsNav";

const Settings = () => {
  useTitle("Beállítások - Bump");

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
