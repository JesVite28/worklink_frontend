import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
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
  resendTwoFactorLogin,
  verifyTwoFactorLogin,
} from "../services/authService";

import type {
  UserData,
} from "../models/authResponse";

interface PendingTwoFactorLogin {
  challengeToken: string;
  expiresIn: number;
  expiresAt: string;
  email: string;
  emailHint?: string;
  redirectTo: string | null;
}

interface ApiErrorResponse {
  message?: string;

  errors?: Record<
    string,
    string[]
  >;
}

const TWO_FACTOR_STORAGE_KEY =
  "worklink_pending_2fa";

function readPendingChallenge():
  PendingTwoFactorLogin | null {
  const storedChallenge =
    sessionStorage.getItem(
      TWO_FACTOR_STORAGE_KEY,
    );

  if (!storedChallenge) {
    return null;
  }

  try {
    return JSON.parse(
      storedChallenge,
    ) as PendingTwoFactorLogin;
  } catch {
    sessionStorage.removeItem(
      TWO_FACTOR_STORAGE_KEY,
    );

    return null;
  }
}

function getRedirectPath(
  user: UserData,
): string {
  const roleName =
    user.role?.name;

  if (roleName === "admin") {
    return "/admin";
  }

  return "/dashboard";
}

function getSafeRedirect(
  requestedPath: string | null,
  user: UserData,
): string {
  const fallback =
    getRedirectPath(user);

  if (!requestedPath) {
    return fallback;
  }

  const normalizedPath =
    requestedPath
      .split("?")[0]
      .split("#")[0];

  const blockedPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-2fa",
  ];

  if (
    blockedPaths.includes(
      normalizedPath,
    )
  ) {
    return fallback;
  }

  return requestedPath;
}

function getRemainingSeconds(
  expiresAt: string,
): number {
  const expirationTime =
    new Date(expiresAt).getTime();

  if (
    Number.isNaN(
      expirationTime,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (
        expirationTime -
        Date.now()
      ) / 1000,
    ),
  );
}

function formatTime(
  totalSeconds: number,
): string {
  const minutes =
    Math.floor(
      totalSeconds / 60,
    );

  const seconds =
    totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
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

export default function VerifyTwoFactorPage() {
  const navigate =
    useNavigate();

  const [
    pendingChallenge,
    setPendingChallenge,
  ] =
    useState<PendingTwoFactorLogin | null>(
      readPendingChallenge,
    );

  const [
    code,
    setCode,
  ] = useState("");

  const [
    isVerifying,
    setIsVerifying,
  ] = useState(false);

  const [
    isResending,
    setIsResending,
  ] = useState(false);

  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(() =>
    pendingChallenge
      ? getRemainingSeconds(
          pendingChallenge.expiresAt,
        )
      : 0,
  );

  useEffect(() => {
    if (!pendingChallenge) {
      return;
    }

    setRemainingSeconds(
      getRemainingSeconds(
        pendingChallenge.expiresAt,
      ),
    );

    const intervalId =
      window.setInterval(() => {
        setRemainingSeconds(
          getRemainingSeconds(
            pendingChallenge.expiresAt,
          ),
        );
      }, 1000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [pendingChallenge]);

  const displayedEmail =
    useMemo(() => {
      return (
        pendingChallenge
          ?.emailHint ||
        pendingChallenge
          ?.email ||
        ""
      );
    }, [pendingChallenge]);

  if (!pendingChallenge) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const isExpired =
    remainingSeconds <= 0;

  function handleCodeChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const numericValue =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 6);

    setCode(numericValue);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const currentChallenge =
      pendingChallenge;

    if (!currentChallenge) {
      return;
    }

    if (
      isVerifying ||
      isResending
    ) {
      return;
    }

    if (isExpired) {
      await showWarning(
        "El código expiró. Solicita uno nuevo.",
      );

      return;
    }

    if (code.length !== 6) {
      await showWarning(
        "Ingresa el código de 6 dígitos que enviamos a tu correo.",
      );

      return;
    }

    setIsVerifying(true);

    try {
      const response =
        await verifyTwoFactorLogin({
          challenge_token:
            currentChallenge
              .challengeToken,

          code,
        });

      const {
        token,
        user,
      } = response.data;

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
          "Código verificado correctamente.",
      );

      navigate(
        getSafeRedirect(
          currentChallenge
            .redirectTo,
          user,
        ),
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Error al verificar el código 2FA:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No fue posible verificar el código.",
        ),
      );
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend(): Promise<void> {
    const currentChallenge =
      pendingChallenge;

    if (!currentChallenge) {
      return;
    }

    if (
      isResending ||
      isVerifying
    ) {
      return;
    }

    setIsResending(true);

    try {
      const response =
        await resendTwoFactorLogin(
          currentChallenge
            .challengeToken,
        );

      const updatedChallenge:
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

        email:
          currentChallenge.email,

        emailHint:
          response.data
            .email_hint ??
          currentChallenge
            .emailHint,

        redirectTo:
          currentChallenge
            .redirectTo,
      };

      sessionStorage.setItem(
        TWO_FACTOR_STORAGE_KEY,
        JSON.stringify(
          updatedChallenge,
        ),
      );

      setPendingChallenge(
        updatedChallenge,
      );

      setCode("");

      setRemainingSeconds(
        getRemainingSeconds(
          updatedChallenge
            .expiresAt,
        ),
      );

      await showSuccess(
        response.message ||
          "Enviamos un nuevo código a tu correo.",
      );
    } catch (error) {
      console.error(
        "Error al reenviar el código 2FA:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No fue posible enviar un código nuevo.",
        ),
      );
    } finally {
      setIsResending(false);
    }
  }

  function cancelVerification(): void {
    sessionStorage.removeItem(
      TWO_FACTOR_STORAGE_KEY,
    );

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-lg rounded-[2rem] border border-border bg-surface p-6 shadow-xl sm:p-9">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheckIcon className="h-9 w-9" />
          </div>

          <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
            Verificación en dos pasos
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            Enviamos un código de seguridad de seis dígitos a tu correo electrónico.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
            <EnvelopeIcon className="h-6 w-6 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs text-text-muted">
                Código enviado a
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-text">
                {displayedEmail}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7"
          >
            <label
              htmlFor="two-factor-code"
              className="block text-sm font-semibold text-text"
            >
              Código de verificación
            </label>

            <input
              id="two-factor-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              autoFocus
              className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-4 text-center text-3xl font-bold tracking-[0.45em] text-text outline-none transition placeholder:text-text-muted/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span
                className={
                  isExpired
                    ? "font-medium text-error"
                    : "text-text-muted"
                }
              >
                {isExpired
                  ? "El código ha expirado"
                  : `Expira en ${formatTime(
                      remainingSeconds,
                    )}`}
              </span>

              <button
                type="button"
                onClick={() => {
                  void handleResend();
                }}
                disabled={
                  isResending ||
                  isVerifying
                }
                className="inline-flex items-center gap-2 font-semibold text-primary transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={[
                    "h-4 w-4",
                    isResending
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />

                {isResending
                  ? "Enviando..."
                  : "Reenviar código"}
              </button>
            </div>

            <button
              type="submit"
              disabled={
                isVerifying ||
                isResending ||
                code.length !== 6
              }
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckBadgeIcon className="h-5 w-5" />

              {isVerifying
                ? "Verificando..."
                : "Verificar código"}
            </button>
          </form>

          <button
            type="button"
            onClick={cancelVerification}
            disabled={
              isVerifying ||
              isResending
            }
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Cancelar e iniciar de nuevo
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-text-muted">
            Nunca compartas este código. WorkLink no te lo solicitará por mensajes o llamadas.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}