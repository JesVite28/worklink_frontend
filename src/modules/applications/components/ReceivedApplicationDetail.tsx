import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  LanguageIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type {
  Application,
  ApplicationStatus,
} from "../models/application";

interface Props {
  application: Application | null;
  isProcessing: boolean;

  onAccept: (
    application: Application,
  ) => void;

  onReject: (
    application: Application,
  ) => void;

  onClose: () => void;
}

const statusInformation: Record<
  ApplicationStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    iconClassName: string;
  }
> = {
  pending: {
    label: "Pendiente",
    description:
      "Esta postulación todavía requiere una respuesta.",
    badgeClassName:
      "border-warning/30 bg-warning/10 text-warning",
    iconClassName:
      "bg-warning/10 text-warning",
  },

  accepted: {
    label: "Aceptada",
    description:
      "La empresa aceptó esta postulación.",
    badgeClassName:
      "border-success/30 bg-success/10 text-success",
    iconClassName:
      "bg-success/10 text-success",
  },

  rejected: {
    label: "Rechazada",
    description:
      "La empresa rechazó esta postulación.",
    badgeClassName:
      "border-danger/30 bg-danger/10 text-danger",
    iconClassName:
      "bg-danger/10 text-danger",
  },
};

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatCurrency(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "No especificada";
  }

  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "No especificada";
  }

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    },
  ).format(numericValue);
}

function formatWorkMode(
  workMode: string | null | undefined,
): string {
  if (!workMode) {
    return "No especificada";
  }

  const labels: Record<string, string> = {
    remote: "Remoto",
    remoto: "Remoto",
    on_site: "Presencial",
    onsite: "Presencial",
    presencial: "Presencial",
    hybrid: "Híbrido",
    hibrido: "Híbrido",
    híbrido: "Híbrido",
  };

  return labels[workMode.toLowerCase()] ?? workMode;
}

function formatRateType(
  rateType: string | null | undefined,
): string {
  if (!rateType) {
    return "Tarifa";
  }

  const labels: Record<string, string> = {
    hourly: "Por hora",
    hour: "Por hora",
    por_hora: "Por hora",
    project: "Por proyecto",
    fixed: "Por proyecto",
    por_proyecto: "Por proyecto",
    daily: "Por día",
    por_dia: "Por día",
    monthly: "Por mes",
    mensual: "Por mes",
  };

  return labels[rateType.toLowerCase()] ?? rateType;
}

function getFullName(
  application: Application,
): string {
  const user =
    application.freelancer_profile?.user;

  if (!user) {
    return "Freelancer no disponible";
  }

  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getInitials(
  fullName: string,
): string {
  const words = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "FL";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function normalizeUrl(
  url: string,
): string {
  const normalizedUrl = url.trim();

  if (
    normalizedUrl.startsWith("http://") ||
    normalizedUrl.startsWith("https://")
  ) {
    return normalizedUrl;
  }

  return `https://${normalizedUrl}`;
}

function getStatusIcon(
  status: ApplicationStatus,
) {
  if (status === "pending") {
    return <ClockIcon className="h-6 w-6" />;
  }

  if (status === "accepted") {
    return (
      <CheckCircleIcon className="h-6 w-6" />
    );
  }

  return <XCircleIcon className="h-6 w-6" />;
}

export default function ReceivedApplicationDetail({
  application,
  isProcessing,
  onAccept,
  onReject,
  onClose,
}: Props) {
  if (!application) {
    return null;
  }

  const freelancerProfile =
    application.freelancer_profile;

  const user = freelancerProfile?.user;

  const vacancy = application.vacancy;

  const fullName =
    getFullName(application);

  const status =
    statusInformation[application.status];

  const canRespond =
    application.status === "pending";

  const professionalLinks = [
    {
      label: "Sitio web",
      url:
        freelancerProfile
          ?.professional_links?.website,
    },
    {
      label: "Portafolio",
      url:
        freelancerProfile
          ?.professional_links
          ?.portfolio_url,
    },
    {
      label: "LinkedIn",
      url:
        freelancerProfile
          ?.professional_links?.linkedin,
    },
    {
      label: "GitHub",
      url:
        freelancerProfile
          ?.professional_links?.github,
    },
    {
      label: "Facebook",
      url:
        freelancerProfile
          ?.professional_links?.facebook,
    },
    {
      label: "Instagram",
      url:
        freelancerProfile
          ?.professional_links?.instagram,
    },
  ].filter(
    (
      item,
    ): item is {
      label: string;
      url: string;
    } => Boolean(item.url),
  );

  const languages =
    freelancerProfile?.languages ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="received-application-detail-title"
    >
      {/* Fondo */}
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        aria-label="Cerrar detalle"
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                status.iconClassName,
              ].join(" ")}
            >
              {getStatusIcon(
                application.status,
              )}
            </div>

            <div className="min-w-0">
              <h2
                id="received-application-detail-title"
                className="text-xl font-semibold text-text"
              >
                Información de la postulación
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Revisa el perfil profesional y el
                mensaje enviado por el candidato.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Columna principal */}
            <div className="space-y-6">
              {/* Candidato */}
              <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    {user?.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt={fullName}
                        className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {getInitials(fullName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Candidato
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-text">
                        {fullName}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-primary">
                        {freelancerProfile?.specialty ||
                          "Especialidad no especificada"}
                      </p>

                      <p className="mt-2 text-sm text-text-muted">
                        {freelancerProfile?.available
                          ? "Disponible para trabajar"
                          : "No disponible actualmente"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={[
                      "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold",
                      status.badgeClassName,
                    ].join(" ")}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-text-muted">
                  {freelancerProfile?.description ||
                    "El candidato no agregó una descripción profesional."}
                </p>
              </section>

              {/* Información profesional */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <h3 className="text-lg font-semibold text-text">
                  Información profesional
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        Ubicación
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {freelancerProfile?.location ||
                          "No especificada"}
                      </p>
                    </div>
                  </article>

                  <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <GlobeAltIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        Área de servicio
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {freelancerProfile?.service_area ||
                          "No especificada"}
                      </p>
                    </div>
                  </article>

                  <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        Modalidad de trabajo
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {formatWorkMode(
                          freelancerProfile?.work_mode,
                        )}
                      </p>
                    </div>
                  </article>

                  <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <WrenchScrewdriverIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        Experiencia
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {freelancerProfile?.experience ||
                          "No especificada"}
                      </p>
                    </div>
                  </article>

                  <article className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 sm:col-span-2">
                    <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-medium text-text-muted">
                        Tarifa profesional
                      </p>

                      <p className="mt-1 text-sm font-medium text-text">
                        {formatCurrency(
                          freelancerProfile?.rate,
                        )}{" "}
                        ·{" "}
                        {formatRateType(
                          freelancerProfile?.rate_type,
                        )}
                      </p>
                    </div>
                  </article>
                </div>
              </section>

              {/* Mensaje */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <h3 className="text-lg font-semibold text-text">
                  Mensaje del candidato
                </h3>

                {application.message ? (
                  <p className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm leading-7 text-text-muted">
                    {application.message}
                  </p>
                ) : (
                  <p className="mt-4 rounded-xl border border-dashed border-border bg-background p-4 text-sm italic leading-6 text-text-muted">
                    El candidato no agregó un mensaje
                    a su postulación.
                  </p>
                )}
              </section>

              {/* Idiomas */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2">
                  <LanguageIcon className="h-5 w-5 text-primary" />

                  <h3 className="text-lg font-semibold text-text">
                    Idiomas
                  </h3>
                </div>

                {languages.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {languages.map(
                      (language, index) => (
                        <span
                          key={`${language}-${index}`}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
                        >
                          {language}
                        </span>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-text-muted">
                    El candidato no especificó
                    idiomas.
                  </p>
                )}
              </section>

              {/* Enlaces */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />

                  <h3 className="text-lg font-semibold text-text">
                    Enlaces profesionales
                  </h3>
                </div>

                {professionalLinks.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {professionalLinks.map(
                      (item) => (
                        <a
                          key={`${item.label}-${item.url}`}
                          href={normalizeUrl(
                            item.url,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary"
                        >
                          <span className="truncate">
                            {item.label}
                          </span>

                          <GlobeAltIcon className="h-5 w-5 shrink-0" />
                        </a>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-text-muted">
                    El candidato no agregó enlaces
                    profesionales.
                  </p>
                )}
              </section>
            </div>

            {/* Columna lateral */}
            <aside className="space-y-6">
              {/* Vacante */}
              <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <BriefcaseIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      Vacante solicitada
                    </p>

                    <h3 className="mt-2 font-semibold text-text">
                      {vacancy?.title ||
                        "Vacante no disponible"}
                    </h3>

                    {vacancy?.category && (
                      <p className="mt-1 text-sm text-text-muted">
                        {vacancy.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-primary/20 pt-4">
                  <div className="flex items-start gap-2 text-sm text-text-muted">
                    <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {vacancy?.location ||
                        "Ubicación no disponible"}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-text-muted">
                    <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0" />

                    <span>
                      {vacancy?.salary
                        ? formatCurrency(
                            vacancy.salary,
                          )
                        : "Salario negociable"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Contacto */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <h3 className="font-semibold text-text">
                  Datos de contacto
                </h3>

                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

                    <div className="min-w-0">
                      <p className="text-xs text-text-muted">
                        Correo electrónico
                      </p>

                      {user?.email ? (
                        <a
                          href={`mailto:${user.email}`}
                          className="mt-1 block truncate text-sm font-medium text-primary hover:underline"
                        >
                          {user.email}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-text">
                          No disponible
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  <div className="flex items-start gap-3">
                    <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

                    <div className="min-w-0">
                      <p className="text-xs text-text-muted">
                        Teléfono
                      </p>

                      {user?.phone ? (
                        <a
                          href={`tel:${user.phone}`}
                          className="mt-1 block text-sm font-medium text-primary hover:underline"
                        >
                          {user.phone}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm text-text">
                          No disponible
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Fecha */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs font-medium text-text-muted">
                      Postulación recibida
                    </p>

                    <p className="mt-1 text-sm font-medium text-text">
                      {formatDate(
                        application.created_at,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Estado */}
              <section
                className={[
                  "rounded-2xl border p-5",
                  application.status ===
                  "pending"
                    ? "border-warning/30 bg-warning/5"
                    : application.status ===
                        "accepted"
                      ? "border-success/30 bg-success/5"
                      : "border-danger/30 bg-danger/5",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(
                    application.status,
                  )}

                  <div>
                    <h3 className="font-semibold text-text">
                      {status.label}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {status.description}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>

        {/* Acciones */}
        <footer className="flex flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cerrar
          </button>

          {canRespond && (
            <>
              <button
                type="button"
                onClick={() =>
                  onReject(application)
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}

                Rechazar
              </button>

              <button
                type="button"
                onClick={() =>
                  onAccept(application)
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}

                Aceptar
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}