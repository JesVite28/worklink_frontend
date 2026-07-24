import {
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  EnvelopeOpenIcon,
  NoSymbolIcon,
  StarIcon,
  TrashIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import type {
  AppNotification,
  NotificationType,
} from "../models/notification";

interface Props {
  notification: AppNotification;
  isProcessing?: boolean;

  onMarkAsRead: (
    notification: AppNotification,
  ) => void;

  onDelete: (
    notification: AppNotification,
  ) => void;
}

interface NotificationInformation {
  label: string;
  icon: typeof ChatBubbleLeftRightIcon;
  iconClassName: string;
  borderClassName: string;
}

const notificationInformation: Record<
  NotificationType,
  NotificationInformation
> = {
  message: {
    label: "Nuevo mensaje",
    icon: ChatBubbleLeftRightIcon,
    iconClassName:
      "bg-blue-500/10 text-blue-600",
    borderClassName:
      "border-blue-500/20",
  },

  application_received: {
    label: "Postulación recibida",
    icon: UserPlusIcon,
    iconClassName:
      "bg-primary/10 text-primary",
    borderClassName:
      "border-primary/20",
  },

  application_accepted: {
    label: "Postulación aceptada",
    icon: CheckBadgeIcon,
    iconClassName:
      "bg-success/10 text-success",
    borderClassName:
      "border-success/20",
  },

  application_rejected: {
    label: "Postulación rechazada",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/10 text-danger",
    borderClassName:
      "border-danger/20",
  },

  contract_request: {
    label: "Solicitud de contratación",
    icon: ClipboardDocumentListIcon,
    iconClassName:
      "bg-primary/10 text-primary",
    borderClassName:
      "border-primary/20",
  },

  contract_request_accepted: {
    label: "Solicitud aceptada",
    icon: CheckCircleIcon,
    iconClassName:
      "bg-success/10 text-success",
    borderClassName:
      "border-success/20",
  },

  contract_request_rejected: {
    label: "Solicitud rechazada",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/10 text-danger",
    borderClassName:
      "border-danger/20",
  },

  contract_request_canceled: {
    label: "Solicitud cancelada",
    icon: NoSymbolIcon,
    iconClassName:
      "bg-warning/10 text-warning",
    borderClassName:
      "border-warning/20",
  },

  contract_created: {
    label: "Contrato creado",
    icon: DocumentCheckIcon,
    iconClassName:
      "bg-blue-500/10 text-blue-600",
    borderClassName:
      "border-blue-500/20",
  },

  contract_completed: {
    label: "Contrato completado",
    icon: ClipboardDocumentCheckIcon,
    iconClassName:
      "bg-success/10 text-success",
    borderClassName:
      "border-success/20",
  },

  contract_canceled: {
    label: "Contrato cancelado",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/10 text-danger",
    borderClassName:
      "border-danger/20",
  },

  review_received: {
    label: "Reseña recibida",
    icon: StarIcon,
    iconClassName:
      "bg-warning/10 text-warning",
    borderClassName:
      "border-warning/20",
  },
};

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

function getRelativeTime(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference =
    date.getTime() - Date.now();

  const absoluteDifference =
    Math.abs(difference);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const formatter =
    new Intl.RelativeTimeFormat(
      "es-MX",
      {
        numeric: "auto",
      },
    );

  if (absoluteDifference < hour) {
    return formatter.format(
      Math.round(
        difference / minute,
      ),
      "minute",
    );
  }

  if (absoluteDifference < day) {
    return formatter.format(
      Math.round(
        difference / hour,
      ),
      "hour",
    );
  }

  if (
    absoluteDifference <
    day * 7
  ) {
    return formatter.format(
      Math.round(
        difference / day,
      ),
      "day",
    );
  }

  return "";
}

export default function NotificationCard({
  notification,
  isProcessing = false,
  onMarkAsRead,
  onDelete,
}: Props) {
  const information =
    notificationInformation[
      notification.type
    ];

  const NotificationIcon =
    information.icon;

  const relativeTime =
    getRelativeTime(
      notification.created_at,
    );

  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl border bg-surface p-5 shadow-card transition sm:p-6",
        notification.is_read
          ? "border-border opacity-80"
          : `${information.borderClassName} shadow-md`,
      ].join(" ")}
    >
      {!notification.is_read && (
        <span
          className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-primary"
          aria-label="Notificación no leída"
        />
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Icono */}
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            information.iconClassName,
          ].join(" ")}
        >
          <NotificationIcon className="h-6 w-6" />
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 pr-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-text">
                  {information.label}
                </h2>

                {!notification.is_read && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Nueva
                  </span>
                )}
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-text-muted">
                {notification.message}
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              {relativeTime && (
                <p className="text-xs font-medium text-primary">
                  {relativeTime}
                </p>
              )}

              <p
                className="mt-1 text-xs text-text-muted"
                title={formatDateTime(
                  notification.created_at,
                )}
              >
                {formatDateTime(
                  notification.created_at,
                )}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
            {!notification.is_read && (
              <button
                type="button"
                onClick={() =>
                  onMarkAsRead(
                    notification,
                  )
                }
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                ) : (
                  <EnvelopeOpenIcon className="h-5 w-5" />
                )}

                Marcar como leída
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onDelete(
                  notification,
                )
              }
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <TrashIcon className="h-5 w-5" />

              Eliminar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}