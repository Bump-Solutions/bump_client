import { signup } from "../../services/authService";
import { ApiError, ApiResponse } from "../../types/api";
import { SignupModel } from "../../models/authModel";

import { useMutation } from "@tanstack/react-query";

export const useSignup = (
  onSuccess?: (resp: ApiResponse, variables: SignupModel) => void,
  onError?: (error: ApiError, variables: SignupModel) => void
) => {
  return useMutation<ApiResponse, ApiError, SignupModel>({
    mutationFn: (data: SignupModel) => signup(data),
    onSuccess: (resp, variables) => {
      // TODO: ...args?
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
