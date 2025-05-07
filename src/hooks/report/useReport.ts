import { ApiError, ApiResponse } from "../../types/api";
import { ReportType } from "../../types/form";

import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { reportProduct, reportUser } from "../../services/reportService";

interface ReportPayload {
  type: ReportType;
  id: number;
  reason: number;
  description?: string;
}

export const useReport = (
  onSuccess?: (resp: ApiResponse, variables: ReportPayload) => void,
  onError?: (error: ApiError, variables: ReportPayload) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, ReportPayload>({
    mutationFn: (payload: ReportPayload) => {
      const { type, id, reason, description } = payload;

      switch (type) {
        case "product":
          return reportProduct(axiosPrivate, id, reason, description);
        case "user":
          return reportUser(axiosPrivate, id, reason, description);
        default:
          return Promise.reject("Invalid report type");
      }
    },
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
