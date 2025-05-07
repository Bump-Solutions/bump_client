import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { Auth } from "../types/auth";

interface AuthContextType {
  auth: Auth | null;
  setAuth: Dispatch<SetStateAction<Auth | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<Auth | null>(null);

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

export default AuthProvider;
