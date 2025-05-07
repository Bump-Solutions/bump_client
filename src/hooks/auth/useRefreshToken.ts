import { API } from "../../utils/api";
import { User } from "../../types/user";
import { Role } from "../../types/auth";

import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useAuth } from "./useAuth";

interface JwtPayload {
  username: User["username"];
  email: User["email"];
  roles: Role[];
}

export const useRefreshToken = (): (() => Promise<string>) => {
  const { setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axios.get(API.AUTH.REFRESH, {
      withCredentials: true,
    });

    const decodedToken = jwtDecode<JwtPayload>(response.data.access_token);

    setAuth((prev) => ({
      ...prev,
      accessToken: response.data.access_token,
      roles: decodedToken.roles,
      user: {
        username: decodedToken.username,
        email: decodedToken.email,
      },
    }));

    return response.data.access_token;
  };

  return refresh;
};
