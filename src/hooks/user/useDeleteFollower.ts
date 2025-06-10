import { ApiError, ApiResponse } from "../../types/api";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { deleteFollower } from "../../services/userService";

export const useDeleteFollower = (
  onSuccess?: (response: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

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
