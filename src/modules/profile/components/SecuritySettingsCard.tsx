import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { isAxiosError } from "axios";

import {
  changePasswordWithEmailVerification,
  disableTwoFactor,
  getTwoFactorStatus,
  requestPasswordChangeCode,
  requestTwoFactorEnable,
  verifyTwoFactorEnable,
  type TwoFactorChallengeData,
} from "../../auth/services/authService";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

interface ChallengeState {
  token: string;
  emailHint: string;
  remainingSeconds: number;
}

interface ModalShellProps {
  isOpen: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  isBusy?: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  showPassword: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: "current-password" | "new-password";
  placeholder?: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

const emptyChallenge: ChallengeState = {
  token: "",
  emailHint: "",
  remainingSeconds: 0,
};

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const errors = error.response?.data?.errors;

  const firstError = errors
    ? Object.values(errors)[0]?.[0]
    : null;

  return (
    firstError ||
    error.response?.data?.message ||
    fallback
  );
}

function createChallengeState(
  data: TwoFactorChallengeData,
): ChallengeState {
  return {
    token: data.challenge_token,
    emailHint:
      data.email_hint ||
      "tu correo registrado",
    remainingSeconds:
      data.expires_in || 600,
  };
}

function formatRemainingTime(
  seconds: number,
): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

function ModalShell({
  isOpen,
  title,
  description,
  icon,
  isBusy = false,
  onClose,
  children,
}: ModalShellProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${title}-modal-title`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isBusy
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border bg-surface shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {icon}
            </div>

            <div>
              <h2
                id={`${title}-modal-title`}
                className="text-xl font-bold text-text"
              >
                {title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Cerrar modal"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  showPassword,
  disabled = false,
  autoFocus = false,
  autoComplete = "current-password",
  placeholder,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-text"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-12 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
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
  );
}

export default function SecuritySettingsCard() {
  const [
    twoFactorEnabled,
    setTwoFactorEnabled,
  ] = useState(false);

  const [
    twoFactorEnabledAt,
    setTwoFactorEnabledAt,
  ] = useState<string | null>(null);

  const [
    isLoadingStatus,
    setIsLoadingStatus,
  ] = useState(true);

  const [
    isTwoFactorModalOpen,
    setIsTwoFactorModalOpen,
  ] = useState(false);

  const [
    isPasswordModalOpen,
    setIsPasswordModalOpen,
  ] = useState(false);

  const [
    twoFactorPassword,
    setTwoFactorPassword,
  ] = useState("");

  const [
    showTwoFactorPassword,
    setShowTwoFactorPassword,
  ] = useState(false);

  const [
    twoFactorCode,
    setTwoFactorCode,
  ] = useState("");

  const [
    twoFactorChallenge,
    setTwoFactorChallenge,
  ] = useState<ChallengeState>(
    emptyChallenge,
  );

  const [
    isRequestingTwoFactor,
    setIsRequestingTwoFactor,
  ] = useState(false);

  const [
    isVerifyingTwoFactor,
    setIsVerifyingTwoFactor,
  ] = useState(false);

  const [
    isDisablingTwoFactor,
    setIsDisablingTwoFactor,
  ] = useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    newPasswordConfirmation,
    setNewPasswordConfirmation,
  ] = useState("");

  const [
    passwordCode,
    setPasswordCode,
  ] = useState("");

  const [
    passwordChallenge,
    setPasswordChallenge,
  ] = useState<ChallengeState>(
    emptyChallenge,
  );

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmation,
    setShowConfirmation,
  ] = useState(false);

  const [
    isRequestingPasswordCode,
    setIsRequestingPasswordCode,
  ] = useState(false);

  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false);

  const hasTwoFactorChallenge = Boolean(
    twoFactorChallenge.token,
  );

  const hasPasswordChallenge = Boolean(
    passwordChallenge.token,
  );

  const isTwoFactorBusy =
    isRequestingTwoFactor ||
    isVerifyingTwoFactor ||
    isDisablingTwoFactor;

  const isPasswordBusy =
    isRequestingPasswordCode ||
    isChangingPassword;

  const isAnyModalOpen =
    isTwoFactorModalOpen ||
    isPasswordModalOpen;

  const passwordRequirements = useMemo(
    () => ({
      minimumLength:
        newPassword.length >= 8,

      uppercase:
        /[A-Z]/.test(newPassword),

      lowercase:
        /[a-z]/.test(newPassword),

      number:
        /\d/.test(newPassword),

      matches:
        newPassword !== "" &&
        newPassword ===
          newPasswordConfirmation,
    }),
    [
      newPassword,
      newPasswordConfirmation,
    ],
  );

  useEffect(() => {
    async function loadStatus() {
      setIsLoadingStatus(true);

      try {
        const status =
          await getTwoFactorStatus();

        setTwoFactorEnabled(
          status.enabled,
        );

        setTwoFactorEnabledAt(
          status.enabled_at,
        );
      } catch (error) {
        console.error(
          "Error al consultar 2FA:",
          error,
        );

        await showError(
          getErrorMessage(
            error,
            "No se pudo consultar el estado de seguridad.",
          ),
        );
      } finally {
        setIsLoadingStatus(false);
      }
    }

    void loadStatus();
  }, []);

  useEffect(() => {
    if (!isAnyModalOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      if (
        isTwoFactorModalOpen &&
        !isTwoFactorBusy
      ) {
        closeTwoFactorModal();
      }

      if (
        isPasswordModalOpen &&
        !isPasswordBusy
      ) {
        closePasswordModal();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    isAnyModalOpen,
    isTwoFactorModalOpen,
    isPasswordModalOpen,
    isTwoFactorBusy,
    isPasswordBusy,
  ]);

  useEffect(() => {
    if (
      !isTwoFactorModalOpen ||
      !hasTwoFactorChallenge ||
      twoFactorChallenge
        .remainingSeconds <= 0
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setTwoFactorChallenge(
          (previous) => ({
            ...previous,
            remainingSeconds:
              Math.max(
                0,
                previous.remainingSeconds -
                  1,
              ),
          }),
        );
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isTwoFactorModalOpen,
    hasTwoFactorChallenge,
    twoFactorChallenge
      .remainingSeconds,
  ]);

  useEffect(() => {
    if (
      !isPasswordModalOpen ||
      !hasPasswordChallenge ||
      passwordChallenge
        .remainingSeconds <= 0
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setPasswordChallenge(
          (previous) => ({
            ...previous,
            remainingSeconds:
              Math.max(
                0,
                previous.remainingSeconds -
                  1,
              ),
          }),
        );
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isPasswordModalOpen,
    hasPasswordChallenge,
    passwordChallenge
      .remainingSeconds,
  ]);

  function resetTwoFactorModal(): void {
    setTwoFactorPassword("");
    setTwoFactorCode("");

    setTwoFactorChallenge(
      emptyChallenge,
    );

    setShowTwoFactorPassword(false);
  }

  function openTwoFactorModal(): void {
    resetTwoFactorModal();
    setIsTwoFactorModalOpen(true);
  }

  function closeTwoFactorModal(): void {
    if (isTwoFactorBusy) {
      return;
    }

    setIsTwoFactorModalOpen(false);
    resetTwoFactorModal();
  }

  function resetPasswordModal(): void {
    setCurrentPassword("");
    setNewPassword("");

    setNewPasswordConfirmation("");
    setPasswordCode("");

    setPasswordChallenge(
      emptyChallenge,
    );

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmation(false);
  }

  function openPasswordModal(): void {
    resetPasswordModal();
    setIsPasswordModalOpen(true);
  }

  function closePasswordModal(): void {
    if (isPasswordBusy) {
      return;
    }

    setIsPasswordModalOpen(false);
    resetPasswordModal();
  }

  async function handleRequestTwoFactor(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isRequestingTwoFactor) {
      return;
    }

    if (!twoFactorPassword.trim()) {
      await showWarning(
        "Escribe tu contraseña actual.",
      );

      return;
    }

    setIsRequestingTwoFactor(true);

    try {
      const response =
        await requestTwoFactorEnable(
          twoFactorPassword,
        );

      setTwoFactorChallenge(
        createChallengeState(
          response.data,
        ),
      );

      setTwoFactorCode("");

      await showSuccess(
        response.message ||
          "El código fue enviado a tu correo.",
      );
    } catch (error) {
      console.error(
        "Error al solicitar activación 2FA:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No se pudo enviar el código de verificación.",
        ),
      );
    } finally {
      setIsRequestingTwoFactor(false);
    }
  }

  async function handleVerifyTwoFactor(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isVerifyingTwoFactor) {
      return;
    }

    if (
      twoFactorChallenge
        .remainingSeconds <= 0
    ) {
      await showWarning(
        "El código expiró. Solicita uno nuevo.",
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        twoFactorCode,
      )
    ) {
      await showWarning(
        "Escribe el código de seis dígitos.",
      );

      return;
    }

    setIsVerifyingTwoFactor(true);

    try {
      const response =
        await verifyTwoFactorEnable({
          challenge_token:
            twoFactorChallenge.token,

          code: twoFactorCode,
        });

      setTwoFactorEnabled(
        response.data.enabled,
      );

      setTwoFactorEnabledAt(
        response.data.enabled_at,
      );

      await showSuccess(
        response.message ||
          "La verificación en dos pasos fue activada.",
      );

      setIsTwoFactorModalOpen(false);
      resetTwoFactorModal();
    } catch (error) {
      console.error(
        "Error al confirmar activación 2FA:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No se pudo verificar el código.",
        ),
      );
    } finally {
      setIsVerifyingTwoFactor(false);
    }
  }

  async function handleDisableTwoFactor(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isDisablingTwoFactor) {
      return;
    }

    if (!twoFactorPassword.trim()) {
      await showWarning(
        "Escribe tu contraseña actual.",
      );

      return;
    }

    setIsDisablingTwoFactor(true);

    try {
      const response =
        await disableTwoFactor(
          twoFactorPassword,
        );

      setTwoFactorEnabled(
        response.data.enabled,
      );

      setTwoFactorEnabledAt(
        response.data.enabled_at,
      );

      await showSuccess(
        response.message ||
          "La verificación en dos pasos fue desactivada.",
      );

      setIsTwoFactorModalOpen(false);
      resetTwoFactorModal();
    } catch (error) {
      console.error(
        "Error al desactivar 2FA:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No se pudo desactivar la verificación en dos pasos.",
        ),
      );
    } finally {
      setIsDisablingTwoFactor(false);
    }
  }

  async function handleRequestPasswordCode(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isRequestingPasswordCode) {
      return;
    }

    if (!currentPassword.trim()) {
      await showWarning(
        "Escribe tu contraseña actual.",
      );

      return;
    }

    setIsRequestingPasswordCode(true);

    try {
      const response =
        await requestPasswordChangeCode(
          currentPassword,
        );

      setPasswordChallenge(
        createChallengeState(
          response.data,
        ),
      );

      setPasswordCode("");

      await showSuccess(
        response.message ||
          "El código fue enviado a tu correo.",
      );
    } catch (error) {
      console.error(
        "Error al solicitar código para contraseña:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No se pudo enviar el código de verificación.",
        ),
      );
    } finally {
      setIsRequestingPasswordCode(false);
    }
  }

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (isChangingPassword) {
      return;
    }

    if (
      passwordChallenge
        .remainingSeconds <= 0
    ) {
      await showWarning(
        "El código expiró. Solicita uno nuevo.",
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        passwordCode,
      )
    ) {
      await showWarning(
        "Escribe el código de seis dígitos.",
      );

      return;
    }

    if (newPassword.length < 8) {
      await showWarning(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );

      return;
    }

    if (
      !passwordRequirements.uppercase ||
      !passwordRequirements.lowercase ||
      !passwordRequirements.number
    ) {
      await showWarning(
        "La nueva contraseña debe incluir mayúscula, minúscula y número.",
      );

      return;
    }

    if (
      newPassword !==
      newPasswordConfirmation
    ) {
      await showWarning(
        "Las contraseñas nuevas no coinciden.",
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      await showWarning(
        "La nueva contraseña debe ser diferente a la actual.",
      );

      return;
    }

    setIsChangingPassword(true);

    try {
      const response =
        await changePasswordWithEmailVerification(
          {
            challenge_token:
              passwordChallenge.token,

            code: passwordCode,

            current_password:
              currentPassword,

            password:
              newPassword,

            password_confirmation:
              newPasswordConfirmation,
          },
        );

      await showSuccess(
        response.message ||
          "Tu contraseña fue actualizada.",
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem(
        "worklink_pending_2fa",
      );

      window.dispatchEvent(
        new Event(
          "auth:session-updated",
        ),
      );

      window.location.replace("/");
    } catch (error) {
      console.error(
        "Error al cambiar contraseña:",
        error,
      );

      await showError(
        getErrorMessage(
          error,
          "No se pudo cambiar la contraseña.",
        ),
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <>
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-text">
            Seguridad de la cuenta
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            Administra las opciones de acceso y protección de tu cuenta.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  twoFactorEnabled
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {twoFactorEnabled ? (
                  <ShieldCheckIcon className="h-7 w-7" />
                ) : (
                  <ShieldExclamationIcon className="h-7 w-7" />
                )}
              </div>

              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  twoFactorEnabled
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {isLoadingStatus ? (
                  "Consultando..."
                ) : twoFactorEnabled ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Activada
                  </>
                ) : (
                  <>
                    <ShieldExclamationIcon className="h-4 w-4" />
                    Desactivada
                  </>
                )}
              </div>
            </div>

            <h3 className="mt-5 font-semibold text-text">
              Verificación en dos pasos
            </h3>

            <p className="mt-2 flex-1 text-sm leading-6 text-text-muted">
              Solicita un código enviado a tu correo cada vez que inicies sesión.
            </p>

            {twoFactorEnabledAt && (
              <p className="mt-3 text-xs text-text-muted">
                Activada el{" "}
                {new Date(
                  twoFactorEnabledAt,
                ).toLocaleString(
                  "es-MX",
                )}
              </p>
            )}

            <button
              type="button"
              onClick={
                openTwoFactorModal
              }
              disabled={isLoadingStatus}
              className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                twoFactorEnabled
                  ? "border border-danger text-danger hover:bg-danger hover:text-white"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {twoFactorEnabled ? (
                <ShieldExclamationIcon className="h-5 w-5" />
              ) : (
                <ShieldCheckIcon className="h-5 w-5" />
              )}

              {twoFactorEnabled
                ? "Desactivar 2FA"
                : "Activar 2FA"}
            </button>
          </article>

          <article className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <KeyIcon className="h-7 w-7" />
            </div>

            <h3 className="mt-5 font-semibold text-text">
              Contraseña
            </h3>

            <p className="mt-2 flex-1 text-sm leading-6 text-text-muted">
              Cambia tu contraseña mediante un código de verificación enviado a tu correo.
            </p>

            <button
              type="button"
              onClick={
                openPasswordModal
              }
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <KeyIcon className="h-5 w-5" />
              Cambiar contraseña
            </button>
          </article>
        </div>
      </section>

      <ModalShell
        isOpen={
          isTwoFactorModalOpen
        }
        title={
          twoFactorEnabled
            ? "Desactivar verificación en dos pasos"
            : "Activar verificación en dos pasos"
        }
        description={
          twoFactorEnabled
            ? "Confirma tu contraseña para retirar esta protección de tu cuenta."
            : "Confirma tu contraseña y el código que enviaremos a tu correo."
        }
        icon={
          twoFactorEnabled ? (
            <ShieldExclamationIcon className="h-7 w-7" />
          ) : (
            <ShieldCheckIcon className="h-7 w-7" />
          )
        }
        isBusy={
          isTwoFactorBusy
        }
        onClose={
          closeTwoFactorModal
        }
      >
        {twoFactorEnabled ? (
          <form
            onSubmit={
              handleDisableTwoFactor
            }
            className="space-y-5"
          >
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-text">
              Al desactivar esta función, tu cuenta dejará de solicitar un código durante el inicio de sesión.
            </div>

            <PasswordField
              id="disable-two-factor-password"
              label="Contraseña actual"
              value={
                twoFactorPassword
              }
              showPassword={
                showTwoFactorPassword
              }
              disabled={
                isDisablingTwoFactor
              }
              autoFocus
              placeholder="Escribe tu contraseña"
              onChange={
                setTwoFactorPassword
              }
              onToggleVisibility={() => {
                setShowTwoFactorPassword(
                  (previous) =>
                    !previous,
                );
              }}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeTwoFactorModal
                }
                disabled={
                  isDisablingTwoFactor
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isDisablingTwoFactor
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldExclamationIcon className="h-5 w-5" />

                {isDisablingTwoFactor
                  ? "Desactivando..."
                  : "Confirmar desactivación"}
              </button>
            </div>
          </form>
        ) : !hasTwoFactorChallenge ? (
          <form
            onSubmit={
              handleRequestTwoFactor
            }
            className="space-y-5"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-text-muted">
              Enviaremos un código de seis dígitos al correo asociado con tu cuenta.
            </div>

            <PasswordField
              id="enable-two-factor-password"
              label="Contraseña actual"
              value={
                twoFactorPassword
              }
              showPassword={
                showTwoFactorPassword
              }
              disabled={
                isRequestingTwoFactor
              }
              autoFocus
              placeholder="Escribe tu contraseña"
              onChange={
                setTwoFactorPassword
              }
              onToggleVisibility={() => {
                setShowTwoFactorPassword(
                  (previous) =>
                    !previous,
                );
              }}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeTwoFactorModal
                }
                disabled={
                  isRequestingTwoFactor
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isRequestingTwoFactor
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheckIcon className="h-5 w-5" />

                {isRequestingTwoFactor
                  ? "Enviando código..."
                  : "Enviar código"}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={
              handleVerifyTwoFactor
            }
            className="space-y-5"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-text">
                Código enviado a{" "}
                {
                  twoFactorChallenge.emailHint
                }
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {twoFactorChallenge
                  .remainingSeconds > 0
                  ? `Expira en ${formatRemainingTime(
                      twoFactorChallenge
                        .remainingSeconds,
                    )}`
                  : "El código ha expirado."}
              </p>
            </div>

            <div>
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
                maxLength={6}
                value={twoFactorCode}
                autoFocus
                onChange={(event) => {
                  setTwoFactorCode(
                    event.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  );
                }}
                placeholder="000000"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-xl font-bold tracking-[0.4em] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {twoFactorChallenge
              .remainingSeconds <= 0 && (
              <button
                type="button"
                onClick={() => {
                  setTwoFactorChallenge(
                    emptyChallenge,
                  );

                  setTwoFactorCode("");
                }}
                className="w-full rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Solicitar otro código
              </button>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeTwoFactorModal
                }
                disabled={
                  isVerifyingTwoFactor
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isVerifyingTwoFactor ||
                  twoFactorChallenge
                    .remainingSeconds <= 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircleIcon className="h-5 w-5" />

                {isVerifyingTwoFactor
                  ? "Verificando..."
                  : "Confirmar activación"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>

      <ModalShell
        isOpen={
          isPasswordModalOpen
        }
        title="Cambiar contraseña"
        description="Verifica tu identidad mediante un código enviado a tu correo."
        icon={
          <KeyIcon className="h-7 w-7" />
        }
        isBusy={
          isPasswordBusy
        }
        onClose={
          closePasswordModal
        }
      >
        {!hasPasswordChallenge ? (
          <form
            onSubmit={
              handleRequestPasswordCode
            }
            className="space-y-5"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-text-muted">
              Primero confirma tu contraseña actual. Después enviaremos un código de seis dígitos a tu correo.
            </div>

            <PasswordField
              id="password-change-current"
              label="Contraseña actual"
              value={
                currentPassword
              }
              showPassword={
                showCurrentPassword
              }
              disabled={
                isRequestingPasswordCode
              }
              autoFocus
              placeholder="Escribe tu contraseña actual"
              onChange={
                setCurrentPassword
              }
              onToggleVisibility={() => {
                setShowCurrentPassword(
                  (previous) =>
                    !previous,
                );
              }}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={
                  isRequestingPasswordCode
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isRequestingPasswordCode
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockClosedIcon className="h-5 w-5" />

                {isRequestingPasswordCode
                  ? "Enviando código..."
                  : "Enviar código"}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={
              handleChangePassword
            }
            className="space-y-5"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-text">
                Código enviado a{" "}
                {
                  passwordChallenge.emailHint
                }
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {passwordChallenge
                  .remainingSeconds > 0
                  ? `Expira en ${formatRemainingTime(
                      passwordChallenge
                        .remainingSeconds,
                    )}`
                  : "El código ha expirado."}
              </p>
            </div>

            <div>
              <label
                htmlFor="password-change-code"
                className="block text-sm font-semibold text-text"
              >
                Código de verificación
              </label>

              <input
                id="password-change-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={passwordCode}
                autoFocus
                onChange={(event) => {
                  setPasswordCode(
                    event.target.value.replace(
                      /\D/g,
                      "",
                    ),
                  );
                }}
                placeholder="000000"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-xl font-bold tracking-[0.4em] text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <PasswordField
              id="password-change-new"
              label="Nueva contraseña"
              value={newPassword}
              showPassword={
                showNewPassword
              }
              disabled={
                isChangingPassword
              }
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              onChange={setNewPassword}
              onToggleVisibility={() => {
                setShowNewPassword(
                  (previous) =>
                    !previous,
                );
              }}
            />

            <PasswordField
              id="password-change-confirmation"
              label="Confirmar nueva contraseña"
              value={
                newPasswordConfirmation
              }
              showPassword={
                showConfirmation
              }
              disabled={
                isChangingPassword
              }
              autoComplete="new-password"
              placeholder="Repite la nueva contraseña"
              onChange={
                setNewPasswordConfirmation
              }
              onToggleVisibility={() => {
                setShowConfirmation(
                  (previous) =>
                    !previous,
                );
              }}
            />

            <div className="grid gap-2 rounded-xl border border-border bg-background p-4 text-xs">
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
                  passwordRequirements.uppercase
                    ? "text-success"
                    : "text-text-muted"
                }
              >
                Una letra mayúscula
              </p>

              <p
                className={
                  passwordRequirements.lowercase
                    ? "text-success"
                    : "text-text-muted"
                }
              >
                Una letra minúscula
              </p>

              <p
                className={
                  passwordRequirements.number
                    ? "text-success"
                    : "text-text-muted"
                }
              >
                Un número
              </p>

              <p
                className={
                  passwordRequirements.matches
                    ? "text-success"
                    : "text-text-muted"
                }
              >
                Las contraseñas coinciden
              </p>
            </div>

            {passwordChallenge
              .remainingSeconds <= 0 && (
              <button
                type="button"
                onClick={() => {
                  setPasswordChallenge(
                    emptyChallenge,
                  );

                  setPasswordCode("");
                  setNewPassword("");

                  setNewPasswordConfirmation(
                    "",
                  );
                }}
                className="w-full rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Solicitar otro código
              </button>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={
                  isChangingPassword
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  isChangingPassword ||
                  passwordChallenge
                    .remainingSeconds <= 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <KeyIcon className="h-5 w-5" />

                {isChangingPassword
                  ? "Actualizando..."
                  : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        )}
      </ModalShell>
    </>
  );
}