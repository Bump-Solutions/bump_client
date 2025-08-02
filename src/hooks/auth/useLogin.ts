import { ROUTES } from "../../routes/routes";
import { ApiError } from "../../types/api";
import { login } from "../../services/authService";

import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "./useAuth";
import { AuthModel } from "../../models/authModel";

interface LoginArgs {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  return useMutation<AuthModel, ApiError, LoginArgs>({
    mutationFn: ({ email, password }: LoginArgs) => login(email, password),
    onSuccess: (authModel) => {
      setAuth(authModel);
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      return Promise.reject(error);
    },
  });
};
