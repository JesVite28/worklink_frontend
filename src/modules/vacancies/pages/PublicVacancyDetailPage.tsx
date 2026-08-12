import axios from "axios";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeftIcon,
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import {
  useLoginModal,
} from "../../../context/LoginModalContext";

import {
  useAuth,
} from "../../../context/useAuth";

import {
  createApplication,
  getMyApplications,
} from "../../applications/services/applicationService";

import {
  getPublicVacancyById,
} from "../services/vacancyService";

import type {
  Vacancy,
  VacancyErrorResponse,
} from "../models/vacancy";

import type {
  ApplicationErrorResponse,
} from "../../applications/models/application";

const DEFAULT_COMPANY_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab";

function formatSalary(
  salary: string | null,
): string {
  if (!salary) {
    return "Salario a convenir";
  }

  const numericSalary =
    Number(salary);

  if (
    !Number.isFinite(
      numericSalary,
    )
  ) {
    return salary;
  }

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    },
  ).format(numericSalary);
}

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function getErrorMessage(
  error: unknown,
): string {
  if (!axios.isAxiosError(error)) {
    return "Ocurrió un error inesperado.";
  }

  const responseData =
    error.response?.data as
      | ApplicationErrorResponse
      | VacancyErrorResponse
      | undefined;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData?.errors) {
    const firstError =
      Object.values(
        responseData.errors,
      )[0]?.[0];

    if (firstError) {
      return firstError;
    }
  }

  return "No se pudo completar la operación.";
}

export default function PublicVacancyDetailPage() {
  const {
    vacancyId,
  } = useParams<{
    vacancyId: string;
  }>();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    openLoginModal,
  } = useLoginModal();

  const {
    user,
    isAuthenticated,
    isFreelancer,
    primaryRole,
  } = useAuth();

  const [
    vacancy,
    setVacancy,
  ] =
    useState<Vacancy | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    checkingApplication,
    setCheckingApplication,
  ] = useState(false);

  const [
    hasApplied,
    setHasApplied,
  ] = useState(false);

  const [
    showApplicationForm,
    setShowApplicationForm,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    applicationError,
    setApplicationError,
  ] = useState("");

  const [
    applicationSuccess,
    setApplicationSuccess,
  ] = useState("");

  const numericVacancyId =
    Number(vacancyId);

  /*
  |--------------------------------------------------------------------------
  | Cargar detalle
  |--------------------------------------------------------------------------
  */

  const loadVacancy =
    useCallback(
      async (): Promise<void> => {
        if (
          !Number.isInteger(
            numericVacancyId,
          ) ||
          numericVacancyId <= 0
        ) {
          setError(
            "La vacante solicitada no es válida.",
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);

          setError("");

          const vacancyData =
            await getPublicVacancyById(
              numericVacancyId,
            );

          setVacancy(
            vacancyData,
          );
        } catch (requestError) {
          console.error(
            "Error al cargar la vacante:",
            requestError,
          );

          setError(
            getErrorMessage(
              requestError,
            ),
          );
        } finally {
          setLoading(false);
        }
      },
      [
        numericVacancyId,
      ],
    );

  useEffect(() => {
    void loadVacancy();
  }, [
    loadVacancy,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Revisar postulación existente
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function checkExistingApplication() {
      if (
        !isAuthenticated ||
        !isFreelancer ||
        !Number.isInteger(
          numericVacancyId,
        )
      ) {
        setHasApplied(false);

        return;
      }

      try {
        setCheckingApplication(
          true,
        );

        const response =
          await getMyApplications({
            vacancy_id:
              numericVacancyId,

            page: 1,
            per_page: 1,
          });

        setHasApplied(
          response.data
            .applications.length >
            0,
        );
      } catch (requestError) {
        console.error(
          "Error al verificar la postulación:",
          requestError,
        );
      } finally {
        setCheckingApplication(
          false,
        );
      }
    }

    void checkExistingApplication();
  }, [
    isAuthenticated,
    isFreelancer,
    numericVacancyId,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Acción de postulación
  |--------------------------------------------------------------------------
  */

  function handleApplicationClick() {
    setApplicationError("");

    setApplicationSuccess("");

    if (!isAuthenticated) {
      openLoginModal(
        location.pathname,
      );

      return;
    }

    if (!isFreelancer) {
      setApplicationError(
        "Solo las cuentas freelancer pueden postularse a una vacante.",
      );

      return;
    }

    if (
      !vacancy?.accepts_applications
    ) {
      setApplicationError(
        "Esta vacante ya no está recibiendo postulaciones.",
      );

      return;
    }

    if (hasApplied) {
      setApplicationError(
        "Ya te postulaste a esta vacante.",
      );

      return;
    }

    setShowApplicationForm(
      true,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Enviar postulación
  |--------------------------------------------------------------------------
  */

  async function handleSubmitApplication(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !vacancy ||
      submitting ||
      hasApplied
    ) {
      return;
    }

    try {
      setSubmitting(true);

      setApplicationError("");

      setApplicationSuccess("");

      const normalizedMessage =
        message.trim();

      await createApplication({
        vacancy_id:
          vacancy.id,

        message:
          normalizedMessage ||
          null,
      });

      setHasApplied(true);

      setMessage("");

      setShowApplicationForm(
        false,
      );

      setApplicationSuccess(
        "Tu postulación fue enviada correctamente.",
      );
    } catch (requestError) {
      console.error(
        "Error al enviar la postulación:",
        requestError,
      );

      if (
        axios.isAxiosError(
          requestError,
        ) &&
        requestError.response
          ?.status === 409
      ) {
        setHasApplied(true);

        setApplicationError(
          "Ya te postulaste a esta vacante.",
        );

        return;
      }

      setApplicationError(
        getErrorMessage(
          requestError,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Estados de carga
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <div className="h-5 w-32 rounded bg-border" />

            <div className="mt-8 flex gap-5">
              <div className="h-20 w-20 rounded-2xl bg-border" />

              <div className="flex-1">
                <div className="h-7 w-2/3 rounded bg-border" />

                <div className="mt-4 h-4 w-40 rounded bg-border" />
              </div>
            </div>

            <div className="mt-8 h-4 w-full rounded bg-border" />

            <div className="mt-3 h-4 w-5/6 rounded bg-border" />

            <div className="mt-3 h-4 w-3/4 rounded bg-border" />
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !vacancy
  ) {
    return (
      <main className="min-h-screen bg-background py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <section className="rounded-3xl border border-danger/20 bg-surface px-6 py-14 text-center shadow-card">
            <ExclamationTriangleIcon className="mx-auto h-14 w-14 text-danger" />

            <h1 className="mt-5 text-2xl font-bold text-text">
              No pudimos mostrar la
              vacante
            </h1>

            <p className="mt-3 text-sm text-text-muted">
              {error ||
                "La vacante no está disponible."}
            </p>

            <Link
              to="/vacantes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowLeftIcon className="h-5 w-5" />

              Volver a vacantes
            </Link>
          </section>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Datos de empresa
  |--------------------------------------------------------------------------
  */

  const companyName =
    vacancy.company_profile
      ?.company_name ||
    "Empresa de WorkLink";

  const companyImage =
    vacancy.company_profile
      ?.user
      ?.profile_photo_url ||
    vacancy.company_profile
      ?.user
      ?.profile_photo ||
    DEFAULT_COMPANY_IMAGE;

  const companyIndustry =
    vacancy.company_profile
      ?.industry ||
    "Sector no especificado";

  /*
   * El perfil empresarial ya contiene
   * el ID del usuario propietario.
   */
  const companyUserId =
    vacancy.company_profile
      ?.user_id ?? null;

  /*
   * Impide que la empresa pueda
   * enviarse mensajes a sí misma.
   */
  const isOwnCompany =
    companyUserId !== null &&
    user?.id === companyUserId;

  /*
  |--------------------------------------------------------------------------
  | Contactar empresa
  |--------------------------------------------------------------------------
  */

  function handleContactCompany(): void {
    if (!companyUserId) {
      return;
    }

    const messagesPath =
      `/dashboard/mensajes?user=${companyUserId}`;

    /*
     * Si el visitante todavía no inició
     * sesión, mostramos el login y
     * conservamos la ruta al chat.
     */
    if (!isAuthenticated) {
      openLoginModal(
        messagesPath,
      );

      return;
    }

    /*
     * No se permite iniciar conversación
     * con la propia cuenta.
     */
    if (isOwnCompany) {
      return;
    }

    navigate(
      messagesPath,
    );
  }

  const isApplicationDisabled =
    checkingApplication ||
    submitting ||
    hasApplied ||
    !vacancy.accepts_applications;

  return (
    <main className="min-h-screen bg-background py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Regresar */}
        <Link
          to="/vacantes"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition hover:text-primary"
        >
          <ArrowLeftIcon className="h-5 w-5" />

          Volver a vacantes
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ================================================= */}
          {/* INFORMACIÓN PRINCIPAL */}
          {/* ================================================= */}

          <section className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-7 lg:p-8">
            {/* Encabezado */}
            <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start">
              <img
                src={
                  companyImage
                }
                alt={`Empresa ${companyName}`}
                className="h-20 w-20 shrink-0 rounded-2xl border border-border bg-background object-cover"
                onError={(
                  event,
                ) => {
                  event.currentTarget.onerror =
                    null;

                  event.currentTarget.src =
                    DEFAULT_COMPANY_IMAGE;
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-text sm:text-3xl">
                      {
                        vacancy.title
                      }
                    </h1>

                    <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                      <BuildingOffice2Icon className="h-5 w-5 shrink-0" />

                      <span>
                        {
                          companyName
                        }
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-success/10 px-4 py-2 text-xs font-semibold text-success">
                    Vacante abierta
                  </span>
                </div>
              </div>
            </header>

            {/* Información */}
            <div className="grid gap-4 border-b border-border py-7 sm:grid-cols-2">
              {/* Categoría */}
              <div className="flex items-start gap-3 rounded-2xl bg-background p-4">
                <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs text-text-muted">
                    Categoría
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {
                      vacancy.category
                    }
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-start gap-3 rounded-2xl bg-background p-4">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs text-text-muted">
                    Ubicación
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {
                      vacancy.location
                    }
                  </p>
                </div>
              </div>

              {/* Salario */}
              <div className="flex items-start gap-3 rounded-2xl bg-background p-4">
                <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs text-text-muted">
                    Salario
                  </p>

                  <p className="mt-1 font-semibold text-primary">
                    {formatSalary(
                      vacancy.salary,
                    )}
                  </p>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-start gap-3 rounded-2xl bg-background p-4">
                <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs text-text-muted">
                    Publicada
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {formatDate(
                      vacancy.created_at,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <section className="py-7">
              <h2 className="text-xl font-semibold text-text">
                Descripción de la
                vacante
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base">
                {
                  vacancy.description
                }
              </p>
            </section>
          </section>

          {/* ================================================= */}
          {/* PANEL LATERAL */}
          {/* ================================================= */}

          <aside className="space-y-5">
            {/* Postulación */}
            <section className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6">
              <h2 className="text-lg font-semibold text-text">
                Postularme
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Envía tu postulación
                y permite que la
                empresa revise tu
                perfil profesional.
              </p>

              {/* Éxito */}
              {applicationSuccess && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-success/20 bg-success/10 p-4 text-sm text-success">
                  <CheckCircleIcon className="h-5 w-5 shrink-0" />

                  <span>
                    {
                      applicationSuccess
                    }
                  </span>
                </div>
              )}

              {/* Error */}
              {applicationError && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
                  <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />

                  <span>
                    {
                      applicationError
                    }
                  </span>
                </div>
              )}

              {/* Ya se postuló */}
              {hasApplied ? (
                <div className="mt-5 rounded-xl border border-success/20 bg-success/10 p-4 text-center">
                  <CheckCircleIcon className="mx-auto h-8 w-8 text-success" />

                  <p className="mt-2 font-semibold text-success">
                    Ya te postulaste
                  </p>

                  <Link
                    to="/dashboard/postulaciones"
                    className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
                  >
                    Ver mis
                    postulaciones
                  </Link>
                </div>
              ) : showApplicationForm ? (
                /*
                 * Formulario de postulación.
                 */
                <form
                  onSubmit={
                    handleSubmitApplication
                  }
                  className="mt-5"
                >
                  <label
                    htmlFor="application-message"
                    className="text-sm font-semibold text-text"
                  >
                    Mensaje para la
                    empresa
                  </label>

                  <textarea
                    id="application-message"
                    value={
                      message
                    }
                    onChange={(
                      event,
                    ) => {
                      setMessage(
                        event.target
                          .value,
                      );
                    }}
                    maxLength={
                      1000
                    }
                    rows={
                      6
                    }
                    placeholder="Describe brevemente por qué eres una buena opción para esta vacante..."
                    className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />

                  <div className="mt-2 text-right text-xs text-text-muted">
                    {
                      message.length
                    }
                    /1000
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={
                        submitting
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />

                      {submitting
                        ? "Enviando..."
                        : "Enviar postulación"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationForm(
                          false,
                        );

                        setApplicationError(
                          "",
                        );
                      }}
                      disabled={
                        submitting
                      }
                      className="w-full rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                /*
                 * Botón para iniciar
                 * la postulación.
                 */
                <button
                  type="button"
                  onClick={
                    handleApplicationClick
                  }
                  disabled={
                    isApplicationDisabled
                  }
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />

                  {checkingApplication
                    ? "Verificando..."
                    : vacancy.accepts_applications
                      ? "Postularme"
                      : "Postulaciones cerradas"}
                </button>
              )}

              {isAuthenticated &&
                !isFreelancer &&
                !applicationError && (
                  <p className="mt-4 text-center text-xs text-text-muted">
                    La postulación está
                    disponible
                    únicamente para
                    cuentas freelancer.
                  </p>
                )}

              {!isAuthenticated && (
                <p className="mt-4 text-center text-xs text-text-muted">
                  Debes iniciar sesión
                  como freelancer para
                  postularte.
                </p>
              )}
            </section>

            {/* ================================================= */}
            {/* CONTACTAR EMPRESA */}
            {/* ================================================= */}

            {companyUserId !== null &&
              !isOwnCompany && (
                <section className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ChatBubbleLeftRightIcon className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-text">
                        Contactar
                        empresa
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        Mensaje directo
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-text-muted">
                    Comunícate
                    directamente con la
                    empresa para
                    resolver dudas sobre
                    esta vacante.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleContactCompany
                    }
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />

                    Enviar mensaje
                  </button>
                </section>
              )}

            {/* ================================================= */}
            {/* ACERCA DE LA EMPRESA */}
            {/* ================================================= */}

            <section className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6">
              <h2 className="font-semibold text-text">
                Acerca de la
                empresa
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <img
                  src={
                    companyImage
                  }
                  alt={`Empresa ${companyName}`}
                  className="h-12 w-12 rounded-xl border border-border object-cover"
                  onError={(
                    event,
                  ) => {
                    event.currentTarget.onerror =
                      null;

                    event.currentTarget.src =
                      DEFAULT_COMPANY_IMAGE;
                  }}
                />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">
                    {
                      companyName
                    }
                  </p>

                  <p className="mt-1 truncate text-sm text-text-muted">
                    {
                      companyIndustry
                    }
                  </p>
                </div>
              </div>

              {vacancy.company_profile
                ?.description && (
                <p className="mt-4 line-clamp-5 text-sm leading-6 text-text-muted">
                  {
                    vacancy.company_profile
                      .description
                  }
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                <UserCircleIcon className="h-5 w-5 shrink-0" />

                <span>
                  Empresa verificada
                  en WorkLink
                </span>
              </div>
            </section>

            {/* Mis postulaciones */}
            {primaryRole ===
              "freelancer" && (
              <Link
                to="/dashboard/postulaciones"
                className="inline-flex w-full items-center justify-center rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Ver mis postulaciones
              </Link>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}