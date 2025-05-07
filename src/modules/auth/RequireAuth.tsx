import { ROUTES } from "../../routes/routes";

import { useAuth } from "../../hooks/auth/useAuth";
import { useLocation, Navigate, Outlet } from "react-router";

interface RequireAuthProps {
  allowedRoles: number[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { auth } = useAuth();
  const location = useLocation();

  const hasAccess = auth?.roles?.some((role) => allowedRoles.includes(role));

  // Has access to the route
  if (hasAccess) {
    return <Outlet />;
  }

  // User is authenticated but doesn't have access to the route
  if (auth?.user) {
    return (
      <Navigate to={ROUTES.UNAUTHORIZED} state={{ from: location }} replace />
    );
  }

  // User is not authenticated
  return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
};

export default RequireAuth;
