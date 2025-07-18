import { ROUTES } from "../routes/routes";
import { QUERY_KEY } from "../utils/queryKeys";
import { UserModel } from "../models/userModel";

import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useParams, Navigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../hooks/auth/useAuth";
import { useGetUser } from "../hooks/user/useGetUser";

interface ProfileContextType {
  user: UserModel | undefined;
  setUser: (data: Partial<UserModel>) => void;
  isOwnProfile: boolean;
  isLoading: boolean;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { auth } = useAuth();
  const { uname } = useParams();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetUser([uname], { username: uname! });

  const setUser = useCallback(
    (data: Partial<UserModel>) => {
      queryClient.setQueryData(
        [QUERY_KEY.getUser, uname],
        (prev: UserModel | undefined) => ({
          ...prev,
          ...data,
        })
      );
    },
    [queryClient, uname]
  );

  const isOwnProfile = auth?.user?.username === uname;

  const contextValue = useMemo<ProfileContextType>(
    () => ({
      user,
      setUser,
      isOwnProfile,
      isLoading,
    }),
    [user, setUser, isOwnProfile, isLoading]
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 404,
            title: "Hibás felhasználónév",
            message: `Sajnáljuk, a(z) '${uname}' nevű felhasználó nem található. Megeshet, hogy elírás van a felhasználónévben, vagy a felhasználó törölve lett.`,
          },
        }}
      />
    );
  }

  return <ProfileContext value={contextValue}>{children}</ProfileContext>;
};

export default ProfileProvider;
