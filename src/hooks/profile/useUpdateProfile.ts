import { ApiError } from "../../types/api";
import { ProfileModel } from "../../models/profileModel";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "../useToast";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { updateProfile } from "../../services/profileService";
import { AxiosResponse } from "axios";

export const useUpdateProfile = (
  onSuccess?: (resp: AxiosResponse, variables: any) => void,
  onError?: (error: ApiError, variables: any) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<AxiosResponse, ApiError, any>({
    mutationFn: (newProfile: Partial<ProfileModel>) =>
      updateProfile(axiosPrivate, newProfile),
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
