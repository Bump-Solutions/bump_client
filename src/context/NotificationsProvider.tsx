import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useListNotifications } from "../hooks/notifications/useListNotifications";
import {
  NotificationModel,
  NotificationsPageModel,
} from "../models/notificationModel";

interface NotificationsContextType {
  pages: NotificationsPageModel[] | null;
  unreadNotificationCount: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isError: boolean;
  fetchNextPage: () => void;
}

export const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [pages, setPages] = useState<NotificationsPageModel[] | null>(null);

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useListNotifications([], {});

  useEffect(() => {
    if (data?.pages) {
      setPages(data.pages);
    }
  }, [data]);

  const unreadNotificationCount = useMemo(() => {
    if (!pages) return 0;
    return pages.reduce((count, page) => {
      return (
        count +
        page.notifications.filter((n: NotificationModel) => !n.isRead).length
      );
    }, 0);
  }, [pages]);

  // Kesobb esetleg dinamikus title: (count) Valami - Brand

  return (
    <NotificationsContext
      value={{
        pages,
        unreadNotificationCount,
        isLoading,
        isFetchingNextPage,
        isError,
        fetchNextPage,
      }}>
      {children}
    </NotificationsContext>
  );
};

export default NotificationsProvider;
