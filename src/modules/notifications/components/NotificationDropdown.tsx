import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  NoSymbolIcon,
  StarIcon,
  UserPlusIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

import type {
  AppNotification,
  NotificationType,
} from "../models/notification";

type DropdownFilter =
  | "all"
  | "unread";

interface Props {
  isOpen: boolean;
  onClose: () => void;

  onUnreadCountChange?: (
    count: number,
  ) => void;
}

interface NotificationInformation {
  label: string;
  icon: typeof BellIcon;
  iconClassName: string;
}

const notificationInformation: Record<
  NotificationType,
  NotificationInformation
> = {
  message: {
    label: "Nuevo mensaje",
    icon: ChatBubbleLeftRightIcon,
    iconClassName:
      "bg-blue-500/15 text-blue-600",
  },

  application_received: {
    label: "Postulación recibida",
    icon: UserPlusIcon,
    iconClassName:
      "bg-primary/15 text-primary",
  },

  application_accepted: {
    label: "Postulación aceptada",
    icon: CheckBadgeIcon,
    iconClassName:
      "bg-success/15 text-success",
  },

  application_rejected: {
    label: "Postulación rechazada",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/15 text-danger",
  },

  contract_request: {
    label: "Solicitud de contratación",
    icon: ClipboardDocumentListIcon,
    iconClassName:
      "bg-primary/15 text-primary",
  },

  contract_request_accepted: {
    label: "Solicitud aceptada",
    icon: CheckCircleIcon,
    iconClassName:
      "bg-success/15 text-success",
  },

  contract_request_rejected: {
    label: "Solicitud rechazada",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/15 text-danger",
  },

  contract_request_canceled: {
    label: "Solicitud cancelada",
    icon: NoSymbolIcon,
    iconClassName:
      "bg-warning/15 text-warning",
  },

  contract_created: {
    label: "Contrato creado",
    icon: DocumentCheckIcon,
    iconClassName:
      "bg-blue-500/15 text-blue-600",
  },

  contract_completed: {
    label: "Contrato completado",
    icon: ClipboardDocumentCheckIcon,
    iconClassName:
      "bg-success/15 text-success",
  },

  contract_canceled: {
    label: "Contrato cancelado",
    icon: XCircleIcon,
    iconClassName:
      "bg-danger/15 text-danger",
  },

  review_received: {
    label: "Reseña recibida",
    icon: StarIcon,
    iconClassName:
      "bg-warning/15 text-warning",
  },
};

function getNotificationRoute(
  type: NotificationType,
): string {
  if (type === "message") {
    return "/dashboard/mensajes";
  }

  if (
    type.startsWith(
      "application_",
    )
  ) {
    return "/dashboard/postulaciones";
  }

  if (
    type.startsWith(
      "contract_request",
    )
  ) {
    return "/dashboard/solicitudes";
  }

  if (
    type.startsWith("contract_")
  ) {
    return "/dashboard/contratos";
  }

  return "/dashboard/notificaciones";
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
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

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

  if (absoluteDifference < week) {
    return formatter.format(
      Math.round(
        difference / day,
      ),
      "day",
    );
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
    },
  ).format(date);
}

export default function NotificationDropdown({
  isOpen,
  onClose,
  onUnreadCountChange,
}: Props) {
  const navigate = useNavigate();

  const [
    notifications,
    setNotifications,
  ] = useState<AppNotification[]>(
    [],
  );

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<DropdownFilter>(
    "all",
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    processingId,
    setProcessingId,
  ] = useState<number | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Actualizar contador local y externo
  |--------------------------------------------------------------------------
  */

  const updateUnreadCount =
    useCallback(
      (count: number): void => {
        const safeCount = Math.max(
          count,
          0,
        );

        setUnreadCount(safeCount);

        onUnreadCountChange?.(
          safeCount,
        );
      },
      [onUnreadCountChange],
    );

  /*
  |--------------------------------------------------------------------------
  | Cargar notificaciones
  |--------------------------------------------------------------------------
  */

  const loadNotifications =
    useCallback(async (): Promise<void> => {
      if (!isOpen) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response =
          await getNotifications({
            is_read:
              activeFilter ===
              "unread"
                ? 0
                : undefined,

            page: 1,
            per_page: 15,
          });

        setNotifications(
          response.data.notifications,
        );

        updateUnreadCount(
          response.data.unread_count,
        );
      } catch {
        setError(
          "No se pudieron cargar las notificaciones.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      activeFilter,
      isOpen,
      updateUnreadCount,
    ]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  /*
  |--------------------------------------------------------------------------
  | Actualización automática mientras está abierto
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        void loadNotifications();
      }, 30000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    isOpen,
    loadNotifications,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Escape
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Abrir notificación
  |--------------------------------------------------------------------------
  */

  const handleNotificationClick =
    async (
      notification: AppNotification,
    ): Promise<void> => {
      if (processingId !== null) {
        return;
      }

      try {
        if (!notification.is_read) {
          setProcessingId(
            notification.id,
          );

          const updatedNotification =
            await markNotificationAsRead(
              notification.id,
            );

          setNotifications(
            (currentNotifications) =>
              activeFilter ===
              "unread"
                ? currentNotifications.filter(
                    (
                      currentNotification,
                    ) =>
                      currentNotification.id !==
                      notification.id,
                  )
                : currentNotifications.map(
                    (
                      currentNotification,
                    ) =>
                      currentNotification.id ===
                      updatedNotification.id
                        ? updatedNotification
                        : currentNotification,
                  ),
          );

          updateUnreadCount(
            unreadCount - 1,
          );
        }

        onClose();

        navigate(
          getNotificationRoute(
            notification.type,
          ),
        );
      } catch {
        setError(
          "No se pudo abrir la notificación.",
        );
      } finally {
        setProcessingId(null);
      }
    };

  const displayedNotifications =
    useMemo(
      () => notifications,
      [notifications],
    );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Fondo invisible para cerrar */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-[998]"
        aria-label="Cerrar notificaciones"
      />

      <section
        role="dialog"
        aria-modal="false"
        aria-label="Notificaciones"
        className="fixed inset-x-3 top-[5.5rem] z-[999] flex max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:left-auto sm:right-4 sm:w-[420px] lg:right-8"
      >
        {/* Encabezado */}
        <header className="shrink-0 border-b border-border px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text">
                Notificaciones
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {unreadCount === 1
                  ? "Tienes una notificación sin leer"
                  : `Tienes ${unreadCount} notificaciones sin leer`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-text-muted transition hover:text-text"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Pestañas */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveFilter("all")
              }
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-background text-text-muted hover:text-primary",
              ].join(" ")}
            >
              Todas
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveFilter(
                  "unread",
                )
              }
              className={[
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                activeFilter ===
                "unread"
                  ? "bg-primary text-white"
                  : "bg-background text-text-muted hover:text-primary",
              ].join(" ")}
            >
              No leídas

              {unreadCount > 0 && (
                <span
                  className={[
                    "flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    activeFilter ===
                    "unread"
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary",
                  ].join(" ")}
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <article
                  key={index}
                  className="flex animate-pulse gap-3 rounded-xl p-3"
                >
                  <div className="h-14 w-14 shrink-0 rounded-full bg-border" />

                  <div className="flex-1 py-1">
                    <div className="h-4 w-36 rounded bg-border" />

                    <div className="mt-3 h-3 w-full rounded bg-border" />

                    <div className="mt-2 h-3 w-2/3 rounded bg-border" />
                  </div>
                </article>
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
                <XCircleIcon className="h-7 w-7" />
              </div>

              <p className="mt-4 font-semibold text-text">
                No se pudieron cargar
              </p>

              <p className="mt-2 text-sm text-text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void loadNotifications();
                }}
                className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : displayedNotifications.length ===
            0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BellIcon className="h-8 w-8" />
              </div>

              <p className="mt-4 font-semibold text-text">
                {activeFilter ===
                "unread"
                  ? "No tienes notificaciones sin leer"
                  : "No tienes notificaciones"}
              </p>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Las novedades de tu cuenta aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedNotifications.map(
                (notification) => {
                  const information =
                    notificationInformation[
                      notification.type
                    ];

                  const NotificationIcon =
                    information.icon;

                  const isProcessing =
                    processingId ===
                    notification.id;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        void handleNotificationClick(
                          notification,
                        );
                      }}
                      disabled={
                        isProcessing
                      }
                      className={[
                        "group flex w-full items-start gap-3 rounded-xl p-3 text-left transition disabled:cursor-wait disabled:opacity-60",
                        notification.is_read
                          ? "hover:bg-background"
                          : "bg-primary/5 hover:bg-primary/10",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                          information.iconClassName,
                        ].join(" ")}
                      >
                        {isProcessing ? (
                          <span className="h-6 w-6 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                        ) : (
                          <NotificationIcon className="h-7 w-7" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-text">
                          {
                            information.label
                          }
                        </span>

                        <span
                          className={[
                            "mt-1 block text-sm leading-5",
                            notification.is_read
                              ? "text-text-muted"
                              : "font-medium text-text",
                          ].join(" ")}
                        >
                          {notification.message}
                        </span>

                        <span className="mt-1.5 block text-xs font-semibold text-primary">
                          {getRelativeTime(
                            notification.created_at,
                          )}
                        </span>
                      </span>

                      {!notification.is_read && (
                        <span className="mt-5 h-3 w-3 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>

        {/* Ver todas */}
        <footer className="shrink-0 border-t border-border p-3">
          <button
            type="button"
            onClick={() => {
              onClose();

              navigate(
                "/dashboard/notificaciones",
              );
            }}
            className="w-full rounded-xl bg-background px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            Ver todas las notificaciones
          </button>
        </footer>
      </section>
    </>
  );
}