import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type {
  ContractRequestStatusFilter,
  ContractRequestViewMode,
} from "../hooks/useContractRequests";

interface Props {
  viewMode: ContractRequestViewMode;

  search: string;
  statusFilter: ContractRequestStatusFilter;
  perPage: number;
  totalResults: number;

  isLoading: boolean;
  hasActiveFilters: boolean;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusFilterChange: (
    value: ContractRequestStatusFilter,
  ) => void;

  onPerPageChange: (
    value: number,
  ) => void;

  onResetFilters: () => void;
}

export default function ContractRequestFilters({
  viewMode,
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
  const isReceivedView =
    viewMode === "received";

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FunnelIcon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text">
              Filtrar solicitudes
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              {isReceivedView
                ? "Busca solicitudes por cliente, servicio o descripción."
                : "Busca solicitudes por freelancer, servicio o descripción."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-text-muted">
            {totalResults}{" "}
            {totalResults === 1
              ? "resultado"
              : "resultados"}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XMarkIcon className="h-4 w-4" />

              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_160px]">
        {/* Búsqueda */}
        <div>
          <label
            htmlFor="contract-request-search"
            className="mb-2 block text-sm font-medium text-text"
          >
            Buscar
          </label>

          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <input
              id="contract-request-search"
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              disabled={isLoading}
              placeholder={
                isReceivedView
                  ? "Cliente, servicio o descripción..."
                  : "Freelancer, servicio o descripción..."
              }
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="contract-request-status"
            className="mb-2 block text-sm font-medium text-text"
          >
            Estado
          </label>

          <select
            id="contract-request-status"
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target
                  .value as ContractRequestStatusFilter,
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
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

            <option value="canceled">
              Canceladas
            </option>
          </select>
        </div>

        {/* Resultados por página */}
        <div>
          <label
            htmlFor="contract-request-per-page"
            className="mb-2 block text-sm font-medium text-text"
          >
            Mostrar
          </label>

          <select
            id="contract-request-per-page"
            value={perPage}
            onChange={(event) =>
              onPerPageChange(
                Number(event.target.value),
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value={6}>
              6 por página
            </option>

            <option value={12}>
              12 por página
            </option>

            <option value={24}>
              24 por página
            </option>

            <option value={48}>
              48 por página
            </option>
          </select>
        </div>
      </div>

      {/* Resumen de filtros */}
      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <span className="text-xs font-medium text-text-muted">
            Filtros activos:
          </span>

          {search.trim() && (
            <button
              type="button"
              onClick={() =>
                onSearchChange("")
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Búsqueda: {search.trim()}

              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          )}

          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() =>
                onStatusFilterChange("all")
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Estado:{" "}
              {statusFilter === "pending"
                ? "Pendiente"
                : statusFilter ===
                    "accepted"
                  ? "Aceptada"
                  : statusFilter ===
                      "rejected"
                    ? "Rechazada"
                    : "Cancelada"}

              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}