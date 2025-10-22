import { ROUTES } from "../../routes/routes";
import { ApiError } from "../../types/api";
import { googleLogin } from "../../services/authService";

import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "./useAuth";
import { AuthModel } from "../../models/authModel";

interface GoogleLoginArgs {
  code: string;
}

export const useLoginWithGoogle = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  return useMutation<AuthModel, ApiError, GoogleLoginArgs>({
    mutationFn: ({ code }) => googleLogin(code),
    onSuccess: (authModel) => {
      setAuth(authModel);
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      return Promise.reject(error);
    },
  });
};
