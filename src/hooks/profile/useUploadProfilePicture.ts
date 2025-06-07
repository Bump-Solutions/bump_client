import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadProfilePicture } from "../../services/profileService";
import { ApiError, ApiResponse } from "../../types/api";

export const useUploadProfilePicture = (
  onSuccess?: (resp: ApiResponse, variables: string) => void,
  onError?: (error: ApiError, variables: string) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, any>({
    mutationFn: (file: File) => uploadProfilePicture(axiosPrivate, file),
    onSuccess: (resp: ApiResponse, variables: string) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error: ApiError, variables: string) => {
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
