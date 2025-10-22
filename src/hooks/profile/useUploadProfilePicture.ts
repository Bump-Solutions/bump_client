import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadProfilePicture } from "../../services/profileService";
import { ApiError, ApiResponse } from "../../types/api";
import { useAuth } from "../auth/useAuth";
import { ProfileMetaModel } from "../../models/profileModel";

export const useUploadProfilePicture = (
  onSuccess?: (resp: ApiResponse, variables: any) => void,
  onError?: (error: ApiError, variables: any) => void
) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, any>({
    mutationFn: (file: File) => uploadProfilePicture(axiosPrivate, file),
    onSuccess: (resp: ApiResponse, variables: any) => {
      queryClient.setQueryData(
        [QUERY_KEY.getProfileMeta],
        (prev: ProfileMetaModel) => {
          return {
            ...prev,
            profilePicture: resp.data.message,
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.getUser, auth?.user?.username],
      });

      if (onSuccess) {
        onSuccess(resp, variables);
      }
    },
    onError: (error: ApiError, variables: any) => {
      if (onError) {
        onError(error, variables);
      }
      return Promise.reject(error);
    },
  });
};
