import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  isAxiosError,
} from "axios";

import {
  showError,
  showSuccess,
} from "../../../shared/services/alertService";

import {
  login,
} from "../services/authService";

import type {
  UserData,
} from "../models/authResponse";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginErrorResponse = {
  message?: string;

  errors?: Record<
    string,
    string[]
  >;
};

interface PendingTwoFactorLogin {
  challengeToken: string;
  expiresIn: number;
  expiresAt: string;
  email: string;
  emailHint?: string;
  redirectTo: string | null;
}

interface UseLoginFormOptions {
  redirectTo?: string | null;
  onSuccess?: () => void;
}

const initialState: LoginFormState = {
  email: "",
  password: "",
};

const TWO_FACTOR_STORAGE_KEY =
  "worklink_pending_2fa";

function getRedirectPath(
  user: UserData,
): string | null {
  const roleName =
    user.role?.name;

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

function isAuthenticationRoute(
  path: string | null,
): boolean {
  if (!path) {
    return false;
  }

  const normalizedPath =
    path
      .split("?")[0]
      .split("#")[0];

  return [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-2fa",
  ].includes(normalizedPath);
}

function getSafeRedirect(
  redirectTo: string | null,
  fallback: string | null,
): string | null {
  if (
    redirectTo &&
    !isAuthenticationRoute(redirectTo)
  ) {
    return redirectTo;
  }

  return fallback;
}

export function useLoginForm(
  options?: UseLoginFormOptions,
) {
  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState<LoginFormState>(
    initialState,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  /**
   * Limpia completamente el formulario
   * de inicio de sesión.
   */
  const resetForm = useCallback(
    (): void => {
      setForm({
        email: "",
        password: "",
      });

      setShowPassword(false);
    },
    [],
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const {
      name,
      value,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const email =
      form.email
        .trim()
        .toLowerCase();

    const password =
      form.password;

    if (
      !email ||
      !password.trim()
    ) {
      await showError(
        "Ingresa tu correo electrónico y contraseña.",
      );

      return;
    }

    setIsLoading(true);

    try {
      const response =
        await login(
          email,
          password,
        );

      /**
       * --------------------------------------------------------------------------
       * El usuario necesita verificar el código 2FA
       * --------------------------------------------------------------------------
       */

      if (response.requires_2fa) {
        const pendingChallenge:
          PendingTwoFactorLogin = {
          challengeToken:
            response.data
              .challenge_token,

          expiresIn:
            response.data
              .expires_in,

          expiresAt:
            response.data
              .expires_at,

          email,

          emailHint:
            response.data
              .email_hint,

          redirectTo:
            isAuthenticationRoute(
              options?.redirectTo ??
                null,
            )
              ? null
              : options?.redirectTo ??
                null,
        };

        sessionStorage.setItem(
          TWO_FACTOR_STORAGE_KEY,
          JSON.stringify(
            pendingChallenge,
          ),
        );

        await showSuccess(
          response.message ||
            "Enviamos un código de verificación a tu correo.",
        );

        /**
         * El correo y la contraseña ya no son
         * necesarios en el formulario.
         */
        resetForm();

        /**
         * Cierra el modal antes de abrir
         * la pantalla de verificación.
         */
        options?.onSuccess?.();

        navigate(
          "/verify-2fa",
          {
            replace: true,
          },
        );

        return;
      }

      /**
       * --------------------------------------------------------------------------
       * Login completado sin 2FA
       * --------------------------------------------------------------------------
       */

      const {
        token,
        user,
      } = response.data;

      const roleRedirect =
        getRedirectPath(user);

      const finalRedirect =
        getSafeRedirect(
          options?.redirectTo ??
            null,
          roleRedirect,
        );

      if (!finalRedirect) {
        await showError(
          "Tu cuenta no tiene un rol válido asignado.",
        );

        return;
      }

      localStorage.setItem(
        "token",
        token,
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user),
      );

      sessionStorage.removeItem(
        TWO_FACTOR_STORAGE_KEY,
      );

      window.dispatchEvent(
        new CustomEvent(
          "auth:session-updated",
          {
            detail: {
              token,
              user,
            },
          },
        ),
      );

      await showSuccess(
        response.message ||
          "Sesión iniciada correctamente.",
      );

      /**
       * Limpia correo, contraseña y visibilidad
       * antes de cerrar el modal.
       */
      resetForm();

      options?.onSuccess?.();

      navigate(
        finalRedirect,
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error,
      );

      let message =
        "No fue posible iniciar sesión. Verifica tus credenciales.";

      if (
        isAxiosError<LoginErrorResponse>(
          error,
        )
      ) {
        const validationErrors =
          error.response?.data
            ?.errors;

        const firstValidationError =
          validationErrors
            ? Object.values(
                validationErrors,
              )[0]?.[0]
            : null;

        message =
          firstValidationError ||
          error.response?.data
            ?.message ||
          message;
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

    resetForm,
  };
}