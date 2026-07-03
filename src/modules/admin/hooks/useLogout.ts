import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import { logout as logoutRequest } from "../../auth/services/authService";

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
    } catch (error) {
      console.error("No fue posible cerrar sesión en el backend:", error);
    } finally {
      logout();
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
}