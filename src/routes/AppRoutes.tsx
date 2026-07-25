import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { LoginModalProvider } from "../context/LoginModalContext";

/* Layout público */
import PublicLayout from "../shared/components/layout/PublicLayout";

/* Páginas públicas */
import HomePage from "../modules/home/pages/HomePage";
import FreelancersPage from "../modules/freelancers/pages/FreelancersPage";
import FreelancerDetailPage from "../modules/freelancers/pages/FreelancerDetailPage";
import PublicVacanciesPage from "../modules/vacancies/pages/PublicVacanciesPage";
import PublicVacancyDetailPage from "../modules/vacancies/pages/PublicVacancyDetailPage";

/* Autenticación */
import LoginPage from "../modules/auth/pages/LoginPage";
import VerifyTwoFactorPage from "../modules/auth/pages/VerifyTwoFactorPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage";

/* Dashboard de usuarios */
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import DashboardHomePage from "../modules/dashboard/pages/DashboardHomePage";

/* Solicitudes de contratación */
import ContractRequestsPage from "../modules/contractRequests/pages/ContractRequestsPage";

/* Módulos del freelancer */
import MyServicesPage from "../modules/services/pages/MyServicesPage";
import MyBriefcasePage from "../modules/briefcase/pages/MyBriefcasePage";
import MyAvailabilityPage from "../modules/availability/pages/MyAvailabilityPage";
import MessagesPage from "../modules/messages/pages/MessagesPage";
import ContractsPage from "../modules/contracts/pages/ContractsPage";

/* Notificaciones */
import NotificationsPage from "../modules/notifications/pages/NotificationsPage";

/* Reseñas */
import ReviewsPage from "../modules/reviews/pages/ReviewsPage";

/* Módulos de empresa */
import MyVacanciesPage from "../modules/vacancies/pages/MyVacanciesPage";

/* Módulos de freelancer y empresa */
import ApplicationsDashboardPage from "../modules/applications/pages/ApplicationsDashboardPage";

/* Perfil */
import ProfilePage from "../modules/profile/pages/ProfilePage";

/* Chatbot */
import ChatBot from "../modules/chatbot/components/ChatbotWidget";

/* Administración */
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

/* Protección de rutas */
import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <LoginModalProvider>
        <Routes>
        {/* ===================================================== */}
        {/* LANDING Y AUTENTICACIÓN SOLO PARA VISITANTES */}
        {/* ===================================================== */}

        <Route element={<PublicRoute />}>
          {/* Landing con Navbar y Footer */}
          <Route element={<PublicLayout />}>
            <Route
              path="/"
              element={<HomePage />}
            />
          </Route>

          {/* Autenticación */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/verify-2fa"
            element={<VerifyTwoFactorPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />

          <Route
            path="/reset-password"
            element={<ResetPasswordPage />}
          />
        </Route>

        {/* ===================================================== */}
        {/* CONSULTAS PÚBLICAS CON O SIN SESIÓN */}
        {/* ===================================================== */}

        <Route element={<PublicLayout />}>
          {/* Freelancers */}
          <Route
            path="/freelancers"
            element={<FreelancersPage />}
          />

          <Route
            path="/freelancers/:profileId"
            element={<FreelancerDetailPage />}
          />

          {/* Vacantes */}
          <Route
            path="/vacantes"
            element={<PublicVacanciesPage />}
          />

          <Route
            path="/vacantes/:vacancyId"
            element={<PublicVacancyDetailPage />}
          />
        </Route>

        {/* ===================================================== */}
        {/* DASHBOARD DE CLIENTE, FREELANCER Y EMPRESA */}
        {/* ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              allowedRoles={[
                "cliente",
                "freelancer",
                "empresa",
              ]}
            >
              <DashboardPage />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<DashboardHomePage />}
          />

          <Route
            path="perfil"
            element={<ProfilePage />}
          />

          {/* ================================================= */}
          {/* FUNCIONES DEL FREELANCER */}
          {/* ================================================= */}

          <Route
            path="servicios"
            element={
              <PrivateRoute
                allowedRoles={["freelancer"]}
              >
                <MyServicesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="portafolio"
            element={
              <PrivateRoute
                allowedRoles={["freelancer"]}
              >
                <MyBriefcasePage />
              </PrivateRoute>
            }
          />

          <Route
            path="disponibilidad"
            element={
              <PrivateRoute
                allowedRoles={["freelancer"]}
              >
                <MyAvailabilityPage />
              </PrivateRoute>
            }
          />

          {/* ================================================= */}
          {/* FUNCIONES DE LA EMPRESA */}
          {/* ================================================= */}

          <Route
            path="vacantes"
            element={
              <PrivateRoute
                allowedRoles={["empresa"]}
              >
                <MyVacanciesPage />
              </PrivateRoute>
            }
          />

          {/* ================================================= */}
          {/* FUNCIONES DE FREELANCER Y EMPRESA */}
          {/* ================================================= */}

          <Route
            path="postulaciones"
            element={
              <PrivateRoute
                allowedRoles={[
                  "freelancer",
                  "empresa",
                ]}
              >
                <ApplicationsDashboardPage />
              </PrivateRoute>
            }
          />

          {/* ================================================= */}
          {/* FUNCIONES COMPARTIDAS */}
          {/* ================================================= */}

          <Route
            path="solicitudes"
            element={
              <PrivateRoute
                allowedRoles={[
                  "cliente",
                  "empresa",
                  "freelancer",
                ]}
              >
                <ContractRequestsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="contratos"
            element={<ContractsPage />}
          />

          <Route
            path="mensajes"
            element={<MessagesPage />}
          />

          <Route
            path="notificaciones"
            element={<NotificationsPage />}
          />

          <Route
            path="resenas"
            element={<ReviewsPage />}
          />

          {/* Ruta desconocida dentro del dashboard */}
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Route>

        {/* ===================================================== */}
        {/* PANEL ADMINISTRATIVO */}
        {/* ===================================================== */}

        <Route
          path="/admin"
          element={
            <PrivateRoute
              allowedRoles={["admin"]}
            >
              <AdminPage />
            </PrivateRoute>
          }
        >
          <Route
            index
            element={<AdminDashboardPage />}
          />

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

          {/* Ruta administrativa desconocida */}
          <Route
            path="*"
            element={
              <Navigate
                to="/admin"
                replace
              />
            }
          />
        </Route>

        {/* ===================================================== */}
        {/* RUTA GLOBAL NO ENCONTRADA */}
        {/* ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
        </Routes>

        <ChatBot />
      </LoginModalProvider>
    </BrowserRouter>
  );
}