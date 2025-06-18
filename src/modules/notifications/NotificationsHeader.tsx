import { useEffect } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetProfileMeta } from "../../hooks/profile/useGetProfileMeta";
import { useToast } from "../../hooks/useToast";

import Back from "../../components/Back";

const NotificationsHeader = () => {
  const { auth } = useAuth();
  const { addToast } = useToast();

  const {
    data: meta,
    isError,
    error,
  } = useGetProfileMeta([auth?.user?.profilePicture]);

  useEffect(() => {
    if (isError) {
      addToast(
        error?.response?.data.type || "error",
        error?.response?.data.message
      );
    }
  }, [isError]);

  return (
    <>
      <Back className='link mb-1' />
      <header className='notifications__header'>
        <div>
          <h1>Értesítések</h1>
          {!!meta?.unreadNotifications && meta.unreadNotifications > 0 && (
            <span className='badge fw-600'>{meta.unreadNotifications}</span>
          )}
        </div>
        <button type='button'>Összes megjelölése olvasottként</button>
      </header>
    </>
  );
};

export default NotificationsHeader;
