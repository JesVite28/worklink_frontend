import {
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  MapPinIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  Application,
  ApplicationStatus,
} from "../models/application";

interface Props {
  application: Application;
  isProcessing: boolean;

  onView: (
    application: Application,
  ) => void;

  onAccept: (
    application: Application,
  ) => void;

  onReject: (
    application: Application,
  ) => void;
}

const statusInformation: Record<
  ApplicationStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    iconContainerClassName: string;
    topBorderClassName: string;
  }
> = {
  pending: {
    label: "Pendiente",
    description:
      "La postulación todavía requiere una respuesta.",
    badgeClassName:
      "border-warning/30 bg-warning/10 text-warning",
    iconContainerClassName:
      "bg-warning/10 text-warning",
    topBorderClassName: "bg-warning",
  },

  accepted: {
    label: "Aceptada",
    description:
      "La empresa aceptó esta postulación.",
    badgeClassName:
      "border-success/30 bg-success/10 text-success",
    iconContainerClassName:
      "bg-success/10 text-success",
    topBorderClassName: "bg-success",
  },

  rejected: {
    label: "Rechazada",
    description:
      "La empresa rechazó esta postulación.",
    badgeClassName:
      "border-danger/30 bg-danger/10 text-danger",
    iconContainerClassName:
      "bg-danger/10 text-danger",
    topBorderClassName: "bg-danger",
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
    },
  ).format(date);
}

function getFreelancerName(
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
  name: string,
): string {
  const words = name
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

function formatWorkMode(
  workMode: string | null | undefined,
): string {
  if (!workMode) {
    return "Modalidad no especificada";
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

export default function ReceivedApplicationCard({
  application,
  isProcessing,
  onView,
  onAccept,
  onReject,
}: Props) {
  const status =
    statusInformation[application.status];

  const freelancerProfile =
    application.freelancer_profile;

  const vacancy = application.vacancy;

  const freelancerName =
    getFreelancerName(application);

  const canRespond =
    application.status === "pending";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Indicador superior */}
      <div
        className={[
          "h-1.5 w-full",
          status.topBorderClassName,
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Estado */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              status.iconContainerClassName,
            ].join(" ")}
          >
            {getStatusIcon(
              application.status,
            )}
          </div>

          <span
            className={[
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
              status.badgeClassName,
            ].join(" ")}
          >
            {status.label}
          </span>
        </div>

        {/* Freelancer */}
        <div className="mt-5 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {getInitials(freelancerName)}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Candidato
            </p>

            <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-text">
              {freelancerName}
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              {freelancerProfile?.specialty ||
                "Especialidad no especificada"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-text-muted">
          {status.description}
        </p>

        {/* Datos del candidato */}
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Ubicación
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {freelancerProfile?.location ||
                  "No especificada"}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start gap-3">
            <UserCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Modalidad de trabajo
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {formatWorkMode(
                  freelancerProfile?.work_mode,
                )}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start gap-3">
            <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Fecha de postulación
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {formatDate(
                  application.created_at,
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Vacante */}
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Vacante solicitada
              </p>

              <p className="mt-1 line-clamp-2 font-semibold text-text">
                {vacancy?.title ||
                  "Vacante no disponible"}
              </p>

              {vacancy?.category && (
                <p className="mt-1 text-sm text-text-muted">
                  {vacancy.category}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-text">
            Mensaje del candidato
          </p>

          {application.message ? (
            <p className="line-clamp-5 rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-muted">
              {application.message}
            </p>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background p-4 text-sm italic leading-6 text-text-muted">
              El candidato no agregó un mensaje.
            </p>
          )}
        </div>

        {/* Estado final */}
        {!canRespond && (
          <div
            className={[
              "mt-5 rounded-xl border p-4",
              application.status ===
              "accepted"
                ? "border-success/30 bg-success/5"
                : "border-danger/30 bg-danger/5",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              {application.status ===
              "accepted" ? (
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              ) : (
                <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
              )}

              <div>
                <p className="font-medium text-text">
                  Decisión registrada
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Esta postulación ya fue procesada y no
                  puede cambiarse nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-auto space-y-3 pt-6">
          <button
            type="button"
            onClick={() =>
              onView(application)
            }
            disabled={isProcessing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <DocumentMagnifyingGlassIcon className="h-5 w-5" />
            Ver información completa
          </button>

          {canRespond && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  onAccept(application)
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-2.5 text-sm font-medium text-success transition hover:bg-success/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}

                Aceptar
              </button>

              <button
                type="button"
                onClick={() =>
                  onReject(application)
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                ) : (
                  <XCircleIcon className="h-5 w-5" />
                )}

                Rechazar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}