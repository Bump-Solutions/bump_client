import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface NavbarThemeContextType {
  isSolid: boolean;
  setIsSolid: Dispatch<SetStateAction<boolean>>;
}

interface NavbarThemeProviderProps {
  children: ReactNode;
}

export const NavbarThemeContext = createContext<
  NavbarThemeContextType | undefined
>(undefined);

const NavbarThemeProvider = ({ children }: NavbarThemeProviderProps) => {
  const [isSolid, setIsSolid] = useState<boolean>(false);

  return (
    <NavbarThemeContext value={{ isSolid, setIsSolid }}>
      {children}
    </NavbarThemeContext>
  );
};

export default NavbarThemeProvider;
