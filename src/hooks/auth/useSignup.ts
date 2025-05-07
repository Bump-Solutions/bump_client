import { signup } from "../../services/authService";
import { ApiError, ApiResponse } from "../../types/api";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";

interface SignupData {
  email: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string | number | null;
}

export const useSignup = (
  onSuccess?: (resp: ApiResponse, variables: SignupData) => void,
  onError?: (error: ApiError, variables: SignupData) => void
) => {
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, SignupData>({
    mutationFn: (data: SignupData) => signup(data),
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
