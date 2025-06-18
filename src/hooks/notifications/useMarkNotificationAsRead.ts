import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, ApiResponse } from "../../types/api";
import { useAxiosPrivate } from "../auth/useAxiosPrivate";
import { useToast } from "../useToast";
import { markNotificationAsRead } from "../../services/notificationService";
import { QUERY_KEY } from "../../utils/queryKeys";
import { NotificationsPageModel } from "../../models/notificationModel";
import { ProfileMetaModel } from "../../models/profileModel";
import { useAuth } from "../auth/useAuth";

export const useMarkNotificationAsRead = (
  onSuccess?: (resp: ApiResponse, variables: number) => void,
  onError?: (error: ApiError, variables: number) => void
) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { addToast } = useToast();

  return useMutation<ApiResponse, ApiError, number>({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(axiosPrivate, notificationId),
    onSuccess: (resp, variables) => {
      // Navbar notification count update
      queryClient.setQueryData(
        [QUERY_KEY.getProfileMeta, auth?.user?.profilePicture],
        (prev: ProfileMetaModel | undefined) => {
          if (!prev) return prev;

          return {
            ...prev,
            unreadNotifications: prev.unreadNotifications - 1,
          };
        }
      );

      queryClient.setQueriesData(
        {
          queryKey: [QUERY_KEY.listNotifications],
          exact: false,
        },
        (prev: any) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page: NotificationsPageModel) => {
              return {
                ...page,
                unreadCount: page.unreadCount - 1,
                notifications: page.notifications.map((notification) => {
                  if (notification.id === variables) {
                    return {
                      ...notification,
                      isRead: true,
                    };
                  }
                  return notification;
                }),
              };
            }),
          };
        }
      );

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
