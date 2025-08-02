import { useMutation } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { FileUpload } from "../../types/form";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { uploadChatImages } from "../../services/chatService";

interface UploadChatImagesVariables {
  chat: string;
  images: FileUpload[];
}

export const useUploadChatImages = (
  onSuccess?: (resp: ApiResponse, variables: UploadChatImagesVariables) => void,
  onError?: (error: ApiError, variables: UploadChatImagesVariables) => void
) => {
  const axiosPrivate = useAxiosPrivate();

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
      }
      return Promise.reject(error);
    },
  });
};
