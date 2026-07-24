import { Navigate } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";

import MyApplicationsPage from "./MyApplicationsPage";
import ReceivedApplicationsPage from "./ReceivedApplicationsPage";

export default function ApplicationsDashboardPage() {
  const { primaryRole } = useAuthSession();

  if (primaryRole === "freelancer") {
    return <MyApplicationsPage />;
  }

  if (primaryRole === "empresa") {
    return <ReceivedApplicationsPage />;
  }

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}