import { ApiError, ApiResponse } from "../../types/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { createChatGroup } from "../../services/chatService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { UserModel } from "../../models/userModel";

export const useCreateChatGroup = (
  onSuccess?: (resp: ApiResponse, variables: UserModel["id"]) => void,
  onError?: (error: ApiError, variables: UserModel["id"]) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  return useMutation<ApiResponse, ApiError, UserModel["id"]>({
    mutationFn: (uid: UserModel["id"]) => createChatGroup(axiosPrivate, uid),
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
      }
      return Promise.reject(error);
    },
  });
};
