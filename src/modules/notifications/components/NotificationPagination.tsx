import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import type {
  NotificationPagination as NotificationPaginationType,
} from "../models/notification";

interface Props {
  pagination:
    | NotificationPaginationType
    | null;

  isLoading?: boolean;

  onPageChange: (
    page: number,
  ) => void;
}

function getVisiblePages(
  currentPage: number,
  lastPage: number,
): number[] {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(lastPage);

  for (
    let page = currentPage - 1;
    page <= currentPage + 1;
    page += 1
  ) {
    if (
      page >= 1 &&
      page <= lastPage
    ) {
      pages.add(page);
    }
  }

  return Array.from(pages).sort(
    (firstPage, secondPage) =>
      firstPage - secondPage,
  );
}

export default function NotificationPagination({
  pagination,
  isLoading = false,
  onPageChange,
}: Props) {
  if (
    !pagination ||
    pagination.last_page <= 1
  ) {
    return null;
  }

  const {
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage,
    total,
  } = pagination;

  const visiblePages =
    getVisiblePages(
      currentPage,
      lastPage,
    );

  const firstResult =
    total === 0
      ? 0
      : (currentPage - 1) *
          perPage +
        1;

  const lastResult =
    Math.min(
      currentPage * perPage,
      total,
    );

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Información */}
        <p className="text-center text-sm text-text-muted lg:text-left">
          Mostrando{" "}
          <span className="font-semibold text-text">
            {firstResult}
          </span>{" "}
          a{" "}
          <span className="font-semibold text-text">
            {lastResult}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-text">
            {total}
          </span>{" "}
          notificaciones
        </p>

        {/* Controles */}
        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Paginación de notificaciones"
        >
          <button
            type="button"
            onClick={() =>
              onPageChange(
                currentPage - 1,
              )
            }
            disabled={
              isLoading ||
              currentPage <= 1
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="h-4 w-4" />

            <span className="hidden sm:inline">
              Anterior
            </span>
          </button>

          <div className="flex items-center gap-1">
            {visiblePages.map(
              (pageNumber, index) => {
                const previousPage =
                  visiblePages[
                    index - 1
                  ];

                const showSeparator =
                  previousPage !==
                    undefined &&
                  pageNumber -
                    previousPage >
                    1;

                const isCurrentPage =
                  pageNumber ===
                  currentPage;

                return (
                  <div
                    key={pageNumber}
                    className="flex items-center gap-1"
                  >
                    {showSeparator && (
                      <span className="flex h-10 min-w-8 items-center justify-center text-sm text-text-muted">
                        ...
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        onPageChange(
                          pageNumber,
                        )
                      }
                      disabled={
                        isLoading ||
                        isCurrentPage
                      }
                      className={[
                        "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition disabled:cursor-default",
                        isCurrentPage
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-background text-text-muted hover:border-primary/40 hover:text-primary disabled:opacity-60",
                      ].join(" ")}
                      aria-current={
                        isCurrentPage
                          ? "page"
                          : undefined
                      }
                      aria-label={`Ir a la página ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  </div>
                );
              },
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              onPageChange(
                currentPage + 1,
              )
            }
            disabled={
              isLoading ||
              currentPage >= lastPage
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <span className="hidden sm:inline">
              Siguiente
            </span>

            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </section>
  );
}