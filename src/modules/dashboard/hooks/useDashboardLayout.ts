import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/useAuth";

export function useDashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((previous) => !previous);
  }, []);

  const handleOpenMobileMenu = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      // Navigate home before clearing session to avoid immediate redirect to /login
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
  }, [isLoggingOut, logout, navigate]);

  return {
    collapsed,
    mobileOpen,
    isLoggingOut,

    handleLogout,
    handleToggleCollapse,
    handleOpenMobileMenu,
    handleCloseMobileMenu,
  };
}