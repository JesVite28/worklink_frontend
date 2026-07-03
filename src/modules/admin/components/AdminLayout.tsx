import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAdminLayout } from "../hooks/useAdminLayout";

type Props = {
  children?: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const {
    collapsed,
    mobileOpen,
    isLoggingOut,
    handleLogout,
    handleToggleCollapse,
    handleOpenMobileMenu,
    handleCloseMobileMenu,
  } = useAdminLayout();

  return (
    <div className="min-h-screen bg-background text-text lg:flex">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={handleCloseMobileMenu}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar
          onToggleMenu={handleOpenMobileMenu}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}