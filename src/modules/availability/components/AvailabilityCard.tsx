import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import type {
  Availability,
  AvailabilityStatus,
} from "../models/availability";

interface Props {
  availability: Availability;
  isProcessing: boolean;

  onEdit: (
    availability: Availability,
  ) => void;

  onStatusChange: (
    availability: Availability,
    status: AvailabilityStatus,
  ) => void;

  onDelete: (
    availability: Availability,
  ) => void;
}

const statusInformation: Record<
  AvailabilityStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    iconContainerClassName: string;
  }
> = {
  available: {
    label: "Disponible",
    description: "Puedes recibir nuevos proyectos.",
    badgeClassName:
      "border-success/30 bg-success/10 text-success",
    iconContainerClassName:
      "bg-success/10 text-success",
  },

  busy: {
    label: "Ocupado",
    description: "Tienes compromisos durante este periodo.",
    badgeClassName:
      "border-warning/30 bg-warning/10 text-warning",
    iconContainerClassName:
      "bg-warning/10 text-warning",
  },

  vacation: {
    label: "Vacaciones",
    description: "Te encuentras ausente o descansando.",
    badgeClassName:
      "border-secondary/30 bg-secondary/10 text-secondary",
    iconContainerClassName:
      "bg-secondary/10 text-secondary",
  },
};

function parseLocalDate(
  value: string,
): Date | null {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatDate(
  value: string,
): string {
  const date = parseLocalDate(value);

  if (!date) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function calculateDuration(
  startDate: string,
  endDate: string,
): number {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end) {
    return 0;
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference =
    end.getTime() - start.getTime();

  return Math.max(
    1,
    Math.round(
      difference / millisecondsPerDay,
    ) + 1,
  );
}

function getStatusIcon(
  status: AvailabilityStatus,
) {
  if (status === "available") {
    return (
      <CheckCircleIcon className="h-6 w-6" />
    );
  }

  if (status === "busy") {
    return (
      <ExclamationTriangleIcon className="h-6 w-6" />
    );
  }

  return <SunIcon className="h-6 w-6" />;
}

export default function AvailabilityCard({
  availability,
  isProcessing,
  onEdit,
  onStatusChange,
  onDelete,
}: Props) {
  const status =
    statusInformation[
      availability.status
    ];

  const duration = calculateDuration(
    availability.start_date,
    availability.end_date,
  );

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onStatusChange(
      availability,
      event.target
        .value as AvailabilityStatus,
    );
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            status.iconContainerClassName,
          ].join(" ")}
        >
          {getStatusIcon(
            availability.status,
          )}
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
            status.badgeClassName,
          ].join(" ")}
        >
          {status.label}
        </span>
      </div>

      {/* Información principal */}
      <div className="mt-5">
        <h2 className="text-lg font-semibold text-text">
          Periodo de disponibilidad
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-muted">
          {status.description}
        </p>
      </div>

      {/* Fechas */}
      <div className="mt-6 space-y-4 rounded-xl border border-border bg-background p-4">
        <div className="flex items-start gap-3">
          <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Fecha inicial
            </p>

            <p className="mt-1 text-sm font-semibold text-text">
              {formatDate(
                availability.start_date,
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-start gap-3">
          <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Fecha final
            </p>

            <p className="mt-1 text-sm font-semibold text-text">
              {formatDate(
                availability.end_date,
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        <div className="flex items-center gap-3">
          <ClockIcon className="h-5 w-5 shrink-0 text-text-muted" />

          <p className="text-sm text-text-muted">
            Duración:{" "}
            <span className="font-semibold text-text">
              {duration}{" "}
              {duration === 1
                ? "día"
                : "días"}
            </span>
          </p>
        </div>
      </div>

      {/* Cambio rápido de estado */}
      <div className="mt-5">
        <label
          htmlFor={`availability-status-${availability.id}`}
          className="mb-2 block text-sm font-medium text-text"
        >
          Cambiar estado
        </label>

        <select
          id={`availability-status-${availability.id}`}
          value={availability.status}
          onChange={handleStatusChange}
          disabled={isProcessing}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="available">
            Disponible
          </option>

          <option value="busy">
            Ocupado
          </option>

          <option value="vacation">
            Vacaciones
          </option>
        </select>
      </div>

      {/* Acciones */}
      <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            onEdit(availability)
          }
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PencilSquareIcon className="h-5 w-5" />
          Editar
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(availability)
          }
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
          ) : (
            <TrashIcon className="h-5 w-5" />
          )}

          Eliminar
        </button>
      </div>
    </article>
  );
}