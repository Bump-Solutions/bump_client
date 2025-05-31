import { QUERY_KEY } from "../../utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SellFormData } from "../../context/SellProvider";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { uploadProduct } from "../../services/productService";
import { useAuth } from "../auth/useAuth";

export const useUploadProduct = (
  onSuccess?: (resp: ApiResponse, variables: SellFormData) => void,
  onError?: (error: ApiError, variables: SellFormData) => void
) => {
  const { auth } = useAuth();

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, SellFormData>({
    mutationFn: (data: SellFormData) => uploadProduct(axiosPrivate, data),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, auth?.user?.id],
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
