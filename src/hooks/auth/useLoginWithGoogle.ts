import { ApiError } from "../../types/api";
import { useMutation } from "@tanstack/react-query";

import { googleLogin } from "../../services/authService";
import { AuthModel } from "../../models/authModel";

export const useLoginWithGoogle = (
  onSuccess?: (resp: AuthModel, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  return useMutation<AuthModel, ApiError, string>({
    mutationFn: (code: string) => googleLogin(code),
    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
