import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../modules/home/HomePage";

import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoute";

function Dashboard() {
  return <h1>Dashboard privado</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}