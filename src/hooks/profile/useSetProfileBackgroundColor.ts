import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { setProfileBackgroundColor } from "../../services/profileService";
import { ApiError, ApiResponse } from "../../types/api";

export const useSetProfileBackgroundColor = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const axiosPrivate = useAxiosPrivate();

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
      }
      return Promise.reject(error);
    },
  });
};
