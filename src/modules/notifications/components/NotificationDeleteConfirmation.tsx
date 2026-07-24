import {
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import type {
  AppNotification,
} from "../models/notification";

interface Props {
  notification:
    | AppNotification
    | null;

  isProcessing: boolean;

  onClose: () => void;

  onConfirm: () => Promise<boolean>;
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

export default function NotificationDeleteConfirmation({
  notification,
  isProcessing,
  onClose,
  onConfirm,
}: Props) {
  const isOpen =
    notification !== null;

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
        !isProcessing
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
    isProcessing,
    onClose,
  ]);

  if (
    !notification ||
    typeof document === "undefined"
  ) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isProcessing) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-notification-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <TrashIcon className="h-7 w-7" />
            </div>

            <div>
              <h2
                id="delete-notification-title"
                className="text-xl font-bold text-text"
              >
                ¿Eliminar esta notificación?
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                La notificación se eliminará definitivamente de tu cuenta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar confirmación"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <section className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Notificación
                </p>

                <p className="mt-1 text-sm font-semibold text-text">
                  #{notification.id}
                </p>
              </div>

              <span
                className={[
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  notification.is_read
                    ? "bg-background text-text-muted"
                    : "bg-primary/10 text-primary",
                ].join(" ")}
              >
                {notification.is_read
                  ? "Leída"
                  : "No leída"}
              </span>
            </div>

            <p className="mt-4 line-clamp-4 whitespace-pre-wrap border-t border-border pt-4 text-sm leading-6 text-text-muted">
              {notification.message}
            </p>

            <p className="mt-4 text-xs text-text-muted">
              Recibida el{" "}
              {formatDateTime(
                notification.created_at,
              )}
            </p>
          </section>

          <section className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

            <p className="text-sm leading-6 text-text-muted">
              Esta acción no se puede deshacer.
            </p>
          </section>
        </div>

        {/* Acciones */}
        <footer className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regresar
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <TrashIcon className="h-5 w-5" />
            )}

            {isProcessing
              ? "Eliminando..."
              : "Sí, eliminar"}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}