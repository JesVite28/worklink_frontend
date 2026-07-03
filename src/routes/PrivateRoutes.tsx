import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthSession } from "../modules/auth/hooks/useAuthSession";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function PrivateRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, primaryRole } = useAuthSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = primaryRole?.toLowerCase();

    const hasAllowedRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasAllowedRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}