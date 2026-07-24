import {
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  Application,
  ApplicationStatus,
} from "../models/application";

interface Props {
  application: Application;
  isProcessing: boolean;

  onEditMessage: (
    application: Application,
  ) => void;

  onWithdraw: (
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
      "La empresa todavía no ha respondido tu postulación.",
    badgeClassName:
      "border-warning/30 bg-warning/10 text-warning",
    iconContainerClassName:
      "bg-warning/10 text-warning",
    topBorderClassName: "bg-warning",
  },

  accepted: {
    label: "Aceptada",
    description:
      "La empresa aceptó tu postulación.",
    badgeClassName:
      "border-success/30 bg-success/10 text-success",
    iconContainerClassName:
      "bg-success/10 text-success",
    topBorderClassName: "bg-success",
  },

  rejected: {
    label: "Rechazada",
    description:
      "La empresa decidió no continuar con tu postulación.",
    badgeClassName:
      "border-danger/30 bg-danger/10 text-danger",
    iconContainerClassName:
      "bg-danger/10 text-danger",
    topBorderClassName: "bg-danger",
  },
};

function formatDate(value: string): string {
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

function formatSalary(
  salary: string | null | undefined,
): string {
  if (!salary) {
    return "Salario negociable";
  }

  const numericSalary = Number(salary);

  if (
    Number.isNaN(numericSalary) ||
    !Number.isFinite(numericSalary)
  ) {
    return "Salario negociable";
  }

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    },
  ).format(numericSalary);
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

export default function MyApplicationCard({
  application,
  isProcessing,
  onEditMessage,
  onWithdraw,
}: Props) {
  const status =
    statusInformation[application.status];

  const vacancy = application.vacancy;

  const companyName =
    vacancy?.company_profile?.company_name ??
    "Empresa no disponible";

  const canModify =
    application.status === "pending";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
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

        {/* Vacante */}
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Postulación para
          </p>

          <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-7 text-text">
            {vacancy?.title ??
              "Vacante no disponible"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            {status.description}
          </p>
        </div>

        {/* Categoría */}
        {vacancy?.category && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <BriefcaseIcon className="h-4 w-4" />

              {vacancy.category}
            </span>
          </div>
        )}

        {/* Información */}
        <div className="mt-5 space-y-3 rounded-xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <BuildingOffice2Icon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Empresa
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {companyName}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start gap-3">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Ubicación o modalidad
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {vacancy?.location ??
                  "No disponible"}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="flex items-start gap-3">
            <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Salario
              </p>

              <p className="mt-0.5 text-sm font-medium text-text">
                {formatSalary(
                  vacancy?.salary,
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

        {/* Mensaje */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />

            <h3 className="text-sm font-semibold text-text">
              Mensaje enviado
            </h3>
          </div>

          {application.message ? (
            <p className="line-clamp-5 rounded-xl border border-border bg-background p-4 text-sm leading-6 text-text-muted">
              {application.message}
            </p>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-background p-4 text-sm italic leading-6 text-text-muted">
              No agregaste un mensaje a esta
              postulación.
            </p>
          )}
        </div>

        {/* Estado final */}
        {!canModify && (
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
                  Postulación finalizada
                </p>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  Ya no puedes editar el mensaje ni
                  retirar esta postulación.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              onEditMessage(application)
            }
            disabled={
              isProcessing || !canModify
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-text-muted disabled:opacity-60"
          >
            <PencilSquareIcon className="h-5 w-5" />

            {canModify
              ? "Editar mensaje"
              : "Edición bloqueada"}
          </button>

          <button
            type="button"
            onClick={() =>
              onWithdraw(application)
            }
            disabled={
              isProcessing || !canModify
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-text-muted disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
            ) : (
              <TrashIcon className="h-5 w-5" />
            )}

            {canModify
              ? "Retirar"
              : "No disponible"}
          </button>
        </div>
      </div>
    </article>
  );
}