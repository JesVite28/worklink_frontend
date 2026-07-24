import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

import type {
  ReviewRatingFilter,
} from "../hooks/useReviews";

import type {
  ReviewTypeFilter,
} from "../models/review";

interface Props {
  typeFilter: ReviewTypeFilter;

  ratingFilter: ReviewRatingFilter;

  perPage: number;

  totalResults: number;

  isLoading?: boolean;

  hasActiveFilters?: boolean;

  onTypeFilterChange: (
    value: ReviewTypeFilter,
  ) => void;

  onRatingFilterChange: (
    value: ReviewRatingFilter,
  ) => void;

  onPerPageChange: (
    value: number,
  ) => void;

  onResetFilters: () => void;
}

const typeOptions: Array<{
  value: ReviewTypeFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Todas",
  },
  {
    value: "received",
    label: "Recibidas",
  },
  {
    value: "given",
    label: "Enviadas",
  },
];

const ratingOptions: Array<{
  value: ReviewRatingFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Todas las calificaciones",
  },
  {
    value: 5,
    label: "5 estrellas",
  },
  {
    value: 4,
    label: "4 estrellas",
  },
  {
    value: 3,
    label: "3 estrellas",
  },
  {
    value: 2,
    label: "2 estrellas",
  },
  {
    value: 1,
    label: "1 estrella",
  },
];

export default function ReviewFilters({
  typeFilter,
  ratingFilter,
  perPage,
  totalResults,
  isLoading = false,
  hasActiveFilters = false,
  onTypeFilterChange,
  onRatingFilterChange,
  onPerPageChange,
  onResetFilters,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-5">
        {/* Encabezado */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-text">
                Filtrar calificaciones
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                {totalResults === 1
                  ? "1 calificación encontrada"
                  : `${totalResults} calificaciones encontradas`}
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowPathIcon className="h-4 w-4" />

              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tipo de reseña */}
        <div>
          <p className="mb-3 text-sm font-semibold text-text">
            Tipo de calificación
          </p>

          <div className="flex flex-wrap gap-2">
            {typeOptions.map(
              (option) => {
                const isActive =
                  typeFilter ===
                  option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      onTypeFilterChange(
                        option.value,
                      )
                    }
                    disabled={
                      isLoading
                    }
                    className={[
                      "rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "bg-background text-text-muted hover:bg-primary/10 hover:text-primary",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Selectores */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Calificación */}
          <div>
            <label
              htmlFor="review-rating-filter"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Calificación
            </label>

            <div className="relative">
              <StarIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-warning" />

              <select
                id="review-rating-filter"
                value={
                  ratingFilter
                }
                onChange={(
                  event,
                ) => {
                  const value =
                    event.target
                      .value;

                  onRatingFilterChange(
                    value === "all"
                      ? "all"
                      : (Number(
                          value,
                        ) as ReviewRatingFilter),
                  );
                }}
                disabled={isLoading}
                className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-12 pr-10 text-sm font-medium text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ratingOptions.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>

              <FunnelIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          {/* Resultados por página */}
          <div>
            <label
              htmlFor="reviews-per-page"
              className="mb-2 block text-sm font-semibold text-text"
            >
              Resultados por página
            </label>

            <select
              id="reviews-per-page"
              value={perPage}
              onChange={(event) =>
                onPerPageChange(
                  Number(
                    event.target
                      .value,
                  ),
                )
              }
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={6}>
                6 resultados
              </option>

              <option value={12}>
                12 resultados
              </option>

              <option value={18}>
                18 resultados
              </option>

              <option value={24}>
                24 resultados
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}