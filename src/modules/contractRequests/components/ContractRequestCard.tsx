import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  MapPinIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  ContractRequest,
  ContractRequestStatus,
} from "../models/contractRequest";

import type { ContractRequestViewMode } from "../hooks/useContractRequests";

interface Props {
  contractRequest: ContractRequest;
  viewMode: ContractRequestViewMode;
  isProcessing: boolean;

  onView: (
    contractRequest: ContractRequest,
  ) => void;

  onEdit: (
    contractRequest: ContractRequest,
  ) => void;

  onAccept: (
    contractRequest: ContractRequest,
  ) => void;

  onReject: (
    contractRequest: ContractRequest,
  ) => void;

  onCancel: (
    contractRequest: ContractRequest,
  ) => void;

  onDelete: (
    contractRequest: ContractRequest,
  ) => void;
}

interface StatusInformation {
  label: string;
  className: string;
  icon: typeof ClockIcon;
}

const statusInformation: Record<
  ContractRequestStatus,
  StatusInformation
> = {
  pending: {
    label: "Pendiente",
    className:
      "border-warning/30 bg-warning/10 text-warning",
    icon: ClockIcon,
  },

  accepted: {
    label: "Aceptada",
    className:
      "border-success/30 bg-success/10 text-success",
    icon: CheckCircleIcon,
  },

  rejected: {
    label: "Rechazada",
    className:
      "border-danger/30 bg-danger/10 text-danger",
    icon: XCircleIcon,
  },

  canceled: {
    label: "Cancelada",
    className:
      "border-border bg-background text-text-muted",
    icon: XCircleIcon,
  },
};

function formatCurrency(
  value: string | number | null,
): string {
  if (
    value === null ||
    value === ""
  ) {
    return "A convenir";
  }

  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "A convenir";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericValue);
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getFullName(
  contractRequest: ContractRequest,
  viewMode: ContractRequestViewMode,
): string {
  const user =
    viewMode === "received"
      ? contractRequest.client
      : contractRequest
          .freelancer_profile
          ?.user;

  if (!user) {
    return viewMode === "received"
      ? "Cliente no disponible"
      : "Freelancer no disponible";
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
    return "WL";
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default function ContractRequestCard({
  contractRequest,
  viewMode,
  isProcessing,
  onView,
  onEdit,
  onAccept,
  onReject,
  onCancel,
  onDelete,
}: Props) {
  const isReceivedView =
    viewMode === "received";

  const isPending =
    contractRequest.status === "pending";

  const person =
    isReceivedView
      ? contractRequest.client
      : contractRequest
          .freelancer_profile
          ?.user;

  const fullName = getFullName(
    contractRequest,
    viewMode,
  );

  const status =
    statusInformation[
      contractRequest.status
    ];

  const StatusIcon = status.icon;

  const service =
    contractRequest.service;

  const freelancerProfile =
    contractRequest.freelancer_profile;

  const personDescription =
    isReceivedView
      ? contractRequest.client?.role?.name ===
        "empresa"
        ? "Empresa solicitante"
        : "Cliente solicitante"
      : freelancerProfile?.specialty ||
        "Freelancer";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Encabezado */}
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {person?.profile_photo_url ? (
              <img
                src={person.profile_photo_url}
                alt={fullName}
                className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                {getInitials(fullName)}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate font-semibold text-text">
                {fullName}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                <UserCircleIcon className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  {personDescription}
                </span>
              </div>
            </div>
          </div>

          <span
            className={[
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
              status.className,
            ].join(" ")}
          >
            <StatusIcon className="h-4 w-4" />

            {status.label}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Servicio */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Servicio solicitado
              </p>

              <h3 className="mt-1 font-semibold text-text">
                {service?.title ||
                  "Servicio no disponible"}
              </h3>

              {service?.category && (
                <p className="mt-1 text-sm text-text-muted">
                  {service.category}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-text-muted">
              <BanknotesIcon className="h-4 w-4" />

              <span className="text-xs">
                Presupuesto
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-text">
              {formatCurrency(
                contractRequest.budget,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarDaysIcon className="h-4 w-4" />

              <span className="text-xs">
                Fecha
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-text">
              {formatDate(
                contractRequest.created_at,
              )}
            </p>
          </div>
        </div>

        {service?.location && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-text-muted">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />

            <span className="break-words">
              {service.location}
            </span>
          </div>
        )}

        {/* Descripción */}
        <div className="mt-4 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Descripción de la solicitud
          </p>

          <p className="mt-2 max-h-24 overflow-hidden whitespace-pre-wrap text-sm leading-6 text-text-muted">
            {contractRequest.description}
          </p>
        </div>

        {/* Estado final */}
        {!isPending && (
          <div
            className={[
              "mt-5 rounded-xl border p-3 text-sm",
              contractRequest.status ===
              "accepted"
                ? "border-success/30 bg-success/5 text-success"
                : contractRequest.status ===
                    "rejected"
                  ? "border-danger/30 bg-danger/5 text-danger"
                  : "border-border bg-background text-text-muted",
            ].join(" ")}
          >
            {contractRequest.status ===
            "accepted"
              ? "El freelancer aceptó esta solicitud."
              : contractRequest.status ===
                  "rejected"
                ? "El freelancer rechazó esta solicitud."
                : "La solicitud fue cancelada por el solicitante."}
          </div>
        )}

        {/* Acciones */}
        <div className="mt-5 border-t border-border pt-5">
          <button
            type="button"
            onClick={() =>
              onView(contractRequest)
            }
            disabled={isProcessing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <EyeIcon className="h-5 w-5" />

            Ver detalles
          </button>

          {isPending &&
            isReceivedView && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onReject(
                      contractRequest,
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                  ) : (
                    <XCircleIcon className="h-5 w-5" />
                  )}

                  Rechazar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAccept(
                      contractRequest,
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5" />
                  )}

                  Aceptar
                </button>
              </div>
            )}

          {isPending &&
            !isReceivedView && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    onEdit(
                      contractRequest,
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PencilSquareIcon className="h-5 w-5" />

                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onCancel(
                      contractRequest,
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm font-semibold text-warning transition hover:bg-warning/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircleIcon className="h-5 w-5" />

                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(
                      contractRequest,
                    )
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}

                  Eliminar
                </button>
              </div>
            )}
        </div>
      </div>
    </article>
  );
}