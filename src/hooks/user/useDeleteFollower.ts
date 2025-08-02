import { ApiError, ApiResponse } from "../../types/api";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { deleteFollower } from "../../services/userService";

export const useDeleteFollower = (
  onSuccess?: (response: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (uid: number) => deleteFollower(axiosPrivate, uid),
    onSuccess: (response, variables) => {
      if (onSuccess) {
        onSuccess(response, variables);
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
