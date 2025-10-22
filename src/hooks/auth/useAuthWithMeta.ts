import { useGetProfileMeta } from "../profile/useGetProfileMeta";
import { useAuth } from "./useAuth";

export const useAuthWithMeta = () => {
  const { auth } = useAuth();
  const metaQuery = useGetProfileMeta();

  return {
    id: auth?.user.id,
    username: auth?.user.username,
    roles: auth?.roles,

    meta: metaQuery.data,
    isLoading: metaQuery.isLoading,
    isError: metaQuery.isError,
    error: metaQuery.error,
  };
};
