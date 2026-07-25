import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type {
  ContractFilters as ContractFiltersType,
  ContractStatusFilter,
} from "../models/contract";

interface Props {
  filters: ContractFiltersType;

  statusCounts: Record<
    ContractStatusFilter,
    number
  >;

  activeFiltersCount: number;
  isLoading?: boolean;

  onStatusChange: (
    status: ContractStatusFilter,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onClear: () => void;
}

interface StatusOption {
  value: ContractStatusFilter;
  label: string;
}

const statusOptions: StatusOption[] = [
  {
    value: "all",
    label: "Todos",
  },
  {
    value: "in_process",
    label: "En proceso",
  },
  {
    value: "completed",
    label: "Completados",
  },
  {
    value: "canceled",
    label: "Cancelados",
  },
];

const statusStyles: Record<
  ContractStatusFilter,
  {
    active: string;
    inactive: string;
  }
> = {
  all: {
    active:
      "border-primary bg-primary text-white",
    inactive:
      "border-border bg-background text-text-muted hover:border-primary/40 hover:text-primary",
  },

  in_process: {
    active:
      "border-blue-600 bg-blue-600 text-white",
    inactive:
      "border-border bg-background text-text-muted hover:border-blue-500/40 hover:text-blue-600",
  },

  completed: {
    active:
      "border-success bg-success text-white",
    inactive:
      "border-border bg-background text-text-muted hover:border-success/40 hover:text-success",
  },

  canceled: {
    active:
      "border-danger bg-danger text-white",
    inactive:
      "border-border bg-background text-text-muted hover:border-danger/40 hover:text-danger",
  },
};

export default function ContractFilters({
  filters,

  statusCounts,
  activeFiltersCount,
  isLoading = false,

  onStatusChange,
  onSearchChange,
  onClear,
}: Props) {
  const hasActiveFilters =
    activeFiltersCount > 0;

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
              Filtrar contratos
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Busca por servicio, usuario o número de contrato.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-text-muted transition hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />

            Limpiar filtros

            <span className="flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
              {activeFiltersCount}
            </span>
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="relative mt-5">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

        <input
          type="search"
          value={filters.search}
          onChange={(event) =>
            onSearchChange(
              event.target.value,
            )
          }
          disabled={isLoading}
          placeholder="Buscar por servicio, cliente, freelancer o número..."
          className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-11 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {filters.search && (
          <button
            type="button"
            onClick={() =>
              onSearchChange("")
            }
            disabled={isLoading}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Limpiar búsqueda"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Estados */}
      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Estado del contrato
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map(
            (option) => {
              const isActive =
                filters.status ===
                option.value;

              const styles =
                statusStyles[
                  option.value
                ];

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onStatusChange(
                      option.value,
                    )
                  }
                  disabled={isLoading}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                    isActive
                      ? styles.active
                      : styles.inactive,
                  ].join(" ")}
                >
                  {option.label}

                  <span
                    className={[
                      "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-surface text-text-muted",
                    ].join(" ")}
                  >
                    {statusCounts[
                      option.value
                    ]}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}