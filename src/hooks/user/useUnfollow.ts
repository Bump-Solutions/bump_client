import { ApiError, ApiResponse } from "../../types/api";

import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { unfollow } from "../../services/userService";

export const useUnfollow = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (uid: number) => unfollow(axiosPrivate, uid),
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
