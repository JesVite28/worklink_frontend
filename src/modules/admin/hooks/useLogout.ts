import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/useAuth";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      // Navigate to home first to avoid immediate PrivateRoute redirects
      navigate("/", { replace: true });

      await logout();
    } catch (error) {
      console.error(
        "No fue posible cerrar la sesión:",
        error,
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}