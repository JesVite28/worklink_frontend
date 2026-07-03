import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type Props = {
  children?: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuthSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-text lg:flex">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((previous) => !previous)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar
          onToggleMenu={() => setMobileOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}