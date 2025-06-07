import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { AuthModel } from "../models/authModel";

interface AuthContextType {
  auth: AuthModel | null;
  setAuth: Dispatch<SetStateAction<AuthModel | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthModel | null>(null);

  return <AuthContext value={{ auth, setAuth }}>{children}</AuthContext>;
};

export default AuthProvider;
