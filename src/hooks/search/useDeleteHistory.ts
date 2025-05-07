import { deleteSearchHistory } from "../../services/searchService";
import { ApiError, ApiResponse } from "../../types/api";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteHistory = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (historyId: number) =>
      deleteSearchHistory(axiosPrivate, historyId),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listSearchHistory],
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
