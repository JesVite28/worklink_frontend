import {
  BriefcaseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { ChangeEvent } from "react";

import type { Vacancy } from "../../vacancies/models/vacancy";

import type {
  ReceivedApplicationStatusFilter,
  ReceivedApplicationVacancyFilter,
} from "../hooks/useReceivedApplications";

interface Props {
  vacancies: Vacancy[];

  search: string;

  statusFilter:
    ReceivedApplicationStatusFilter;

  vacancyFilter:
    ReceivedApplicationVacancyFilter;

  perPage: number;
  totalResults: number;

  isLoading: boolean;
  hasActiveFilters: boolean;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusFilterChange: (
    value: ReceivedApplicationStatusFilter,
  ) => void;

  onVacancyFilterChange: (
    value: ReceivedApplicationVacancyFilter,
  ) => void;

  onPerPageChange: (
    value: number,
  ) => void;

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
): value is ReceivedApplicationStatusFilter {
  return [
    "all",
    "pending",
    "accepted",
    "rejected",
  ].includes(value);
}

function getStatusLabel(
  status: ReceivedApplicationStatusFilter,
): string {
  if (status === "pending") {
    return "Pendientes";
  }

  if (status === "accepted") {
    return "Aceptadas";
  }

  if (status === "rejected") {
    return "Rechazadas";
  }

  return "Todos los estados";
}

export default function ReceivedApplicationFilters({
  vacancies,

  search,
  statusFilter,
  vacancyFilter,
  perPage,
  totalResults,

  isLoading,
  hasActiveFilters,

  onSearchChange,
  onStatusFilterChange,
  onVacancyFilterChange,
  onPerPageChange,
  onResetFilters,
}: Props) {
  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    if (
      isApplicationStatusFilter(value)
    ) {
      onStatusFilterChange(value);
    }
  };

  const handleVacancyChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;

    if (value === "all") {
      onVacancyFilterChange("all");

      return;
    }

    const vacancyId = Number(value);

    if (
      Number.isInteger(vacancyId) &&
      vacancyId > 0
    ) {
      onVacancyFilterChange(vacancyId);
    }
  };

  const handlePerPageChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = Number(
      event.target.value,
    );

    if (
      Number.isInteger(value) &&
      value > 0
    ) {
      onPerPageChange(value);
    }
  };

  const selectedVacancy =
    vacancyFilter === "all"
      ? null
      : vacancies.find(
          (vacancy) =>
            vacancy.id === vacancyFilter,
        ) ?? null;

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
              Filtrar postulaciones recibidas
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Busca candidatos y filtra las
              postulaciones por vacante o estado.
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

      {/* Filtros */}
      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(240px,1fr)_minmax(220px,280px)_200px_160px_auto] xl:items-end">
        {/* Búsqueda */}
        <div>
          <label
            htmlFor="received-application-search"
            className="mb-2 block text-sm font-medium text-text"
          >
            Buscar candidato
          </label>

          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <input
              id="received-application-search"
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              disabled={isLoading}
              maxLength={150}
              placeholder="Nombre, vacante, categoría o mensaje"
              className={`${fieldClassName} pl-11`}
            />
          </div>
        </div>

        {/* Vacante */}
        <div>
          <label
            htmlFor="received-application-vacancy"
            className="mb-2 block text-sm font-medium text-text"
          >
            Vacante
          </label>

          <div className="relative">
            <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <select
              id="received-application-vacancy"
              value={vacancyFilter}
              onChange={handleVacancyChange}
              disabled={isLoading}
              className={`${fieldClassName} pl-11`}
            >
              <option value="all">
                Todas las vacantes
              </option>

              {vacancies.map((vacancy) => (
                <option
                  key={vacancy.id}
                  value={vacancy.id}
                >
                  {vacancy.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="received-application-status"
            className="mb-2 block text-sm font-medium text-text"
          >
            Estado
          </label>

          <select
            id="received-application-status"
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

        {/* Cantidad */}
        <div>
          <label
            htmlFor="received-application-per-page"
            className="mb-2 block text-sm font-medium text-text"
          >
            Mostrar
          </label>

          <select
            id="received-application-per-page"
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

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
          <span className="text-sm font-medium text-text-muted">
            Filtros activos:
          </span>

          {search.trim() && (
            <span className="inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <span className="truncate">
                Búsqueda: {search.trim()}
              </span>
            </span>
          )}

          {selectedVacancy && (
            <span className="inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <span className="truncate">
                Vacante:{" "}
                {selectedVacancy.title}
              </span>
            </span>
          )}

          {statusFilter !== "all" && (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              Estado:{" "}
              {getStatusLabel(
                statusFilter,
              )}
            </span>
          )}
        </div>
      )}

      {/* Sin vacantes */}
      {vacancies.length === 0 && (
        <div className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

            <p className="text-sm leading-6 text-text-muted">
              La empresa todavía no tiene
              vacantes registradas. Publica una
              vacante para comenzar a recibir
              postulaciones.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}