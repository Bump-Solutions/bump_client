import { logout } from "../../services/authService";

import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = (): (() => Promise<void>) => {
  const { setAuth } = useAuth();

  const queryClient = useQueryClient();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();

      setAuth(null);
      queryClient.clear();
    } catch (error) {
      throw new Error(`Server error: ${error}`);
    }
  };

  return handleLogout;
};
