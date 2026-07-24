import { useCallback } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../../context/useAuth";
import { useLoginModal } from "../../../context/LoginModalContext";

export function useProtectedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const goToPublicRoute = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const goToProtectedRoute = useCallback(
    (path: string) => {
      if (isAuthenticated) {
        navigate(path);
        return;
      }

      openLoginModal(path);
    },
    [
      isAuthenticated,
      location.pathname,
      navigate,
    ],
  );

  return {
    isAuthenticated,
    goToPublicRoute,
    goToProtectedRoute,
  };
}