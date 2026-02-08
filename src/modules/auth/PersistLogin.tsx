import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { toast } from "sonner";
import { useAuth } from "../../hooks/auth/useAuth";
import { useRefreshToken } from "../../hooks/auth/useRefreshToken";

import Spinner from "../../components/Spinner";

const PersistLogin = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error: any) {
        console.error(error);
        toast.error(
          (error?.response?.data.message as string) ||
            "Szerverhiba. Próbáld újra később.",
        );
      } finally {
        setLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  return loading ? <Spinner /> : <Outlet />;
};

export default PersistLogin;
