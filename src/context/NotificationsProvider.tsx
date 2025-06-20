import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useListNotifications } from "../hooks/notifications/useListNotifications";
import {
  NotificationModel,
  NotificationsPageModel,
} from "../models/notificationModel";
import { useMarkNotificationAsRead } from "../hooks/notifications/useMarkNotificationAsRead";
import { ApiResponse } from "../types/api";
import { useAuth } from "../hooks/auth/useAuth";
import { API } from "../utils/api";
import { useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";
import { fromNotificationDTO } from "../mappers/notificationMapper";
import { FetchedNotificationDTO } from "../dtos/NotificationDTO";
import { QUERY_KEY } from "../utils/queryKeys";

const TYPES = [1, 2] as const;
export type NotificationType = (typeof TYPES)[number];

interface TabQuery {
  notifications: NotificationModel[];
  count: number;
  unreadCount: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
}

interface NotificationsContextType {
  getTab: (type: NotificationType) => TabQuery;
  markAsRead: (notificationId: number) => Promise<ApiResponse>;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // 1) Lekérdezzük a notification-öket pagináltan
  const queries = TYPES.map((type) => useListNotifications([type], { type }));
  const tabs = useMemo(() => {
    return TYPES.reduce<Record<NotificationType, TabQuery>>(
      (acc, type, idx) => {
        const q = queries[idx];
        const pages = q.data?.pages ?? [];
        acc[type] = {
          notifications: pages.flatMap(
            (page: NotificationsPageModel) => page.notifications
          ),
          count: pages[0]?.count ?? 0,
          unreadCount: pages[0]?.unreadCount ?? 0,
          isLoading: q.isLoading,
          isFetchingNextPage: q.isFetchingNextPage,
          isError: q.isError,
          fetchNextPage: q.fetchNextPage,
          hasNextPage: q.hasNextPage,
        };
        return acc;
      },
      {} as Record<NotificationType, TabQuery>
    );
  }, [queries]);

  const getTab = useCallback(
    (type: NotificationType): TabQuery => {
      return tabs[type];
    },
    [tabs]
  );

  // 2) Mark-as-read mutáció
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAsRead = useCallback(
    (notificationId: number) => {
      return markAsReadMutation.mutateAsync(notificationId);
    },
    [markAsReadMutation]
  );

  // 3) WebSocket beállítása, csak ha van auth.accessToken
  const URL = `${API.WS_BASE_URL}/notifications/`;
  const { lastJsonMessage } = useWebSocket(
    URL,
    {
      queryParams: {
        token: auth?.accessToken!,
      },
      shouldReconnect: (closeEvent) => {
        return Boolean(auth?.accessToken);
      },
      share: true,
    },
    Boolean(auth?.accessToken)
  );

  // 4) Ha van új üzenet, akkor frissítjük a megfelelő tabot
  useEffect(() => {
    if (!lastJsonMessage) return;

    const dto = lastJsonMessage as FetchedNotificationDTO;
    const newNotification = fromNotificationDTO(dto);

    // Map the type to the correct tab: type: tab index
    const mapping: Record<number, NotificationType> = {
      0: 1, // message-related
      1: 2, // follow
      2: 2, // like
    };
    const tabType = mapping[newNotification.type] as NotificationType;

    // Update global notification counter
    // TODO: if refetch is slow, aggregate updates as on backend
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.getProfileMeta, auth?.user?.profilePicture],
      exact: true,
      refetchType: "active",
    });
    /* 
    queryClient.setQueryData(
      [QUERY_KEY.getProfileMeta, auth?.user?.profilePicture],
      (prev: any) => {
        if (!prev) return prev;

        return {
          ...prev,
          unreadNotifications: (prev.unreadNotifications ?? 0) + 1,
        };
      }
    );
    */

    // Update the specific tab with the new notification
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.listNotifications, tabType],
      exact: true,
      refetchType: "all",
    });
  }, [
    lastJsonMessage,
    auth?.accessToken,
    auth?.user?.profilePicture,
    queryClient,
  ]);

  return (
    <NotificationsContext value={{ getTab, markAsRead }}>
      {children}
    </NotificationsContext>
  );
};

export default NotificationsProvider;
