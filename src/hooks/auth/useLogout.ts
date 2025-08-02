import { toast } from "sonner";
import { logout } from "../../services/authService";

import { useAuth } from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = (): (() => Promise<void>) => {
  const { setAuth } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async (): Promise<void> => {
    toast.promise(
      (async () => {
        await logout();
        setAuth(null);
        queryClient.clear();
      })(),
      {
        loading: "Kijelentkezés…",
        success: "Kijelentkeztél.",
      }
    );
  };

  return handleLogout;
};
