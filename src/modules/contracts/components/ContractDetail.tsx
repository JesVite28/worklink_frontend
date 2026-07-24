import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import type {
  Contract,
  ContractStatus,
  ContractUser,
} from "../models/contract";

interface Props {
  contract: Contract | null;

  isLoading: boolean;
  isUpdating: boolean;

  error: string | null;

  canComplete: boolean;
  canCancel: boolean;
  canReview: boolean;

  onClose: () => void;
  onComplete: (
    contract: Contract,
  ) => void;

  onCancel: (
    contract: Contract,
  ) => void;

  onReview: (
    contract: Contract,
  ) => void;
}

interface StatusInformation {
  label: string;
  description: string;
  className: string;
  icon: typeof ClockIcon;
}

const statusInformation: Record<
  ContractStatus,
  StatusInformation
> = {
  in_process: {
    label: "En proceso",
    description:
      "El trabajo se encuentra actualmente en desarrollo.",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-600",
    icon: ClockIcon,
  },

  completed: {
    label: "Completado",
    description:
      "El freelancer marcó el trabajo como finalizado.",
    className:
      "border-success/20 bg-success/10 text-success",
    icon: CheckCircleIcon,
  },

  canceled: {
    label: "Cancelado",
    description:
      "El contrato fue cancelado y ya no puede modificarse.",
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

function getInitials(
  user: ContractUser | null | undefined,
): string {
  if (!user) {
    return "";
  }

  return [
    user.name?.charAt(0),
    user.last_name?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();
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

function formatDateTime(
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

function UserInformation({
  title,
  user,
}: {
  title: string;
  user: ContractUser | null | undefined;
}) {
  const fullName =
    getFullName(user);

  const initials =
    getInitials(user);

  const profilePhoto =
    user?.profile_photo_url ||
    user?.profile_photo ||
    null;

  return (
    <article className="rounded-2xl border border-border bg-background p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-sm font-semibold text-primary">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={`Perfil de ${fullName}`}
              className="h-full w-full object-cover"
            />
          ) : initials ? (
            initials
          ) : (
            <UserCircleIcon className="h-8 w-8" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {title}
          </p>

          <p className="mt-1 truncate font-semibold text-text">
            {fullName}
          </p>

          {user?.role?.name && (
            <p className="mt-1 text-xs capitalize text-text-muted">
              {user.role.name}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        {user?.email ? (
          <div className="flex items-start gap-2 text-sm text-text-muted">
            <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <span className="break-all">
              {user.email}
            </span>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            Correo no disponible
          </p>
        )}

        {user?.phone && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <PhoneIcon className="h-4 w-4 shrink-0 text-primary" />

            <span>
              {user.phone}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ContractDetail({
  contract,

  isLoading,
  isUpdating,

  error,

  canComplete,
  canCancel,
  canReview,

  onClose,
  onComplete,
  onCancel,
  onReview,
}: Props) {
  const isOpen =
    isLoading ||
    Boolean(error) ||
    Boolean(contract);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isUpdating
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isUpdating,
    onClose,
  ]);

  if (
    !isOpen ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const request =
    contract?.contract_request;

  const service =
    request?.service;

  const client =
    request?.client;

  const freelancer =
    request?.freelancer_profile
      ?.user;

  const status =
    contract
      ? statusInformation[
          contract.status
        ]
      : null;

  const StatusIcon =
    status?.icon ??
    ClockIcon;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={() => {
        if (!isUpdating) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-detail-title"
        className="flex max-h-[calc(100dvh-24px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:max-h-[calc(100dvh-48px)]"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DocumentTextIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Contratación formalizada
              </p>

              <h2
                id="contract-detail-title"
                className="mt-1 text-xl font-bold text-text"
              >
                {contract
                  ? `Contrato #${contract.id}`
                  : "Detalle del contrato"}
              </h2>

              {contract && (
                <p className="mt-1 text-sm text-text-muted">
                  Solicitud original #
                  {contract.request_id}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar detalle"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

              <div>
                <p className="font-semibold text-text">
                  Cargando contrato
                </p>

                <p className="mt-1 text-sm text-text-muted">
                  Estamos obteniendo la información completa.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <XCircleIcon className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-text">
                No se pudo cargar el contrato
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          ) : contract && status ? (
            <div className="space-y-6 p-5 sm:p-6">
              {/* Estado */}
              <section
                className={[
                  "flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between",
                  status.className,
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className="mt-0.5 h-7 w-7 shrink-0" />

                  <div>
                    <p className="text-lg font-bold">
                      {status.label}
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      {status.description}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  {formatCurrency(
                    contract.total_amount,
                  )}
                </p>
              </section>

              {/* Servicio */}
              <section className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Servicio contratado
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-text">
                      {service?.title ||
                        "Servicio no disponible"}
                    </h3>

                    {service?.category && (
                      <p className="mt-1 text-sm text-text-muted">
                        {service.category}
                      </p>
                    )}

                    {service?.location && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-text-muted">
                        <MapPinIcon className="h-4 w-4 text-primary" />

                        {service.location}
                      </p>
                    )}

                    {service?.description && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Participantes */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-primary" />

                  <h3 className="font-semibold text-text">
                    Participantes
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <UserInformation
                    title="Cliente o empresa"
                    user={client}
                  />

                  <UserInformation
                    title="Freelancer"
                    user={freelancer}
                  />
                </div>
              </section>

              {/* Información económica y fechas */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <article className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <BanknotesIcon className="h-6 w-6 text-primary" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Monto total
                  </p>

                  <p className="mt-1 text-lg font-bold text-primary">
                    {formatCurrency(
                      contract.total_amount,
                    )}
                  </p>
                </article>

                <article className="rounded-2xl border border-border bg-background p-5">
                  <CalendarDaysIcon className="h-6 w-6 text-primary" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Fecha de inicio
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {formatDate(
                      contract.start_date,
                    )}
                  </p>
                </article>

                <article className="rounded-2xl border border-border bg-background p-5">
                  <CalendarDaysIcon className="h-6 w-6 text-primary" />

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Fecha de finalización
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {formatDate(
                      contract.end_date,
                    )}
                  </p>
                </article>
              </section>

              {/* Solicitud original */}
              <section className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-primary" />

                  <h3 className="font-semibold text-text">
                    Descripción original del trabajo
                  </h3>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-text-muted">
                  {request?.description ||
                    "La solicitud no contiene una descripción."}
                </p>

                {request?.budget !== null &&
                  request?.budget !== undefined && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Presupuesto propuesto en la solicitud
                      </p>

                      <p className="mt-1 font-semibold text-text">
                        {formatCurrency(
                          request.budget,
                        )}
                      </p>
                    </div>
                  )}
              </section>

              {/* Registro */}
              <section className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Contrato creado
                  </p>

                  <p className="mt-2 text-sm font-medium text-text">
                    {formatDateTime(
                      contract.created_at,
                    )}
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Última actualización
                  </p>

                  <p className="mt-2 text-sm font-medium text-text">
                    {formatDateTime(
                      contract.updated_at,
                    )}
                  </p>
                </article>
              </section>
            </div>
          ) : null}
        </div>

        {/* Acciones */}
        {contract &&
          !isLoading &&
          !error && (
            <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cerrar
              </button>

              {canCancel && (
                <button
                  type="button"
                  onClick={() =>
                    onCancel(contract)
                  }
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircleIcon className="h-5 w-5" />

                  Cancelar contrato
                </button>
              )}

              {canReview &&
                contract.status ===
                  "completed" && (
                  <button
                    type="button"
                    onClick={() =>
                      onReview(contract)
                    }
                    disabled={isUpdating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-warning px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <StarIcon className="h-5 w-5" />

                    Calificar participante
                  </button>
                )}

              {canComplete && (
                <button
                  type="button"
                  onClick={() =>
                    onComplete(contract)
                  }
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-5 w-5" />

                  Marcar como completado
                </button>
              )}
            </footer>
          )}
      </section>
    </div>,
    document.body,
  );
}