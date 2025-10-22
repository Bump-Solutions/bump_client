import { ApiError } from "../../types/api";
import { ProfileModel } from "../../models/profileModel";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { updateProfile } from "../../services/profileService";
import { AxiosResponse } from "axios";
import { QUERY_KEY } from "../../utils/queryKeys";

export const useUpdateProfile = (
  onSuccess?: (resp: AxiosResponse, variables: any) => void,
  onError?: (error: ApiError, variables: any) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse, ApiError, any>({
    mutationFn: (newProfile: Partial<ProfileModel>) =>
      updateProfile(axiosPrivate, newProfile),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.getProfileMeta] });

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
