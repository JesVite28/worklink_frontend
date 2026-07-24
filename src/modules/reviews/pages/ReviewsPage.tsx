import {
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../context/useAuth";

import ReviewCard from "../components/ReviewCard";
import ReviewDeleteConfirmation from "../components/ReviewDeleteConfirmation";
import ReviewFilters from "../components/ReviewFilters";
import ReviewForm from "../components/ReviewForm";
import ReviewPagination from "../components/ReviewPagination";

import useReviews from "../hooks/useReviews";

import type {
  ReviewUser,
} from "../models/review";

/*
|--------------------------------------------------------------------------
| Nombre completo
|--------------------------------------------------------------------------
*/

function getUserFullName(
  user: ReviewUser | null,
): string {
  if (!user) {
    return "Usuario";
  }

  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

/*
|--------------------------------------------------------------------------
| Página de reseñas
|--------------------------------------------------------------------------
*/

export default function ReviewsPage() {
  const { user } = useAuth();

  const {
    reviews,
    pagination,

    selectedReview,
    reviewToDelete,

    typeFilter,
    ratingFilter,
    perPage,

    isLoading,
    isRefreshing,
    isSaving,
    error,

    hasReviews,
    hasActiveFilters,
    totalReviews,

    handleTypeFilterChange,
    handleRatingFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    selectReview,
    clearSelectedReview,

    handleCreateReview,
    handleUpdateReview,

    requestDeleteReview,
    closeDeleteConfirmation,
    confirmDeleteReview,

    reloadReviews,
    isProcessingReview,
  } = useReviews();

  const currentUserId =
    user?.id !== undefined &&
    user?.id !== null
      ? Number(user.id)
      : null;

  const isDeleting =
    reviewToDelete !== null &&
    isProcessingReview(
      reviewToDelete.id,
    );

  const selectedUserName =
    selectedReview
      ? getUserFullName(
          selectedReview.evaluated,
        )
      : undefined;

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <StarIcon className="h-8 w-8" />
              </div>

              <div>
                <p className="text-sm font-medium text-white/80">
                  Reputación en WorkLink
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Reseñas y calificaciones
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                  Consulta las calificaciones que has recibido y las que
                  publicaste después de completar un contrato.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />

                    {totalReviews === 1
                      ? "1 calificación relacionada"
                      : `${totalReviews} calificaciones relacionadas`}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void reloadReviews();
              }}
              disabled={
                isLoading ||
                isRefreshing ||
                isSaving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowPathIcon
                className={[
                  "h-5 w-5",
                  isRefreshing
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />

              {isRefreshing
                ? "Actualizando..."
                : "Actualizar"}
            </button>
          </div>
        </section>

        {/* Filtros */}
        <ReviewFilters
          typeFilter={typeFilter}
          ratingFilter={
            ratingFilter
          }
          perPage={perPage}
          totalResults={
            pagination?.total ?? 0
          }
          isLoading={
            isLoading ||
            isRefreshing
          }
          hasActiveFilters={
            hasActiveFilters
          }
          onTypeFilterChange={
            handleTypeFilterChange
          }
          onRatingFilterChange={
            handleRatingFilterChange
          }
          onPerPageChange={
            handlePerPageChange
          }
          onResetFilters={
            resetFilters
          }
        />

        {/* Error */}
        {error && (
          <section className="rounded-2xl border border-danger/30 bg-danger/5 px-5 py-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <ExclamationTriangleIcon className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-text">
              No se pudieron cargar las calificaciones
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void reloadReviews();
              }}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />

              Intentar de nuevo
            </button>
          </section>
        )}

        {/* Carga inicial */}
        {!error &&
          isLoading && (
            <section className="grid gap-5 xl:grid-cols-2">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <article
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="border-b border-border p-5 sm:p-6">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-full bg-border" />

                      <div className="flex-1">
                        <div className="h-3 w-36 rounded bg-border" />

                        <div className="mt-3 h-5 w-48 max-w-full rounded bg-border" />

                        <div className="mt-2 h-3 w-24 rounded bg-border" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="h-4 w-full rounded bg-border" />

                    <div className="h-4 w-3/4 rounded bg-border" />

                    <div className="h-20 rounded-xl bg-border" />

                    <div className="flex justify-end gap-2 border-t border-border pt-4">
                      <div className="h-10 w-24 rounded-xl bg-border" />

                      <div className="h-10 w-24 rounded-xl bg-border" />
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

        {/* Actualización */}
        {!error &&
          !isLoading &&
          isRefreshing && (
            <section className="flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-6 shadow-card">
              <div className="flex items-center gap-3 text-text-muted">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

                <p className="text-sm font-medium">
                  Actualizando calificaciones...
                </p>
              </div>
            </section>
          )}

        {/* Sin resultados */}
        {!error &&
          !isLoading &&
          !isRefreshing &&
          !hasReviews && (
            <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-14 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15 text-warning">
                <StarIcon className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                {hasActiveFilters
                  ? "No hay resultados"
                  : "Todavía no tienes calificaciones"}
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                {hasActiveFilters
                  ? "No encontramos reseñas que coincidan con los filtros seleccionados."
                  : "Cuando completes un contrato podrás calificar al otro participante y recibir una calificación."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Limpiar filtros
                </button>
              )}
            </section>
          )}

        {/* Listado */}
        {!error &&
          !isLoading &&
          !isRefreshing &&
          hasReviews && (
            <section className="grid gap-5 xl:grid-cols-2">
              {reviews.map(
                (review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={
                      currentUserId
                    }
                    isProcessing={isProcessingReview(
                      review.id,
                    )}
                    onEdit={
                      selectReview
                    }
                    onDelete={
                      requestDeleteReview
                    }
                  />
                ),
              )}
            </section>
          )}

        {/* Paginación */}
        {!error &&
          !isLoading && (
            <ReviewPagination
              pagination={
                pagination
              }
              isLoading={
                isRefreshing
              }
              onPageChange={
                handlePageChange
              }
            />
          )}
      </div>

      {/* Formulario de edición */}
      <ReviewForm
        isOpen={
          selectedReview !== null
        }
        contractId={
          selectedReview?.contract_id ??
          null
        }
        review={
          selectedReview
        }
        evaluatedUserName={
          selectedUserName
        }
        isSaving={isSaving}
        onClose={
          clearSelectedReview
        }
        onCreate={
          handleCreateReview
        }
        onUpdate={
          handleUpdateReview
        }
      />

      {/* Confirmación de eliminación */}
      <ReviewDeleteConfirmation
        review={
          reviewToDelete
        }
        isProcessing={
          isDeleting
        }
        onClose={
          closeDeleteConfirmation
        }
        onConfirm={
          confirmDeleteReview
        }
      />
    </>
  );
}