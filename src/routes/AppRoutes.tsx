import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../modules/home/pages/HomePage";
import LoginPage from "../modules/auth/pages/LoginPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import FreelancersPage from "../modules/freelancers/pages/FreelancersPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import {
  AdminChatsPage,
  AdminCompaniesPage,
  AdminDashboardPage,
  AdminFreelancersPage,
  AdminPage,
  AdminReportsPage,
  AdminRequestsPage,
  AdminReviewsPage,
  AdminServicesPage,
  AdminSettingsPage,
  AdminUsersPage,
  AdminVacanciesPage,
} from "../modules/admin/pages";

import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Login */}
        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />
        </Route>

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route
            path="usuarios"
            element={<AdminUsersPage />}
          />
          <Route
            path="empresas"
            element={<AdminCompaniesPage />}
          />
          <Route
            path="freelancers"
            element={<AdminFreelancersPage />}
          />
          <Route
            path="vacantes"
            element={<AdminVacanciesPage />}
          />
          <Route
            path="servicios"
            element={<AdminServicesPage />}
          />
          <Route
            path="solicitudes"
            element={<AdminRequestsPage />}
          />
          <Route
            path="chats"
            element={<AdminChatsPage />}
          />
          <Route
            path="resenas"
            element={<AdminReviewsPage />}
          />
          <Route
            path="reportes"
            element={<AdminReportsPage />}
          />
          <Route
            path="configuracion"
            element={<AdminSettingsPage />}
          />
        </Route>

        <Route
          path="/freelancers"
          element={<FreelancersPage />}
        />
        <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </BrowserRouter>
  );
}