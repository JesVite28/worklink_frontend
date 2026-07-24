import {
  ExclamationTriangleIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

import ReviewStars from "./ReviewStars";

import type {
  Review,
  ReviewUser,
} from "../models/review";

interface Props {
  review: Review | null;

  isProcessing: boolean;

  onClose: () => void;

  onConfirm: () => Promise<boolean>;
}

function getUserFullName(
  user: ReviewUser | null,
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

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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

export default function ReviewDeleteConfirmation({
  review,
  isProcessing,
  onClose,
  onConfirm,
}: Props) {
  const isOpen =
    review !== null;

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
    !review ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const evaluatedUserName =
    getUserFullName(
      review.evaluated,
    );

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
        aria-labelledby="delete-review-title"
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
                id="delete-review-title"
                className="text-xl font-bold text-text"
              >
                ¿Eliminar esta calificación?
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                La reseña se eliminará definitivamente de tu cuenta.
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

        {/* Información de la reseña */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <section className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Calificación enviada a
                </p>

                <p className="mt-1 truncate font-semibold text-text">
                  {evaluatedUserName}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <StarIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <ReviewStars
                value={review.rating}
                size="md"
                showValue
                showLabel
              />
            </div>

            {review.comment ? (
              <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
                “{review.comment}”
              </p>
            ) : (
              <p className="mt-4 text-sm italic text-text-muted">
                Esta calificación no incluye un comentario.
              </p>
            )}

            <div className="mt-4 grid gap-2 border-t border-border pt-4 text-xs text-text-muted sm:grid-cols-2">
              <p>
                Contrato{" "}
                <span className="font-semibold text-text">
                  #{review.contract_id}
                </span>
              </p>

              <p className="sm:text-right">
                {formatDate(
                  review.created_at,
                )}
              </p>
            </div>
          </section>

          {/* Advertencia */}
          <section className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4">
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

            <div>
              <p className="text-sm font-semibold text-danger">
                Esta acción no se puede deshacer
              </p>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                La calificación dejará de aparecer en el perfil del usuario y su promedio será recalculado.
              </p>
            </div>
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