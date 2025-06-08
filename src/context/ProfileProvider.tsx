import { ROUTES } from "../routes/routes";
import { QUERY_KEY } from "../utils/queryKeys";
import { ApiError } from "../types/api";
import { UserModel } from "../models/userModel";

import { createContext, ReactNode, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../hooks/auth/useAuth";
import { useGetUser } from "../hooks/user/useGetUser";

interface ProfileContextType {
  user: UserModel | undefined;
  setUser: (data: Partial<UserModel>) => void;
  isOwnProfile: boolean;
  isLoading: boolean;
  error?: ApiError | null;
  isError: boolean;
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetUser([uname], { username: uname! });

  useEffect(() => {
    if (isError) {
      navigate(ROUTES.NOTFOUND, {
        replace: true,
        state: {
          error: {
            code: 404,
            title: "Hibás felhasználónév",
            message: `Sajnáljuk, a(z) '${uname}' nevű felhasználó nem található. Megeshet, hogy elírás van a felhasználónévben, vagy a felhasználó törölve lett.`,
          },
        },
      });
    }
  }, [isError]);

  const setUser = (data: Partial<UserModel>) => {
    queryClient.setQueryData(
      [QUERY_KEY.getUser, uname],
      (prev: UserModel | undefined) => ({
        ...prev,
        ...data,
      })
    );
  };

  const isOwnProfile = useMemo(() => {
    return auth?.user?.username === uname;
  }, [auth?.user?.username, uname]);

  return (
    <ProfileContext
      value={{ user, setUser, isOwnProfile, isLoading, error, isError }}>
      {children}
    </ProfileContext>
  );
};

export default ProfileProvider;
