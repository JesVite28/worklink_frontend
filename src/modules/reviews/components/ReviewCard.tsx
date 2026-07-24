import {
  BriefcaseIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import ReviewStars from "./ReviewStars";

import type {
  Review,
  ReviewUser,
} from "../models/review";

interface Props {
  review: Review;

  currentUserId?: number | null;

  isProcessing?: boolean;

  onEdit?: (
    review: Review,
  ) => void;

  onDelete?: (
    review: Review,
  ) => void;
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

function getUserInitials(
  user: ReviewUser | null,
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

function getRoleLabel(
  role: string | null | undefined,
): string {
  switch (role) {
    case "freelancer":
      return "Freelancer";

    case "empresa":
      return "Empresa";

    case "cliente":
      return "Cliente";

    case "admin":
      return "Administrador";

    default:
      return "Usuario";
  }
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

export default function ReviewCard({
  review,
  currentUserId = null,
  isProcessing = false,
  onEdit,
  onDelete,
}: Props) {
  const isGivenReview =
    currentUserId !== null &&
    review.evaluator_id ===
      currentUserId;

  const relatedUser =
    isGivenReview
      ? review.evaluated
      : review.evaluator;

  const relatedUserName =
    getUserFullName(
      relatedUser,
    );

  const relatedUserInitials =
    getUserInitials(
      relatedUser,
    );

  const profilePhoto =
    relatedUser?.profile_photo_url ??
    null;

  const canModify =
    isGivenReview;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:border-primary/30 hover:shadow-lg">
      {/* Encabezado */}
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Foto */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 font-semibold text-primary">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={`Perfil de ${relatedUserName}`}
                className="h-full w-full object-cover"
              />
            ) : relatedUserInitials ? (
              relatedUserInitials
            ) : (
              <UserCircleIcon className="h-9 w-9" />
            )}
          </div>

          {/* Usuario */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {isGivenReview
                    ? "Calificación enviada a"
                    : "Calificación recibida de"}
                </p>

                <h2 className="mt-1 truncate text-lg font-semibold text-text">
                  {relatedUserName}
                </h2>

                <p className="mt-0.5 text-sm text-text-muted">
                  {getRoleLabel(
                    relatedUser?.role,
                  )}
                </p>
              </div>

              <ReviewStars
                value={
                  review.rating
                }
                size="md"
                showValue
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="space-y-4 p-5 sm:p-6">
        {review.comment ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-text">
            “{review.comment}”
          </p>
        ) : (
          <p className="text-sm italic text-text-muted">
            Esta calificación no incluye un comentario.
          </p>
        )}

        {/* Información relacionada */}
        <div className="grid gap-3 rounded-xl bg-background p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-medium text-text-muted">
                Servicio
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-text">
                {review.service?.title ??
                  "Contrato directo"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-xs font-medium text-text-muted">
                Fecha
              </p>

              <p className="mt-1 text-sm font-semibold text-text">
                {formatDate(
                  review.created_at,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-text-muted">
            Contrato #
            {review.contract_id}
          </p>

          {canModify && (
            <div className="flex flex-wrap gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() =>
                    onEdit(review)
                  }
                  disabled={
                    isProcessing
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PencilSquareIcon className="h-4 w-4" />

                  Editar
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() =>
                    onDelete(review)
                  }
                  disabled={
                    isProcessing
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}

                  {isProcessing
                    ? "Procesando..."
                    : "Eliminar"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}