import { Outlet } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";

export default function AdminPage() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}