import {
  useEffect,
  type MouseEvent,
} from "react";

import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../context/useAuth";
import { useLoginForm } from "../hooks/useLoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const { isAuthenticated } = useAuth();

  const {
    form,
    handleChange,
    handleSubmit,
    isLoading,
    showPassword,
    setShowPassword,
  } = useLoginForm({
    redirectTo: undefined,
    onSuccess: onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (
      isOpen &&
      isAuthenticated
    ) {
      onClose();
    }
  }, [
    isAuthenticated,
    isOpen,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(
    event: MouseEvent<HTMLDivElement>,
  ) {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
    >
      <section className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Cerrar inicio de sesión"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="pr-10">
          <img
            src="/logo.png"
            alt="WorkLink"
            className="h-14 w-auto"
          />

          <h2
            id="login-modal-title"
            className="mt-5 text-2xl font-bold text-text"
          >
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Ingresa a tu cuenta para conectar,
            contratar y postularte en WorkLink.
          </p>
        </div>

        <form
          className="mt-7 space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="modal-email"
              className="text-sm font-medium text-text"
            >
              Correo electrónico
            </label>

            <input
              id="modal-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label
              htmlFor="modal-password"
              className="text-sm font-medium text-text"
            >
              Contraseña
            </label>

            <div className="relative mt-2">
              <input
                id="modal-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-12 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="button"
                onClick={() => {
                  setShowPassword(
                    !showPassword,
                  );
                }}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-primary"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                onClick={onClose}
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          ¿No tienes una cuenta?{" "}

          <Link
            to="/register"
            onClick={onClose}
            className="font-semibold text-primary hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </section>
    </div>,
    document.body,
  );
}