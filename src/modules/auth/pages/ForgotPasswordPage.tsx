import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

import {
  isAxiosError,
} from "axios";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import {
  useLoginModal,
} from "../../../context/LoginModalContext";

import {
  forgotPassword,
} from "../services/authService";

interface ApiErrorResponse {
  message?: string;

  errors?: Record<
    string,
    string[]
  >;
}

function isValidEmail(
  email: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim(),
  );
}

function getErrorMessage(
  error: unknown,
): string {
  const fallback =
    "No fue posible enviar el correo de recuperación.";

  if (
    !isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return fallback;
  }

  const errors =
    error.response?.data
      ?.errors;

  const firstValidationError =
    errors
      ? Object.values(
          errors,
        )[0]?.[0]
      : null;

  return (
    firstValidationError ||
    error.response?.data
      ?.message ||
    fallback
  );
}

export default function ForgotPasswordPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    openLoginModal,
  } = useLoginModal();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    emailSent,
    setEmailSent,
  ] = useState(false);

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    setEmail(
      event.target.value,
    );

    if (emailSent) {
      setEmailSent(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      await showWarning(
        "Ingresa tu correo electrónico.",
      );

      return;
    }

    if (
      !isValidEmail(
        normalizedEmail,
      )
    ) {
      await showWarning(
        "Ingresa un correo electrónico válido.",
      );

      return;
    }

    setIsLoading(true);

    try {
      const response =
        await forgotPassword(
          normalizedEmail,
        );

      setEmailSent(true);

      await showSuccess(
        response.message ||
          "Si existe una cuenta con ese correo, enviaremos un enlace de recuperación.",
      );
    } catch (error) {
      console.error(
        "Error al solicitar recuperación:",
        error,
      );

      await showError(
        getErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenLogin(): void {
    openLoginModal(
      location.pathname,
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-6 shadow-xl sm:p-9">
          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition hover:text-primary"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Volver al inicio
          </button>

          <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <EnvelopeIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
            Recuperar contraseña
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            Escribe el correo asociado a tu cuenta. Te enviaremos un enlace para crear una nueva contraseña.
          </p>

          {emailSent && (
            <div className="mt-6 rounded-2xl border border-success/30 bg-success/5 p-4">
              <p className="text-sm font-medium text-success">
                Revisa tu bandeja de entrada y la carpeta de correo no deseado.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="forgot-password-email"
                className="block text-sm font-semibold text-text"
              >
                Correo electrónico
              </label>

              <div className="relative mt-2">
                <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="forgot-password-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  autoFocus
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PaperAirplaneIcon className="h-5 w-5" />

              {isLoading
                ? "Enviando..."
                : emailSent
                  ? "Enviar nuevamente"
                  : "Enviar enlace de recuperación"}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-text-muted">
              ¿Recordaste tu contraseña?
            </p>

            <button
              type="button"
              onClick={handleOpenLogin}
              className="mt-2 font-semibold text-primary hover:underline"
            >
              Iniciar sesión
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}