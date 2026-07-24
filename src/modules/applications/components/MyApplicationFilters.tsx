import {
  FunnelIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { ChangeEvent } from "react";

import type { ApplicationStatusFilter } from "../hooks/useMyApplications";

interface Props {
  search: string;
  statusFilter: ApplicationStatusFilter;
  perPage: number;
  totalResults: number;
  isLoading: boolean;
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;

  onStatusFilterChange: (
    value: ApplicationStatusFilter,
  ) => void;

  onPerPageChange: (value: number) => void;

  onResetFilters: () => void;
}

const fieldClassName = [
  "w-full rounded-xl border border-border bg-background",
  "px-4 py-3 text-sm text-text outline-none transition",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

function isApplicationStatusFilter(
  value: string,
): value is ApplicationStatusFilter {
  return [
    "all",
    "pending",
    "accepted",
    "rejected",
  ].includes(value);
}

export default function MyApplicationFilters({
  search,
  statusFilter,
  perPage,
  totalResults,
  isLoading,
  hasActiveFilters,

  onSearchChange,
  onStatusFilterChange,
  onPerPageChange,
  onResetFilters,
}: Props) {
  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    if (isApplicationStatusFilter(value)) {
      onStatusFilterChange(value);
    }
  };

  const handlePerPageChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = Number(event.target.value);

    if (
      Number.isInteger(value) &&
      value > 0
    ) {
      onPerPageChange(value);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FunnelIcon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-semibold text-text">
              Filtrar postulaciones
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Busca por vacante, categoría o contenido del
              mensaje enviado.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-background px-3 py-2 text-sm text-text-muted sm:self-auto">
          <QueueListIcon className="h-5 w-5" />

          <span>
            {totalResults}{" "}
            {totalResults === 1
              ? "resultado"
              : "resultados"}
          </span>
        </div>
      </div>

      {/* Campos */}
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_170px_auto] lg:items-end">
        {/* Búsqueda */}
        <div>
          <label
            htmlFor="application-search"
            className="mb-2 block text-sm font-medium text-text"
          >
            Buscar
          </label>

          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <input
              id="application-search"
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              disabled={isLoading}
              maxLength={150}
              placeholder="Ej. Laravel, diseño o nombre de vacante"
              className={`${fieldClassName} pl-11`}
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="application-status-filter"
            className="mb-2 block text-sm font-medium text-text"
          >
            Estado
          </label>

          <select
            id="application-status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            disabled={isLoading}
            className={fieldClassName}
          >
            <option value="all">
              Todos los estados
            </option>

            <option value="pending">
              Pendientes
            </option>

            <option value="accepted">
              Aceptadas
            </option>

            <option value="rejected">
              Rechazadas
            </option>
          </select>
        </div>

        {/* Resultados por página */}
        <div>
          <label
            htmlFor="application-per-page"
            className="mb-2 block text-sm font-medium text-text"
          >
            Mostrar
          </label>

          <select
            id="application-per-page"
            value={perPage}
            onChange={handlePerPageChange}
            disabled={isLoading}
            className={fieldClassName}
          >
            <option value={6}>
              6 por página
            </option>

            <option value={9}>
              9 por página
            </option>

            <option value={12}>
              12 por página
            </option>

            <option value={15}>
              15 por página
            </option>
          </select>
        </div>

        {/* Limpiar */}
        <button
          type="button"
          onClick={onResetFilters}
          disabled={
            isLoading ||
            !hasActiveFilters
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <XMarkIcon className="h-5 w-5" />

          Limpiar
        </button>
      </div>

      {/* Resumen del filtro */}
      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <span className="text-sm font-medium text-text-muted">
            Filtros activos:
          </span>

          {search.trim() && (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              Búsqueda: {search.trim()}
            </span>
          )}

          {statusFilter !== "all" && (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              Estado:{" "}
              {statusFilter === "pending"
                ? "Pendiente"
                : statusFilter === "accepted"
                  ? "Aceptada"
                  : "Rechazada"}
            </span>
          )}
        </div>
      )}
    </section>
  );
}