import { Navigate, Outlet } from "react-router-dom";

import { useAuthSession } from "../modules/auth/hooks/useAuthSession";

export default function PublicRoute() {
  const { isAuthenticated, isAdmin } = useAuthSession();

  return isAuthenticated
    ? <Navigate
        to={isAdmin ? "/admin" : "/dashboard"}
        replace
      />
    : <Outlet />;
}