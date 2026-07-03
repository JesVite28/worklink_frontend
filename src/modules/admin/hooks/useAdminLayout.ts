import { useState } from "react";

import { useLogout } from "./useLogout";

export function useAdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { handleLogout, isLoggingOut } = useLogout();

  const handleToggleCollapse = () => {
    setCollapsed((previous) => !previous);
  };

  const handleOpenMobileMenu = () => {
    setMobileOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setMobileOpen(false);
  };

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