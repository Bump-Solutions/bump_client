import { createContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../hooks/profile/useGetProfile";
import { QUERY_KEY } from "../utils/queryKeys";
import { ProfileModel } from "../models/profileModel";

interface PersonalSettingsContextType {
  data: ProfileModel | undefined;
  setData: (data: Partial<ProfileModel>) => void;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

export const PersonalSettingsContext = createContext<
  PersonalSettingsContextType | undefined
>(undefined);

interface BasicSettingsProviderProps {
  children: ReactNode;
}

const PersonalSettingsProvider = ({ children }: BasicSettingsProviderProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useGetProfile();

  const setData = (data: Partial<ProfileModel>) => {
    queryClient.setQueryData(
      [QUERY_KEY.getProfile],
      (prev: ProfileModel | undefined) => ({
        ...prev,
        ...data,
      })
    );
  };

  return (
    <PersonalSettingsContext
      value={{ data, setData, isLoading, isError, error }}>
      {children}
    </PersonalSettingsContext>
  );
};

export default PersonalSettingsProvider;
