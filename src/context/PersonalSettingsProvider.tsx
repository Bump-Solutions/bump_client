import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../hooks/profile/useGetProfile";
import { QUERY_KEY } from "../utils/queryKeys";
import { ProfileModel } from "../models/profileModel";
import { Navigate } from "react-router";
import { ROUTES } from "../routes/routes";

interface PersonalSettingsContextType {
  data: ProfileModel | undefined;
  setData: (data: Partial<ProfileModel>) => void;
  isLoading: boolean;
}

export const PersonalSettingsContext = createContext<
  PersonalSettingsContextType | undefined
>(undefined);

interface BasicSettingsProviderProps {
  children: ReactNode;
}

const PersonalSettingsProvider = ({ children }: BasicSettingsProviderProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useGetProfile();

  const setData = useCallback(
    (data: Partial<ProfileModel>) => {
      queryClient.setQueryData(
        [QUERY_KEY.getProfile],
        (prev: ProfileModel | undefined) => ({
          ...prev,
          ...data,
        })
      );
    },
    [queryClient]
  );

  const contextValue = useMemo<PersonalSettingsContextType>(
    () => ({
      data,
      setData,
      isLoading,
    }),
    [data, setData, isLoading]
  );

  if (isError) {
    return (
      <Navigate
        to={ROUTES.NOTFOUND}
        replace
        state={{
          error: {
            code: 500,
            title: "Hiba a profil betöltése során",
            message:
              "Nem sikerült betölteni a profilodat. Kérjük, próbáld meg később újra.",
          },
        }}
      />
    );
  }

  return (
    <PersonalSettingsContext value={contextValue}>
      {children}
    </PersonalSettingsContext>
  );
};

export default PersonalSettingsProvider;
