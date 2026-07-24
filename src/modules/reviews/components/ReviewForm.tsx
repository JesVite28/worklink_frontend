import {
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { createPortal } from "react-dom";

import ReviewStars from "./ReviewStars";

import type {
  CreateReviewPayload,
  Review,
  ReviewRating,
  UpdateReviewPayload,
} from "../models/review";

interface Props {
  isOpen: boolean;

  contractId:
    | number
    | null;

  review:
    | Review
    | null;

  evaluatedUserName?: string;

  isSaving: boolean;

  onClose: () => void;

  onCreate: (
    payload: CreateReviewPayload,
  ) => Promise<boolean>;

  onUpdate: (
    reviewId: number,
    payload: UpdateReviewPayload,
  ) => Promise<boolean>;
}

const MAX_COMMENT_LENGTH = 3000;

export default function ReviewForm({
  isOpen,
  contractId,
  review,
  evaluatedUserName,
  isSaving,
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const isEditing =
    review !== null;

  const [
    rating,
    setRating,
  ] = useState<ReviewRating | 0>(
    0,
  );

  const [
    comment,
    setComment,
  ] = useState("");

  const [
    validationError,
    setValidationError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Inicializar formulario
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (review) {
      setRating(review.rating);
      setComment(
        review.comment ?? "",
      );
    } else {
      setRating(0);
      setComment("");
    }

    setValidationError(null);
  }, [
    isOpen,
    review,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Bloquear desplazamiento y cerrar con Escape
  |--------------------------------------------------------------------------
  */

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
        !isSaving
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
    isSaving,
    onClose,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Enviar formulario
  |--------------------------------------------------------------------------
  */

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      if (isSaving) {
        return;
      }

      if (rating === 0) {
        setValidationError(
          "Selecciona una calificación entre una y cinco estrellas.",
        );

        return;
      }

      const normalizedComment =
        comment.trim();

      if (
        normalizedComment.length >
        MAX_COMMENT_LENGTH
      ) {
        setValidationError(
          `El comentario no puede superar los ${MAX_COMMENT_LENGTH} caracteres.`,
        );

        return;
      }

      setValidationError(null);

      let wasSuccessful = false;

      if (isEditing && review) {
        wasSuccessful =
          await onUpdate(
            review.id,
            {
              rating,
              comment:
                normalizedComment ||
                null,
            },
          );
      } else {
        if (!contractId) {
          setValidationError(
            "No se encontró el contrato que deseas calificar.",
          );

          return;
        }

        wasSuccessful =
          await onCreate({
            contract_id:
              contractId,

            rating,

            comment:
              normalizedComment ||
              null,
          });
      }

      if (wasSuccessful) {
        onClose();
      }
    };

  if (
    !isOpen ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const remainingCharacters =
    MAX_COMMENT_LENGTH -
    comment.length;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isSaving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-form-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warning/15 text-warning">
              {isEditing ? (
                <PencilSquareIcon className="h-7 w-7" />
              ) : (
                <StarIcon className="h-7 w-7" />
              )}
            </div>

            <div>
              <h2
                id="review-form-title"
                className="text-xl font-bold text-text"
              >
                {isEditing
                  ? "Editar calificación"
                  : "Publicar calificación"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isEditing
                  ? "Modifica la calificación o el comentario que publicaste."
                  : evaluatedUserName
                    ? `Comparte tu experiencia trabajando con ${evaluatedUserName}.`
                    : "Comparte tu experiencia con el otro participante del contrato."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar formulario"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Formulario */}
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
            {/* Calificación */}
            <section>
              <label className="block text-sm font-semibold text-text">
                Calificación
                <span className="ml-1 text-danger">
                  *
                </span>
              </label>

              <p className="mt-1 text-sm text-text-muted">
                Selecciona el número de estrellas que representa tu experiencia.
              </p>

              <div className="mt-4 rounded-2xl border border-border bg-background p-5">
                <ReviewStars
                  value={rating}
                  editable
                  disabled={isSaving}
                  size="lg"
                  showLabel
                  onChange={(
                    selectedRating,
                  ) => {
                    setRating(
                      selectedRating,
                    );

                    setValidationError(
                      null,
                    );
                  }}
                />
              </div>
            </section>

            {/* Comentario */}
            <section>
              <label
                htmlFor="review-comment"
                className="block text-sm font-semibold text-text"
              >
                Comentario
                <span className="ml-2 font-normal text-text-muted">
                  Opcional
                </span>
              </label>

              <p className="mt-1 text-sm text-text-muted">
                Describe la calidad del trabajo, comunicación y cumplimiento.
              </p>

              <div className="relative mt-3">
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-text-muted" />

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    if (
                      value.length <=
                      MAX_COMMENT_LENGTH
                    ) {
                      setComment(value);
                      setValidationError(
                        null,
                      );
                    }
                  }}
                  disabled={isSaving}
                  rows={6}
                  maxLength={
                    MAX_COMMENT_LENGTH
                  }
                  placeholder="Escribe un comentario sobre tu experiencia..."
                  className="min-h-36 w-full resize-y rounded-2xl border border-border bg-background py-4 pl-12 pr-4 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <span
                  className={[
                    "text-xs",
                    remainingCharacters <
                    100
                      ? "font-semibold text-warning"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  {remainingCharacters} caracteres disponibles
                </span>
              </div>
            </section>

            {/* Error */}
            {validationError && (
              <div
                role="alert"
                className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm leading-6 text-danger"
              >
                {validationError}
              </div>
            )}

            {/* Información */}
            <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm leading-6 text-text-muted">
                Solo puedes calificar contratos completados. La reseña será visible para el usuario evaluado y podrá contribuir a su promedio público.
              </p>
            </section>
          </div>

          {/* Acciones */}
          <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                isSaving ||
                rating === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : isEditing ? (
                <PencilSquareIcon className="h-5 w-5" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}

              {isSaving
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Publicar calificación"}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}