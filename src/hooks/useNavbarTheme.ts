import { Dispatch, SetStateAction, use, useEffect } from "react";
import { NavbarThemeContext } from "../context/NavbarThemeProvider";

interface NavbarThemeResponse {
  isSolid: boolean;
  setIsSolid: Dispatch<SetStateAction<boolean>>;
}

export const useNavbarTheme = (
  initialSolid: boolean = true
): NavbarThemeResponse => {
  const context = use(NavbarThemeContext);

  if (!context) {
    throw new Error("useNavbarTheme must be used within a NavbarThemeProvider");
  }

  const { isSolid, setIsSolid } = context;

  useEffect(() => {
    setIsSolid(initialSolid);
  }, [initialSolid, setIsSolid]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsSolid(initialSolid);
      } else {
        setIsSolid(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setIsSolid(true); // Reset the isSolid state to true when the component unmounts
    };
  }, [initialSolid, setIsSolid]);

  return { isSolid, setIsSolid };
};
