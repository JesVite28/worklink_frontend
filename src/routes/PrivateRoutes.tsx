import { Navigate } from "react-router-dom";

import { useAuthSession } from "../modules/auth/hooks/useAuthSession";

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({
  children,
}: Props) {
  const { isAuthenticated } = useAuthSession();

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}