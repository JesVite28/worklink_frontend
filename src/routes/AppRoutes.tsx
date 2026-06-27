import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../modules/home/HomePage";
import Login from "../modules/auth/Login";
import DashboardPage from "../modules/dashboard/DashboardPage";
import FreelancersPage from "../modules/freelancers/pages/FreelancersPage";
import RegisterPage from "../modules/auth/Register";

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
            element={<Login />}
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
  path="/freelancers"
  element={<FreelancersPage />}
/>
<Route path="/register" element={<RegisterPage />} />

      </Routes>
    </BrowserRouter>
  );
}