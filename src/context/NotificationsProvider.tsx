import { createContext, ReactNode, useMemo } from "react";
import { useListNotifications } from "../hooks/notifications/useListNotifications";
import {
  NotificationModel,
  NotificationsPageModel,
} from "../models/notificationModel";

const TYPES = [1, 2] as const;
type NotificationType = (typeof TYPES)[number];

interface TabQuery {
  notifications: NotificationModel[];
  unreadCount: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
}

interface NotificationsContextType {
  getTab: (type: NotificationType) => TabQuery;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
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
          unreadCount: pages[0]?.unreadCount ?? 0,
          isLoading: q.isLoading,
          isFetchingNextPage: q.isFetchingNextPage,
          isError: q.isError,
          fetchNextPage: q.fetchNextPage,
          hasNextPage: q.hasNextPage,
        };
        return acc;
      },
      {} as any
    );
  }, [queries]);

  return (
    <NotificationsContext value={{ getTab: (type) => tabs[type] }}>
      {children}
    </NotificationsContext>
  );
};

export default NotificationsProvider;
