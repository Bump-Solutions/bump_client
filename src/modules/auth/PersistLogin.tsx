import { Outlet } from "react-router";
import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/auth/useAuth";
import { useToast } from "../../hooks/useToast";
import { useRefreshToken } from "../../hooks/auth/useRefreshToken";

import Spinner from "../../components/Spinner";

const PersistLogin = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const { auth } = useAuth();
  const refresh = useRefreshToken();

  const { addToast } = useToast();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error: any) {
        addToast(
          error?.response?.data.type || "error",
          error?.response?.data.message
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
