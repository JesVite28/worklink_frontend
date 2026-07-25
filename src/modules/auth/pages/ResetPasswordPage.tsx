import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ShieldCheckIcon,
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
  resetPassword,
} from "../services/authService";

interface ResetPasswordForm {
  password: string;
  passwordConfirmation: string;
}

interface ApiErrorResponse {
  message?: string;

  errors?: Record<
    string,
    string[]
  >;
}

const initialForm: ResetPasswordForm = {
  password: "",
  passwordConfirmation: "",
};

function getErrorMessage(
  error: unknown,
): string {
  const fallback =
    "No fue posible restablecer la contraseña.";

  if (
    !isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return fallback;
  }

  const validationErrors =
    error.response?.data
      ?.errors;

  const firstValidationError =
    validationErrors
      ? Object.values(
          validationErrors,
        )[0]?.[0]
      : null;

  return (
    firstValidationError ||
    error.response?.data
      ?.message ||
    fallback
  );
}

export default function ResetPasswordPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    searchParams,
  ] = useSearchParams();

  const {
    openLoginModal,
  } = useLoginModal();

  const token =
    searchParams.get("token")?.trim() ??
    "";

  const email =
    searchParams.get("email")?.trim() ??
    "";

  const [
    form,
    setForm,
  ] = useState<ResetPasswordForm>(
    initialForm,
  );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    passwordChanged,
    setPasswordChanged,
  ] = useState(false);

  const passwordRequirements =
    useMemo(
      () => ({
        minimumLength:
          form.password.length >= 8,

        hasUppercase:
          /[A-Z]/.test(
            form.password,
          ),

        hasLowercase:
          /[a-z]/.test(
            form.password,
          ),

        hasNumber:
          /\d/.test(
            form.password,
          ),

        passwordsMatch:
          form.password !== "" &&
          form.password ===
            form.passwordConfirmation,
      }),
      [
        form.password,
        form.passwordConfirmation,
      ],
    );

  const hasValidLink =
    Boolean(token && email);

  if (!hasValidLink) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    );
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      }),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!form.password) {
      await showWarning(
        "Escribe tu nueva contraseña.",
      );

      return;
    }

    if (
      form.password.length < 8
    ) {
      await showWarning(
        "La contraseña debe tener al menos 8 caracteres.",
      );

      return;
    }

    if (
      !form.passwordConfirmation
    ) {
      await showWarning(
        "Confirma tu nueva contraseña.",
      );

      return;
    }

    if (
      form.password !==
      form.passwordConfirmation
    ) {
      await showWarning(
        "Las contraseñas no coinciden.",
      );

      return;
    }

    setIsLoading(true);

    try {
      const response =
        await resetPassword({
          token,
          email,
          password:
            form.password,

          password_confirmation:
            form.passwordConfirmation,
        });

      setPasswordChanged(true);

      setForm(initialForm);

      await showSuccess(
        response.message ||
          "Tu contraseña se actualizó correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al restablecer la contraseña:",
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

  if (passwordChanged) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-text">
        <Navbar />

        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <section className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-6 text-center shadow-xl sm:p-9">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircleIcon className="h-11 w-11" />
            </div>

            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
              Contraseña actualizada
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
            </p>

            <button
              type="button"
              onClick={handleOpenLogin}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              <ShieldCheckIcon className="h-5 w-5" />
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => {
                navigate("/", {
                  replace: true,
                });
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver al inicio
            </button>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-6 shadow-xl sm:p-9">
          <button
            type="button"
            onClick={() => {
              navigate(
                "/forgot-password",
              );
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition hover:text-primary"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Solicitar otro enlace
          </button>

          <div className="mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
            Crear nueva contraseña
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            Establece una contraseña nueva para la cuenta asociada a:
          </p>

          <p className="mt-2 break-all text-sm font-semibold text-primary">
            {email}
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="reset-password"
                className="block text-sm font-semibold text-text"
              >
                Nueva contraseña
              </label>

              <div className="relative mt-2">
                <input
                  id="reset-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  autoFocus
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-12 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(
                      !showPassword,
                    );
                  }}
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-primary disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reset-password-confirmation"
                className="block text-sm font-semibold text-text"
              >
                Confirmar contraseña
              </label>

              <div className="relative mt-2">
                <input
                  id="reset-password-confirmation"
                  name="passwordConfirmation"
                  type={
                    showConfirmation
                      ? "text"
                      : "password"
                  }
                  value={
                    form.passwordConfirmation
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-12 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmation(
                      !showConfirmation,
                    );
                  }}
                  disabled={isLoading}
                  aria-label={
                    showConfirmation
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-primary disabled:opacity-50"
                >
                  {showConfirmation ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-text">
                Requisitos
              </p>

              <div className="mt-3 grid gap-2 text-xs">
                <p
                  className={
                    passwordRequirements.minimumLength
                      ? "text-success"
                      : "text-text-muted"
                  }
                >
                  Al menos 8 caracteres
                </p>

                <p
                  className={
                    passwordRequirements.hasUppercase
                      ? "text-success"
                      : "text-text-muted"
                  }
                >
                  Una letra mayúscula
                </p>

                <p
                  className={
                    passwordRequirements.hasLowercase
                      ? "text-success"
                      : "text-text-muted"
                  }
                >
                  Una letra minúscula
                </p>

                <p
                  className={
                    passwordRequirements.hasNumber
                      ? "text-success"
                      : "text-text-muted"
                  }
                >
                  Un número
                </p>

                <p
                  className={
                    passwordRequirements.passwordsMatch
                      ? "text-success"
                      : "text-text-muted"
                  }
                >
                  Las contraseñas coinciden
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShieldCheckIcon className="h-5 w-5" />

              {isLoading
                ? "Actualizando..."
                : "Restablecer contraseña"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}