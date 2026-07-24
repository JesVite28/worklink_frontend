import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { useLoginModal } from "../../../context/LoginModalContext";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

import {
  showWarning,
} from "../../../shared/services/alertService";

import ProfileImagePicker from "../components/ProfileImagePicker";
import { useRegisterForm } from "../hooks/useRegisterForm";

const accountOptions = [
  {
    type: "Cliente",
    title: "Cliente",
    description:
      "Contrata freelancers y administra proyectos o servicios.",
    icon: UserGroupIcon,
  },
  {
    type: "Freelancer",
    title: "Freelancer",
    description:
      "Publica servicios, crea tu portafolio y encuentra vacantes.",
    icon: BriefcaseIcon,
  },
  {
    type: "Empresa",
    title: "Empresa",
    description:
      "Publica vacantes y conecta con profesionales.",
    icon: BuildingOffice2Icon,
  },
] as const;

const steps = [
  {
    number: 1,
    title: "Tipo de cuenta",
  },
  {
    number: 2,
    title: "Información",
  },
  {
    number: 3,
    title: "Seguridad",
  },
  {
    number: 4,
    title: "Confirmación",
  },
] as const;

type RegisterStep = 1 | 2 | 3 | 4;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim(),
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openLoginModal } = useLoginModal();

  const {
    form,
    handleChange,
    handleSubmit,
    setAccountType,

    showPassword,
    setShowPassword,

    showConfirm,
    setShowConfirm,

    profileImage,
    setProfileImage,
    setProfilePhotoFile,

    isLoading,
  } = useRegisterForm();

  const [
    currentStep,
    setCurrentStep,
  ] = useState<RegisterStep>(1);

  const initials = useMemo(() => {
    return [
      form.nombres?.trim().charAt(0),
      form.apellidoPaterno
        ?.trim()
        .charAt(0),
    ]
      .filter(Boolean)
      .join("")
      .toUpperCase();
  }, [
    form.apellidoPaterno,
    form.nombres,
  ]);

  const progressPercentage =
    (currentStep / steps.length) * 100;

  const fullName =
    [
      form.nombres,
      form.apellidoPaterno,
      form.apellidoMaterno,
    ]
      .map((value) =>
        value?.trim(),
      )
      .filter(Boolean)
      .join(" ") ||
    "Nombre pendiente";

  async function validateCurrentStep(): Promise<boolean> {
    if (currentStep === 1) {
      if (!form.accountType) {
        await showWarning(
          "Selecciona el tipo de cuenta que deseas crear.",
        );

        return false;
      }
    }

    if (currentStep === 2) {
      if (
        !form.nombres.trim() ||
        !form.apellidoPaterno.trim() ||
        !form.email.trim()
      ) {
        await showWarning(
          "Completa tu nombre, apellido paterno y correo electrónico.",
        );

        return false;
      }

      if (!isValidEmail(form.email)) {
        await showWarning(
          "Ingresa un correo electrónico válido.",
        );

        return false;
      }
    }

    if (currentStep === 3) {
      if (
        !form.password ||
        !form.confirmPassword
      ) {
        await showWarning(
          "Escribe y confirma tu contraseña.",
        );

        return false;
      }

      if (form.password.length < 8) {
        await showWarning(
          "La contraseña debe tener al menos 8 caracteres.",
        );

        return false;
      }

      if (
        form.password !==
        form.confirmPassword
      ) {
        await showWarning(
          "Las contraseñas no coinciden.",
        );

        return false;
      }
    }

    if (
      currentStep === 4 &&
      !form.terms
    ) {
      await showWarning(
        "Debes aceptar los términos y condiciones para crear tu cuenta.",
      );

      return false;
    }

    return true;
  }

  async function goToNextStep() {
    const isValid =
      await validateCurrentStep();

    if (!isValid) {
      return;
    }

    setCurrentStep(
      (previousStep) =>
        Math.min(
          previousStep + 1,
          4,
        ) as RegisterStep,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function goToPreviousStep() {
    setCurrentStep(
      (previousStep) =>
        Math.max(
          previousStep - 1,
          1,
        ) as RegisterStep,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleWizardSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    if (currentStep < 4) {
      event.preventDefault();
      await goToNextStep();

      return;
    }

    const isValid =
      await validateCurrentStep();

    if (!isValid) {
      event.preventDefault();
      return;
    }

    handleSubmit(event);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Panel lateral */}
          <aside className="h-fit rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-xl lg:sticky lg:top-28 sm:p-8">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              Registro WorkLink
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight">
              Crea tu cuenta paso a paso
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/80">
              Completa únicamente la información necesaria en cada etapa para comenzar sin saturar el formulario.
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Paso {currentStep} de {steps.length}
                </span>

                <span>
                  {Math.round(
                    progressPercentage,
                  )}
                  %
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {steps.map((step) => {
                const isActive =
                  currentStep === step.number;

                const isCompleted =
                  currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                      isActive
                        ? "bg-white/15"
                        : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                        isCompleted
                          ? "bg-white text-primary"
                          : isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white/70",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </span>

                    <span
                      className={[
                        "text-sm font-medium",
                        isActive ||
                        isCompleted
                          ? "text-white"
                          : "text-white/65",
                      ].join(" ")}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Formulario guiado */}
          <form
            onSubmit={handleWizardSubmit}
            className="min-w-0 rounded-[2rem] border border-border bg-surface p-5 shadow-xl sm:p-7 lg:p-9"
          >
            <div className="border-b border-border pb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                <SparklesIcon className="h-4 w-4" />
                Paso {currentStep} de {steps.length}
              </div>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                {currentStep === 1 &&
                  "¿Cómo utilizarás WorkLink?"}

                {currentStep === 2 &&
                  "Información personal"}

                {currentStep === 3 &&
                  "Protege tu cuenta"}

                {currentStep === 4 &&
                  "Revisa y confirma"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                {currentStep === 1 &&
                  "Selecciona el tipo de cuenta que mejor representa lo que necesitas."}

                {currentStep === 2 &&
                  "Ingresa tus datos básicos para identificar tu cuenta."}

                {currentStep === 3 &&
                  "Crea una contraseña segura para proteger tu información."}

                {currentStep === 4 &&
                  "La foto es opcional. Confirma tus datos antes de finalizar."}
              </p>
            </div>

            <div className="py-7">
              {/* Paso 1 */}
              {currentStep === 1 && (
                <section>
                  <div className="grid gap-4 md:grid-cols-3">
                    {accountOptions.map(
                      ({
                        type,
                        title,
                        description,
                        icon: Icon,
                      }) => {
                        const isSelected =
                          form.accountType ===
                          type;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setAccountType(
                                type,
                              )
                            }
                            className={[
                              "group rounded-3xl border p-5 text-left transition",
                              isSelected
                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                                : "border-border bg-background hover:-translate-y-1 hover:border-primary/40 hover:shadow-card",
                            ].join(" ")}
                          >
                            <div
                              className={[
                                "flex h-12 w-12 items-center justify-center rounded-2xl transition",
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
                              ].join(" ")}
                            >
                              <Icon className="h-6 w-6" />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold">
                              {title}
                            </h3>

                            <p
                              className={[
                                "mt-2 text-sm leading-6",
                                isSelected
                                  ? "text-white/80"
                                  : "text-text-muted",
                              ].join(" ")}
                            >
                              {description}
                            </p>

                            {isSelected && (
                              <div className="mt-5 flex items-center gap-2 text-sm font-semibold">
                                <CheckCircleIcon className="h-5 w-5" />
                                Seleccionado
                              </div>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </section>
              )}

              {/* Paso 2 */}
              {currentStep === 2 && (
                <section className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="register-nombres"
                      className="mb-2 block text-sm font-medium"
                    >
                      Nombre(s)
                    </label>

                    <input
                      id="register-nombres"
                      name="nombres"
                      value={form.nombres}
                      placeholder="Ej. Adrian"
                      autoComplete="given-name"
                      className="input rounded-2xl border"
                      onChange={handleChange}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="register-apellido-paterno"
                      className="mb-2 block text-sm font-medium"
                    >
                      Apellido paterno
                    </label>

                    <input
                      id="register-apellido-paterno"
                      name="apellidoPaterno"
                      value={
                        form.apellidoPaterno
                      }
                      placeholder="Ej. Vite"
                      autoComplete="family-name"
                      className="input rounded-2xl border"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="register-apellido-materno"
                      className="mb-2 block text-sm font-medium"
                    >
                      Apellido materno
                    </label>

                    <input
                      id="register-apellido-materno"
                      name="apellidoMaterno"
                      value={
                        form.apellidoMaterno
                      }
                      placeholder="Ej. Espinosa"
                      className="input rounded-2xl border"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="register-phone"
                      className="mb-2 block text-sm font-medium"
                    >
                      Teléfono
                      <span className="ml-1 text-xs text-text-muted">
                        (opcional)
                      </span>
                    </label>

                    <input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      placeholder="Ej. 7712345678"
                      autoComplete="tel"
                      className="input rounded-2xl border"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="register-email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Correo electrónico
                    </label>

                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      value={form.email}
                      placeholder="correo@ejemplo.com"
                      autoComplete="email"
                      className="input rounded-2xl border"
                      onChange={handleChange}
                    />
                  </div>
                </section>
              )}

              {/* Paso 3 */}
              {currentStep === 3 && (
                <section className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-medium"
                    >
                      Contraseña
                    </label>

                    <div className="relative">
                      <input
                        id="register-password"
                        name="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        placeholder="Mínimo 8 caracteres"
                        autoComplete="new-password"
                        className="input rounded-2xl border pr-12"
                        onChange={handleChange}
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-primary"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-text-muted">
                      Utiliza al menos 8 caracteres.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="mb-2 block text-sm font-medium"
                    >
                      Confirmar contraseña
                    </label>

                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={
                          showConfirm
                            ? "text"
                            : "password"
                        }
                        value={
                          form.confirmPassword
                        }
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        className="input rounded-2xl border pr-12"
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirm(
                            !showConfirm,
                          )
                        }
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-primary"
                        aria-label={
                          showConfirm
                            ? "Ocultar confirmación"
                            : "Mostrar confirmación"
                        }
                      >
                        {showConfirm ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {form.confirmPassword &&
                      form.password ===
                        form.confirmPassword && (
                        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-success">
                          <CheckCircleIcon className="h-4 w-4" />
                          Las contraseñas coinciden.
                        </p>
                      )}
                  </div>
                </section>
              )}

              {/* Paso 4 */}
              {currentStep === 4 && (
                <section className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="rounded-3xl border border-border bg-background p-5">
                    <ProfileImagePicker
                      image={profileImage}
                      initials={initials}
                      setImage={
                        setProfileImage
                      }
                      setProfilePhotoFile={
                        setProfilePhotoFile
                      }
                    />
                  </div>

                  <div className="space-y-5">
                    <div className="rounded-3xl border border-border bg-background p-5">
                      <h3 className="font-semibold">
                        Resumen de tu cuenta
                      </h3>

                      <dl className="mt-4 space-y-4 text-sm">
                        <div>
                          <dt className="text-text-muted">
                            Nombre
                          </dt>

                          <dd className="mt-1 font-medium text-text">
                            {fullName}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-text-muted">
                            Correo electrónico
                          </dt>

                          <dd className="mt-1 break-all font-medium text-text">
                            {form.email}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-text-muted">
                            Tipo de cuenta
                          </dt>

                          <dd className="mt-1 font-medium text-primary">
                            {form.accountType}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-text-muted">
                            Foto
                          </dt>

                          <dd className="mt-1 font-medium text-text">
                            {profileImage
                              ? "Imagen seleccionada"
                              : "Avatar predeterminado con iniciales"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <label className="flex items-start gap-3 rounded-3xl border border-border bg-background p-4 text-sm">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={
                          form.terms
                        }
                        onChange={
                          handleChange
                        }
                        className="mt-1 shrink-0"
                      />

                      <span className="leading-6 text-text-muted">
                        Acepto los{" "}

                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                        >
                          términos y condiciones
                        </button>{" "}

                        de WorkLink.
                      </span>
                    </label>
                  </div>
                </section>
              )}
            </div>

            {/* Navegación */}
            <footer className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={
                      goToPreviousStep
                    }
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:opacity-50 sm:w-auto"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Anterior
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/")
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary sm:w-auto"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Volver al inicio
                  </button>
                )}
              </div>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    void goToNextStep();
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 sm:w-auto"
                >
                  Continuar
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isLoading
                    ? "Creando cuenta..."
                    : "Crear cuenta"}

                  {!isLoading && (
                    <CheckCircleIcon className="h-5 w-5" />
                  )}
                </button>
              )}
            </footer>

            <p className="mt-6 text-center text-sm text-text-muted">
              ¿Ya tienes cuenta?{" "}

              <button
                type="button"
                onClick={() =>
                  openLoginModal(location.pathname)
                }
                className="font-semibold text-primary hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}