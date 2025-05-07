import { ApiError, ApiResponse } from "../../types/api";
import { User } from "../../types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { createChatGroup } from "../../services/chatService";
import { QUERY_KEY } from "../../utils/queryKeys";

export const useCreateChatGroup = (
  onSuccess?: (resp: ApiResponse, variables: User["id"]) => void,
  onError?: (error: ApiError, variables: User["id"]) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, User["id"]>({
    mutationFn: (uid: User["id"]) => createChatGroup(axiosPrivate, uid),
    onSuccess: async (resp, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listChatGroups],
        exact: false,
        refetchType: "all",
      });
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
