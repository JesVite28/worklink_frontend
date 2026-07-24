import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import type { ContractRequestPagination as PaginationData } from "../models/contractRequest";

interface Props {
  pagination: PaginationData | null;
  isLoading: boolean;

  onPageChange: (
    page: number,
  ) => void;
}

type PaginationItem =
  | number
  | "start-ellipsis"
  | "end-ellipsis";

function getPaginationItems(
  currentPage: number,
  lastPage: number,
): PaginationItem[] {
  if (lastPage <= 7) {
    return Array.from(
      { length: lastPage },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "end-ellipsis",
      lastPage,
    ];
  }

  if (currentPage >= lastPage - 3) {
    return [
      1,
      "start-ellipsis",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    lastPage,
  ];
}

export default function ContractRequestPagination({
  pagination,
  isLoading,
  onPageChange,
}: Props) {
  if (
    !pagination ||
    pagination.total === 0
  ) {
    return null;
  }

  const {
    current_page: currentPage,
    last_page: lastPage,
    from,
    to,
    total,
  } = pagination;

  const paginationItems =
    getPaginationItems(
      currentPage,
      lastPage,
    );

  const canGoPrevious =
    currentPage > 1 && !isLoading;

  const canGoNext =
    currentPage < lastPage &&
    !isLoading;

  return (
    <section className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-card sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Información */}
        <div className="text-center text-sm text-text-muted lg:text-left">
          Mostrando{" "}
          <span className="font-semibold text-text">
            {from ?? 0}
          </span>{" "}
          a{" "}
          <span className="font-semibold text-text">
            {to ?? 0}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-text">
            {total}
          </span>{" "}
          {total === 1
            ? "solicitud"
            : "solicitudes"}
        </div>

        {/* Navegación */}
        <nav
          aria-label="Paginación de solicitudes"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() =>
              onPageChange(
                currentPage - 1,
              )
            }
            disabled={!canGoPrevious}
            aria-label="Página anterior"
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-border bg-background px-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeftIcon className="h-4 w-4" />

            <span className="hidden sm:inline">
              Anterior
            </span>
          </button>

          {paginationItems.map(
            (item, index) => {
              if (
                item ===
                  "start-ellipsis" ||
                item === "end-ellipsis"
              ) {
                return (
                  <span
                    key={`${item}-${index}`}
                    className="flex h-10 w-8 items-center justify-center text-sm text-text-muted"
                  >
                    …
                  </span>
                );
              }

              const isCurrentPage =
                item === currentPage;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onPageChange(item)
                  }
                  disabled={
                    isLoading ||
                    isCurrentPage
                  }
                  aria-current={
                    isCurrentPage
                      ? "page"
                      : undefined
                  }
                  aria-label={`Ir a la página ${item}`}
                  className={[
                    "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition",
                    isCurrentPage
                      ? "border-primary bg-primary text-white shadow-soft"
                      : "border-border bg-background text-text hover:border-primary/40 hover:text-primary",
                    isLoading &&
                    !isCurrentPage
                      ? "cursor-not-allowed opacity-50"
                      : "",
                  ].join(" ")}
                >
                  {item}
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={() =>
              onPageChange(
                currentPage + 1,
              )
            }
            disabled={!canGoNext}
            aria-label="Página siguiente"
            className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-border bg-background px-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">
              Siguiente
            </span>

            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>

        {/* Página actual */}
        <p className="text-center text-xs text-text-muted lg:text-right">
          Página{" "}
          <span className="font-semibold text-text">
            {currentPage}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-text">
            {lastPage}
          </span>
        </p>
      </div>
    </section>
  );
}