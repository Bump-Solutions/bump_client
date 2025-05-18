import { useMutation } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { UploadedFile } from "../../types/form";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { uploadChatImages } from "../../services/chatService";

interface UploadChatImagesVariables {
  chat: string;
  images: UploadedFile[];
}

export const useUploadChatImages = (
  onSuccess?: (resp: ApiResponse, variables: UploadChatImagesVariables) => void,
  onError?: (error: ApiError, variables: UploadChatImagesVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, UploadChatImagesVariables>({
    mutationFn: (data: UploadChatImagesVariables) =>
      uploadChatImages(axiosPrivate, data.chat, data.images),
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
