import { Navigate, Outlet } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import AdminLayout from "../components/AdminLayout";

export default function AdminPage() {
  const { isAdmin } = useAuthSession();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}