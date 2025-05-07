import { ROUTES } from "../../routes/routes";
import { Role } from "../../types/auth";
import { ApiError } from "../../types/api";
import { login } from "../../services/authService";

import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "./useAuth";
import { useToast } from "../useToast";

interface LoginResponse {
  access_token: string;
  email: string;
}

interface JwtPayload {
  user_id: string;
  username: string;
  roles: Role[];
}

interface LoginArgs {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  const { addToast } = useToast();

  return useMutation<LoginResponse, ApiError, LoginArgs>({
    mutationFn: ({ email, password }: LoginArgs) => login(email, password),
    onSuccess: (data) => {
      const { access_token, email } = data;

      const decodedToken = jwtDecode<JwtPayload>(access_token);
      const { roles, user_id, username } = decodedToken;

      setAuth({
        accessToken: access_token,
        roles: roles,
        user: {
          id: Number(user_id),
          username,
          email,
        },
      });
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      addToast(
        error?.response?.data.type || "error",
        error?.response?.data.message
      );
      return Promise.reject(error);
    },
  });
};
