import { signup } from "../../services/authService";
import { ApiError, ApiResponse } from "../../types/api";
import { SignupModel } from "../../models/authModel";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";

export const useSignup = (
  onSuccess?: (resp: ApiResponse, variables: SignupModel) => void,
  onError?: (error: ApiError, variables: SignupModel) => void
) => {
  const { addToast } = useToast();

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
