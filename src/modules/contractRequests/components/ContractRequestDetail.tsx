import {
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
  TrashIcon,
  UserCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type {
  ContractRequest,
  ContractRequestStatus,
} from "../models/contractRequest";

import type { ContractRequestViewMode } from "../hooks/useContractRequests";

interface Props {
  contractRequest: ContractRequest | null;
  viewMode: ContractRequestViewMode;
  isProcessing: boolean;

  onEdit: (
    contractRequest: ContractRequest,
  ) => void;

  onAccept: (
    contractRequest: ContractRequest,
  ) => void;

  onFormalize: (
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

  onClose: () => void;
}

interface StatusInformation {
  label: string;
  descriptionSent: string;
  descriptionReceived: string;
  className: string;
  iconClassName: string;
  icon: typeof ClockIcon;
}

const statusInformation: Record<
  ContractRequestStatus,
  StatusInformation
> = {
  pending: {
    label: "Pendiente",
    descriptionSent:
      "La solicitud está esperando la respuesta del freelancer.",
    descriptionReceived:
      "Esta solicitud todavía requiere una respuesta.",
    className:
      "border-warning/30 bg-warning/10 text-warning",
    iconClassName:
      "bg-warning/10 text-warning",
    icon: ClockIcon,
  },

  accepted: {
    label: "Aceptada",
    descriptionSent:
      "El freelancer aceptó la solicitud de contratación.",
    descriptionReceived:
      "Aceptaste esta solicitud de contratación.",
    className:
      "border-success/30 bg-success/10 text-success",
    iconClassName:
      "bg-success/10 text-success",
    icon: CheckCircleIcon,
  },

  rejected: {
    label: "Rechazada",
    descriptionSent:
      "El freelancer rechazó la solicitud de contratación.",
    descriptionReceived:
      "Rechazaste esta solicitud de contratación.",
    className:
      "border-danger/30 bg-danger/10 text-danger",
    iconClassName:
      "bg-danger/10 text-danger",
    icon: XCircleIcon,
  },

  canceled: {
    label: "Cancelada",
    descriptionSent:
      "La solicitud fue cancelada por el solicitante.",
    descriptionReceived:
      "El solicitante canceló esta solicitud.",
    className:
      "border-border bg-background text-text-muted",
    iconClassName:
      "bg-background text-text-muted",
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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function formatWorkMode(
  value: string | null,
): string {
  if (!value) {
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

  return labels[value.toLowerCase()] ?? value;
}

function normalizeUrl(
  value: string,
): string {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

export default function ContractRequestDetail({
  contractRequest,
  viewMode,
  isProcessing,
  onEdit,
  onAccept,
  onFormalize,
  onReject,
  onCancel,
  onDelete,
  onClose,
}: Props) {
  if (!contractRequest) {
    return null;
  }

  const isReceivedView =
    viewMode === "received";

  const isPending =
    contractRequest.status === "pending";

  const isAccepted =
    contractRequest.status === "accepted";

  const service =
    contractRequest.service;

  const freelancerProfile =
    contractRequest.freelancer_profile;

  const person =
    isReceivedView
      ? contractRequest.client
      : freelancerProfile?.user;

  const fullName = getFullName(
    contractRequest,
    viewMode,
  );

  const status =
    statusInformation[
      contractRequest.status
    ];

  const StatusIcon = status.icon;

  const statusDescription =
    isReceivedView
      ? status.descriptionReceived
      : status.descriptionSent;

  const professionalLinks = freelancerProfile
    ? [
        {
          label: "Sitio web",
          url:
            freelancerProfile
              .professional_links.website,
        },
        {
          label: "Portafolio",
          url:
            freelancerProfile
              .professional_links
              .portfolio_url,
        },
        {
          label: "LinkedIn",
          url:
            freelancerProfile
              .professional_links.linkedin,
        },
        {
          label: "GitHub",
          url:
            freelancerProfile
              .professional_links.github,
        },
        {
          label: "Facebook",
          url:
            freelancerProfile
              .professional_links.facebook,
        },
        {
          label: "Instagram",
          url:
            freelancerProfile
              .professional_links.instagram,
        },
      ].filter(
        (
          item,
        ): item is {
          label: string;
          url: string;
        } => Boolean(item.url),
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-request-detail-title"
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
              <StatusIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2
                id="contract-request-detail-title"
                className="text-xl font-semibold text-text"
              >
                Detalle de la solicitud
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isReceivedView
                  ? "Revisa la información del cliente y las condiciones del trabajo."
                  : "Consulta el freelancer, el servicio y el estado de tu solicitud."}
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
              {/* Persona relacionada */}
              <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    {person?.profile_photo_url ? (
                      <img
                        src={
                          person.profile_photo_url
                        }
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
                        {isReceivedView
                          ? "Solicitante"
                          : "Freelancer"}
                      </p>

                      <h3 className="mt-1 text-xl font-semibold text-text">
                        {fullName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-primary">
                        <UserCircleIcon className="h-4 w-4 shrink-0" />

                        <span>
                          {isReceivedView
                            ? person?.role?.name ===
                              "empresa"
                              ? "Empresa solicitante"
                              : "Cliente solicitante"
                            : freelancerProfile
                                ?.specialty ||
                              "Freelancer"}
                        </span>
                      </div>

                      {!isReceivedView &&
                        freelancerProfile && (
                          <p className="mt-2 text-sm text-text-muted">
                            {freelancerProfile.available
                              ? "Disponible para trabajar"
                              : "No disponible actualmente"}
                          </p>
                        )}
                    </div>
                  </div>

                  <span
                    className={[
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                      status.className,
                    ].join(" ")}
                  >
                    <StatusIcon className="h-4 w-4" />

                    {status.label}
                  </span>
                </div>

                {!isReceivedView &&
                  freelancerProfile?.description && (
                    <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-text-muted">
                      {
                        freelancerProfile.description
                      }
                    </p>
                  )}
              </section>

              {/* Servicio */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-5 w-5 text-primary" />

                  <h3 className="text-lg font-semibold text-text">
                    Servicio solicitado
                  </h3>
                </div>

                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Servicio
                  </p>

                  <h4 className="mt-1 text-lg font-semibold text-text">
                    {service?.title ||
                      "Servicio no disponible"}
                  </h4>

                  {service?.category && (
                    <p className="mt-1 text-sm font-medium text-text-muted">
                      {service.category}
                    </p>
                  )}

                  {service?.description && (
                    <p className="mt-4 whitespace-pre-wrap border-t border-primary/20 pt-4 text-sm leading-7 text-text-muted">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <article className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <BanknotesIcon className="h-5 w-5" />

                      <p className="text-xs font-medium">
                        Precio publicado
                      </p>
                    </div>

                    <p className="mt-2 font-semibold text-text">
                      {formatCurrency(
                        service?.price ?? null,
                      )}
                    </p>
                  </article>

                  <article className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2 text-text-muted">
                      <MapPinIcon className="h-5 w-5" />

                      <p className="text-xs font-medium">
                        Ubicación
                      </p>
                    </div>

                    <p className="mt-2 font-semibold text-text">
                      {service?.location ||
                        "No especificada"}
                    </p>
                  </article>
                </div>
              </section>

              {/* Descripción de solicitud */}
              <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                <h3 className="text-lg font-semibold text-text">
                  Descripción del trabajo
                </h3>

                <p className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm leading-7 text-text-muted">
                  {contractRequest.description}
                </p>
              </section>

              {/* Información del freelancer */}
              {!isReceivedView &&
                freelancerProfile && (
                  <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                    <h3 className="text-lg font-semibold text-text">
                      Información profesional
                    </h3>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <article className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-medium text-text-muted">
                          Especialidad
                        </p>

                        <p className="mt-1 text-sm font-semibold text-text">
                          {freelancerProfile.specialty ||
                            "No especificada"}
                        </p>
                      </article>

                      <article className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-medium text-text-muted">
                          Ubicación
                        </p>

                        <p className="mt-1 text-sm font-semibold text-text">
                          {freelancerProfile.location ||
                            "No especificada"}
                        </p>
                      </article>

                      <article className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-medium text-text-muted">
                          Modalidad
                        </p>

                        <p className="mt-1 text-sm font-semibold text-text">
                          {formatWorkMode(
                            freelancerProfile.work_mode,
                          )}
                        </p>
                      </article>

                      <article className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-medium text-text-muted">
                          Tarifa profesional
                        </p>

                        <p className="mt-1 text-sm font-semibold text-text">
                          {formatCurrency(
                            freelancerProfile.rate,
                          )}
                        </p>
                      </article>
                    </div>

                    {freelancerProfile.languages
                      .length > 0 && (
                      <div className="mt-5 border-t border-border pt-5">
                        <p className="text-sm font-medium text-text">
                          Idiomas
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {freelancerProfile.languages.map(
                            (
                              language,
                              index,
                            ) => (
                              <span
                                key={`${language}-${index}`}
                                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                              >
                                {language}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {professionalLinks.length >
                      0 && (
                      <div className="mt-5 border-t border-border pt-5">
                        <div className="flex items-center gap-2">
                          <GlobeAltIcon className="h-5 w-5 text-primary" />

                          <p className="text-sm font-medium text-text">
                            Enlaces profesionales
                          </p>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
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

                                <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" />
                              </a>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </section>
                )}
            </div>

            {/* Columna lateral */}
            <aside className="space-y-6">
              {/* Presupuesto */}
              <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <BanknotesIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      Presupuesto propuesto
                    </p>

                    <p className="mt-2 text-2xl font-bold text-text">
                      {formatCurrency(
                        contractRequest.budget,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      Moneda: MXN
                    </p>
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

                      {person?.email ? (
                        <a
                          href={`mailto:${person.email}`}
                          className="mt-1 block truncate text-sm font-medium text-primary hover:underline"
                        >
                          {person.email}
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

                      {person?.phone ? (
                        <a
                          href={`tel:${person.phone}`}
                          className="mt-1 block text-sm font-medium text-primary hover:underline"
                        >
                          {person.phone}
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
                      Solicitud enviada
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {formatDate(
                        contractRequest.created_at,
                      )}
                    </p>
                  </div>
                </div>

                {contractRequest.updated_at !==
                  contractRequest.created_at && (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-xs font-medium text-text-muted">
                      Última actualización
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {formatDate(
                        contractRequest.updated_at,
                      )}
                    </p>
                  </div>
                )}
              </section>

              {/* Estado */}
              <section
                className={[
                  "rounded-2xl border p-5",
                  contractRequest.status ===
                  "pending"
                    ? "border-warning/30 bg-warning/5"
                    : contractRequest.status ===
                        "accepted"
                      ? "border-success/30 bg-success/5"
                      : contractRequest.status ===
                          "rejected"
                        ? "border-danger/30 bg-danger/5"
                        : "border-border bg-background",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className="mt-0.5 h-6 w-6 shrink-0" />

                  <div>
                    <h3 className="font-semibold text-text">
                      {status.label}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      {statusDescription}
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

          {isAccepted &&
            isReceivedView && (
              <button
                type="button"
                onClick={() =>
                  onFormalize(contractRequest)
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <DocumentPlusIcon className="h-5 w-5" />

                Formalizar contrato
              </button>
            )}

          {isPending &&
            isReceivedView && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onReject(contractRequest)
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                  ) : (
                    <XCircleIcon className="h-5 w-5" />
                  )}

                  Rechazar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAccept(contractRequest)
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

          {isPending &&
            !isReceivedView && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onDelete(contractRequest)
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-5 py-3 font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                  ) : (
                    <TrashIcon className="h-5 w-5" />
                  )}

                  Eliminar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onCancel(contractRequest)
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-warning/30 bg-warning/5 px-5 py-3 font-medium text-warning transition hover:bg-warning/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircleIcon className="h-5 w-5" />

                  Cancelar solicitud
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onEdit(contractRequest)
                  }
                  disabled={isProcessing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PencilSquareIcon className="h-5 w-5" />

                  Editar
                </button>
              </>
            )}
        </footer>
      </div>
    </div>
  );
}