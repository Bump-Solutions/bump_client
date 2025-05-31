import { createContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetProfile } from "../hooks/profile/useGetProfile";
import { QUERY_KEY } from "../utils/queryKeys";
import { NewAddress } from "../types/address";

interface PersonalSettingsData {
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  bio?: string;
  address?: NewAddress;
  profile_picture: string;
  profile_picture_hash?: string;
}

interface PersonalSettingsContextType {
  formData: PersonalSettingsData;
  setFormData: (data: Partial<PersonalSettingsData>) => void;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

export const PersonalSettingsContext = createContext<
  PersonalSettingsContextType | undefined
>(undefined);

interface BasicSettingsProviderProps {
  children: ReactNode;
}

const PersonalSettingsProvider = ({ children }: BasicSettingsProviderProps) => {
  const queryClient = useQueryClient();

  const { data: formData, isLoading, isError, error } = useGetProfile();

  const setFormData = (data: Partial<PersonalSettingsData>) => {
    queryClient.setQueryData(
      [QUERY_KEY.getProfile],
      (prev: PersonalSettingsData | undefined) => ({
        ...prev,
        ...data,
      })
    );
  };

  return (
    <PersonalSettingsContext
      value={{ formData, setFormData, isLoading, isError, error }}>
      {children}
    </PersonalSettingsContext>
  );
};

export default PersonalSettingsProvider;
