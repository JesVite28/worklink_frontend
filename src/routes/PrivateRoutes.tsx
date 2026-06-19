import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const isAuthenticated = false;

  return isAuthenticated
    ? children
    : <Navigate to="/" replace />;
}