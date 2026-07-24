import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/useAuth";

export default function PublicRoute() {
  const {
    isAuthenticated,
    isInitializing,
    isAdmin,
  } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-text-muted">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={isAdmin ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}