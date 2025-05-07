import { ApiError } from "../../types/api";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";
import { googleLogin } from "../../services/authService";

export const useLoginWithGoogle = (
  onSuccess?: (resp: string, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const { addToast } = useToast();

  return useMutation<string, ApiError, string>({
    mutationFn: (code: string) => googleLogin(code),
    onSuccess: (resp, variables) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error, variables) => {
      if (onError) {
        onError(error, variables);
      } else {
        addToast(
          error?.response?.data.type || "error",
          error?.response?.data.message
        );
      }
      return Promise.reject(error);
    },
  });
};
