import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import type { ApplicationPagination } from "../models/application";

interface Props {
  pagination: ApplicationPagination | null;
  isLoading: boolean;

  onPageChange: (page: number) => void;
}

type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

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
      "ellipsis-end",
      lastPage,
    ];
  }

  if (currentPage >= lastPage - 3) {
    return [
      1,
      "ellipsis-start",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    lastPage,
  ];
}

export default function MyApplicationPagination({
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
    total,
    from,
    to,
  } = pagination;

  const paginationItems =
    getPaginationItems(
      currentPage,
      lastPage,
    );

  const canGoPrevious =
    currentPage > 1 && !isLoading;

  const canGoNext =
    currentPage < lastPage && !isLoading;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
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
            ? "postulación"
            : "postulaciones"}
        </div>

        {/* Navegación */}
        <nav
          aria-label="Paginación de postulaciones"
          className="flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            disabled={!canGoPrevious}
            aria-label="Ir a la página anterior"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
          >
            <ChevronLeftIcon className="h-5 w-5" />

            <span className="hidden sm:inline">
              Anterior
            </span>
          </button>

          {/* Números en escritorio */}
          <div className="hidden items-center gap-2 sm:flex">
            {paginationItems.map(
              (item) => {
                if (
                  item ===
                    "ellipsis-start" ||
                  item === "ellipsis-end"
                ) {
                  return (
                    <span
                      key={item}
                      className="flex h-10 w-8 items-center justify-center text-sm text-text-muted"
                      aria-hidden="true"
                    >
                      …
                    </span>
                  );
                }

                const isCurrent =
                  item === currentPage;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      onPageChange(item)
                    }
                    disabled={
                      isLoading || isCurrent
                    }
                    aria-label={`Ir a la página ${item}`}
                    aria-current={
                      isCurrent
                        ? "page"
                        : undefined
                    }
                    className={[
                      "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition",
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-background text-text hover:border-primary/40 hover:text-primary",
                      isLoading
                        ? "cursor-not-allowed opacity-60"
                        : "",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                );
              },
            )}
          </div>

          {/* Página actual en móvil */}
          <div className="flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm text-text sm:hidden">
            Página{" "}
            <span className="mx-1 font-semibold">
              {currentPage}
            </span>
            de{" "}
            <span className="ml-1 font-semibold">
              {lastPage}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            disabled={!canGoNext}
            aria-label="Ir a la página siguiente"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
          >
            <span className="hidden sm:inline">
              Siguiente
            </span>

            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </nav>
      </div>

      {/* Página actual en escritorio */}
      {lastPage > 1 && (
        <p className="mt-4 text-center text-xs text-text-muted lg:text-left">
          Página {currentPage} de {lastPage}
        </p>
      )}
    </section>
  );
}