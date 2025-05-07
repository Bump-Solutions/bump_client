import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { setProfileBackgroundColor } from "../../services/profileService";
import { ApiError, ApiResponse } from "../../types/api";

export const useSetProfileBackgroundColor = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: (color: string) =>
      setProfileBackgroundColor(axiosPrivate, color),
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
