import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { IProduct } from "../../types/product";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { deletePrduct } from "../../services/productService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { useProfile } from "../profile/useProfile";

export const useDeleteProduct = (
  onSuccess?: (resp: ApiResponse, variables: IProduct["id"]) => void,
  onError?: (error: ApiError, variables: IProduct["id"]) => void
) => {
  const { user } = useProfile();

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, IProduct["id"]>({
    mutationFn: (productId: IProduct["id"]) =>
      deletePrduct(axiosPrivate, productId),
    onSuccess: (resp, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.listProducts, user?.id],
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
