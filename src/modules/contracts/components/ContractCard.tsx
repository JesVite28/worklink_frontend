import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  StarIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  Contract,
  ContractStatus,
  ContractUser,
  ContractUserRole,
} from "../models/contract";

interface Props {
  contract: Contract;

  primaryRole:
    | ContractUserRole
    | null
    | undefined;

  canComplete: boolean;
  canCancel: boolean;

  isUpdating?: boolean;

  onView: (
    contract: Contract,
  ) => void;

  onComplete: (
    contract: Contract,
  ) => void;

  onCancel: (
    contract: Contract,
  ) => void;
}

interface StatusInformation {
  label: string;
  className: string;
  icon: typeof ClockIcon;
}

const statusInformation: Record<
  ContractStatus,
  StatusInformation
> = {
  in_process: {
    label: "En proceso",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600",
    icon: ClockIcon,
  },

  completed: {
    label: "Completado",
    className:
      "border-success/20 bg-success/10 text-success",
    icon: CheckCircleIcon,
  },

  canceled: {
    label: "Cancelado",
    className:
      "border-danger/20 bg-danger/10 text-danger",
    icon: XCircleIcon,
  },
};

function getFullName(
  user: ContractUser | null | undefined,
): string {
  if (!user) {
    return "Usuario no disponible";
  }

  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatCurrency(
  value: string | number,
): string {
  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "Monto no disponible";
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

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "No definida";
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

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

export default function ContractCard({
  contract,

  primaryRole,

  canComplete,
  canCancel,

  isUpdating = false,

  onView,
  onComplete,
  onCancel,
}: Props) {
  const request =
    contract.contract_request;

  const service =
    request?.service;

  const client =
    request?.client;

  const freelancer =
    request?.freelancer_profile
      ?.user;

  const status =
    statusInformation[
      contract.status
    ];

  const StatusIcon =
    status.icon;

  const counterpartLabel =
    primaryRole === "freelancer"
      ? "Cliente"
      : "Freelancer";

  const counterpart =
    primaryRole === "freelancer"
      ? client
      : freelancer;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Encabezado */}
      <header className="border-b border-border bg-background/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Contrato #{contract.id}
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Solicitud #{contract.request_id}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                status.className,
              ].join(" ")}
            >
              <StatusIcon className="h-4 w-4" />

              {status.label}
            </span>

            {contract.status ===
              "completed" &&
              contract.has_reviewed && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning">
                  <StarIcon className="h-4 w-4" />

                  Reseña enviada
                </span>
              )}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Servicio */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Servicio contratado
            </p>

            <h2 className="mt-1 line-clamp-2 text-lg font-semibold leading-7 text-text">
              {service?.title ||
                "Servicio no disponible"}
            </h2>

            {service?.category && (
              <p className="mt-1 text-sm text-text-muted">
                {service.category}
              </p>
            )}
          </div>
        </div>

        {/* Participante principal */}
        <section className="mt-5 rounded-xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <UserGroupIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                {counterpartLabel}
              </p>

              <p className="mt-1 truncate font-semibold text-text">
                {getFullName(
                  counterpart,
                )}
              </p>

              {counterpart?.email && (
                <p className="mt-1 truncate text-sm text-text-muted">
                  {counterpart.email}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Monto */}
        <section className="mt-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <BanknotesIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Monto total
            </p>

            <p className="mt-1 text-lg font-bold text-primary">
              {formatCurrency(
                contract.total_amount,
              )}
            </p>
          </div>
        </section>

        {/* Fechas */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <section className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarDaysIcon className="h-4 w-4" />

              <p className="text-xs font-medium uppercase tracking-wide">
                Inicio
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {formatDate(
                contract.start_date,
              )}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarDaysIcon className="h-4 w-4" />

              <p className="text-xs font-medium uppercase tracking-wide">
                Finalización
              </p>
            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {formatDate(
                contract.end_date,
              )}
            </p>
          </section>
        </div>

        {/* Descripción original */}
        {request?.description && (
          <section className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Trabajo solicitado
            </p>

            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-text-muted">
              {request.description}
            </p>
          </section>
        )}

        {/* Acciones */}
        <div className="mt-auto pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                onView(contract)
              }
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EyeIcon className="h-5 w-5" />

              Ver detalles
            </button>

            {canComplete ? (
              <button
                type="button"
                onClick={() =>
                  onComplete(
                    contract,
                  )
                }
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircleIcon className="h-5 w-5" />

                Completar
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>

          {canCancel && (
            <button
              type="button"
              onClick={() =>
                onCancel(contract)
              }
              disabled={isUpdating}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircleIcon className="h-5 w-5" />

              Cancelar contrato
            </button>
          )}
        </div>
      </div>
    </article>
  );
}