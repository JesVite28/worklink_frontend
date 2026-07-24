import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  showError,
  showSuccess,
} from "../../../shared/services/alertService";

import { login } from "../services/authService";
import type { UserData } from "../models/authResponse";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginErrorResponse = {
  message?: string;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
};

function getRedirectPath(user: UserData): string | null {
  const roleName = user.role?.name;

  switch (roleName) {
    case "admin":
      return "/admin";

    case "cliente":
    case "freelancer":
    case "empresa":
      return "/dashboard";

    default:
      return null;
  }
}

interface UseLoginFormOptions {
  redirectTo?: string | null;
  onSuccess?: () => void;
}

export function useLoginForm(options?: UseLoginFormOptions) {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<LoginFormState>(initialState);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password.trim()) {
      await showError(
        "Ingresa tu correo electrónico y contraseña.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);

      const { token, user } = response.data;

      const roleRedirect = getRedirectPath(user);

      // Sanitize redirect coming from options: avoid redirecting back
      // to auth-related routes like /login, /register or /forgot-password.
      const rawRedirect = options?.redirectTo ?? null;

      const isAuthRoute = (path: string | null) => {
        if (!path) return false;
        const p = path.split("?")[0].split("#")[0];
        return (
          p === "/login" ||
          p === "/register" ||
          p === "/forgot-password"
        );
      };

      const finalRedirect = isAuthRoute(rawRedirect) ? roleRedirect : rawRedirect ?? roleRedirect;

      if (!finalRedirect) {
        await showError(
          "Tu cuenta no tiene un rol válido asignado.",
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(
        new CustomEvent("auth:session-updated", {
          detail: {
            token,
            user,
          },
        }),
      );

      await showSuccess(
        response.message || "Sesión iniciada correctamente.",
      );

      // Allow caller to react (e.g. close modal) before navigating
      try {
        options?.onSuccess?.();
      } catch (e) {
        // ignore
      }

      navigate(finalRedirect, {
        replace: true,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      let message =
        "No fue posible iniciar sesión. Verifica tus credenciales.";

      if (isAxiosError<LoginErrorResponse>(error)) {
        message =
          error.response?.data?.message || message;
      }

      await showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    isLoading,
    showPassword,
    setShowPassword,
  };
}