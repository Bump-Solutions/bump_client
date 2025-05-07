import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadProfilePicture } from "../../services/profileService";
import { AxiosResponse } from "axios";

export const useUploadProfilePicture = (
  onSuccess?: (resp: AxiosResponse, variables: string) => void,
  onError?: (error: any, variables: string) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<AxiosResponse, any, any>({
    mutationFn: (file: File) => uploadProfilePicture(axiosPrivate, file),
    onSuccess: (resp: AxiosResponse, variables: string) => {
      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error: any, variables: string) => {
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
