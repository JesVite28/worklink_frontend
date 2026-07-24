import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

import { useAuth } from "../context/useAuth";
import type { UserRole } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function PrivateRoute({
  children,
  allowedRoles,
}: Props) {
  const {
    isAuthenticated,
    isInitializing,
    primaryRole,
    isAdmin,
  } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

          <p className="mt-4 text-text-muted">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    allowedRoles?.length &&
    (
      !primaryRole ||
      !allowedRoles.includes(primaryRole)
    )
  ) {
    return (
      <Navigate
        to={isAdmin ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}