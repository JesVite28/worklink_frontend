import {
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type {
  NotificationReadFilter,
  NotificationTypeFilter,
} from "../models/notification";

interface Props {
  readFilter: NotificationReadFilter;
  typeFilter: NotificationTypeFilter;
  perPage: number;

  totalResults: number;
  unreadCount: number;

  isLoading?: boolean;
  hasActiveFilters: boolean;

  onReadFilterChange: (
    value: NotificationReadFilter,
  ) => void;

  onTypeFilterChange: (
    value: NotificationTypeFilter,
  ) => void;

  onPerPageChange: (
    value: number,
  ) => void;

  onResetFilters: () => void;
}

const notificationTypeOptions: Array<{
  value: NotificationTypeFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Todos los tipos",
  },
  {
    value: "message",
    label: "Mensajes",
  },
  {
    value: "application_received",
    label: "Postulaciones recibidas",
  },
  {
    value: "application_accepted",
    label: "Postulaciones aceptadas",
  },
  {
    value: "application_rejected",
    label: "Postulaciones rechazadas",
  },
  {
    value: "contract_request",
    label: "Solicitudes de contratación",
  },
  {
    value: "contract_request_accepted",
    label: "Solicitudes aceptadas",
  },
  {
    value: "contract_request_rejected",
    label: "Solicitudes rechazadas",
  },
  {
    value: "contract_request_canceled",
    label: "Solicitudes canceladas",
  },
  {
    value: "contract_created",
    label: "Contratos creados",
  },
  {
    value: "contract_completed",
    label: "Contratos completados",
  },
  {
    value: "contract_canceled",
    label: "Contratos cancelados",
  },
  {
    value: "review_received",
    label: "Reseñas recibidas",
  },
];

const readFilterOptions: Array<{
  value: NotificationReadFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Todas",
  },
  {
    value: "unread",
    label: "No leídas",
  },
  {
    value: "read",
    label: "Leídas",
  },
];

export default function NotificationFilters({
  readFilter,
  typeFilter,
  perPage,

  totalResults,
  unreadCount,

  isLoading = false,
  hasActiveFilters,

  onReadFilterChange,
  onTypeFilterChange,
  onPerPageChange,
  onResetFilters,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FunnelIcon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-text">
              Filtrar notificaciones
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Selecciona el estado y tipo de notificación que deseas consultar.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            disabled={isLoading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />

            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado de lectura */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Estado de lectura
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {readFilterOptions.map(
            (option) => {
              const isActive =
                readFilter ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onReadFilterChange(
                      option.value,
                    )
                  }
                  disabled={isLoading}
                  className={[
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-text-muted hover:border-primary/40 hover:text-primary",
                  ].join(" ")}
                >
                  {option.value ===
                    "read" && (
                    <CheckCircleIcon className="h-4 w-4" />
                  )}

                  {option.label}

                  {option.value ===
                    "unread" && (
                    <span
                      className={[
                        "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-primary/10 text-primary",
                      ].join(" ")}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Selectores */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <label
            htmlFor="notification-type-filter"
            className="mb-2 block text-sm font-medium text-text"
          >
            Tipo de notificación
          </label>

          <div className="relative">
            <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <select
              id="notification-type-filter"
              value={typeFilter}
              onChange={(event) =>
                onTypeFilterChange(
                  event.target
                    .value as NotificationTypeFilter,
                )
              }
              disabled={isLoading}
              className="w-full appearance-none rounded-xl border border-border bg-background py-3 pl-12 pr-10 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {notificationTypeOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="notification-per-page"
            className="mb-2 block text-sm font-medium text-text"
          >
            Resultados por página
          </label>

          <select
            id="notification-per-page"
            value={perPage}
            onChange={(event) =>
              onPerPageChange(
                Number(
                  event.target.value,
                ),
              )
            }
            disabled={isLoading}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value={10}>
              10 por página
            </option>

            <option value={20}>
              20 por página
            </option>

            <option value={50}>
              50 por página
            </option>

            <option value={100}>
              100 por página
            </option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Resultados encontrados:{" "}
          <span className="font-semibold text-text">
            {totalResults}
          </span>
        </p>

        <p>
          No leídas:{" "}
          <span className="font-semibold text-primary">
            {unreadCount}
          </span>
        </p>
      </div>
    </section>
  );
}