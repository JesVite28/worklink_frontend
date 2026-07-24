import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import type { ChangeEvent } from "react";

import type {
  Vacancy,
  VacancyStatus,
} from "../models/vacancy";

interface Props {
  vacancy: Vacancy;
  isProcessing: boolean;

  onEdit: (vacancy: Vacancy) => void;

  onStatusChange: (
    vacancy: Vacancy,
    status: VacancyStatus,
  ) => void;

  onDelete: (vacancy: Vacancy) => void;
}

const statusInformation: Record<
  VacancyStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
    iconClassName: string;
  }
> = {
  open: {
    label: "Abierta",
    description: "Acepta nuevas postulaciones.",
    badgeClassName:
      "border-success/30 bg-success/10 text-success",
    iconClassName:
      "bg-success/10 text-success",
  },

  paused: {
    label: "Pausada",
    description:
      "No acepta postulaciones temporalmente.",
    badgeClassName:
      "border-warning/30 bg-warning/10 text-warning",
    iconClassName:
      "bg-warning/10 text-warning",
  },

  closed: {
    label: "Cerrada",
    description:
      "La vacante finalizó permanentemente.",
    badgeClassName:
      "border-danger/30 bg-danger/10 text-danger",
    iconClassName:
      "bg-danger/10 text-danger",
  },
};

function formatSalary(
  salary: string | null,
): string {
  if (!salary) {
    return "Salario negociable";
  }

  const numericSalary = Number(salary);

  if (
    Number.isNaN(numericSalary) ||
    !Number.isFinite(numericSalary)
  ) {
    return "Salario negociable";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericSalary);
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getStatusIcon(status: VacancyStatus) {
  if (status === "open") {
    return (
      <CheckCircleIcon className="h-6 w-6" />
    );
  }

  if (status === "paused") {
    return <ClockIcon className="h-6 w-6" />;
  }

  return <NoSymbolIcon className="h-6 w-6" />;
}

export default function VacancyCard({
  vacancy,
  isProcessing,
  onEdit,
  onStatusChange,
  onDelete,
}: Props) {
  const status =
    statusInformation[vacancy.status];

  const isClosed =
    vacancy.status === "closed";

  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    onStatusChange(
      vacancy,
      event.target.value as VacancyStatus,
    );
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Estado superior */}
      <div
        className={[
          "h-1.5 w-full",
          vacancy.status === "open"
            ? "bg-success"
            : vacancy.status === "paused"
              ? "bg-warning"
              : "bg-danger",
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              status.iconClassName,
            ].join(" ")}
          >
            {getStatusIcon(vacancy.status)}
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

        {/* Título */}
        <div className="mt-5">
          <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-text">
            {vacancy.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-text-muted">
            {status.description}
          </p>
        </div>

        {/* Categoría y salario */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <TagIcon className="h-4 w-4" />

            {vacancy.category}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-text">
            <BanknotesIcon className="h-4 w-4 text-text-muted" />

            {formatSalary(vacancy.salary)}
          </span>
        </div>

        {/* Descripción */}
        <p className="mt-5 line-clamp-5 text-sm leading-6 text-text-muted">
          {vacancy.description}
        </p>

        {/* Información adicional */}
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-start gap-2 text-sm text-text-muted">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <span className="line-clamp-2">
              {vacancy.location}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <CalendarDaysIcon className="h-5 w-5 shrink-0" />

            <span>
              Publicada el{" "}
              {formatDate(vacancy.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <BriefcaseIcon className="h-5 w-5 shrink-0 text-text-muted" />

            <span
              className={
                vacancy.accepts_applications
                  ? "font-medium text-success"
                  : "text-text-muted"
              }
            >
              {vacancy.accepts_applications
                ? "Aceptando postulaciones"
                : "No acepta postulaciones"}
            </span>
          </div>
        </div>

        {/* Cambio rápido de estado */}
        <div className="mt-5">
          <label
            htmlFor={`vacancy-status-${vacancy.id}`}
            className="mb-2 block text-sm font-medium text-text"
          >
            Cambiar estado
          </label>

          <select
            id={`vacancy-status-${vacancy.id}`}
            value={vacancy.status}
            onChange={handleStatusChange}
            disabled={isProcessing || isClosed}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="open">
              Abierta
            </option>

            <option value="paused">
              Pausada
            </option>

            <option value="closed">
              Cerrada
            </option>
          </select>

          {isClosed && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-danger" />

              <p className="text-xs leading-5 text-text-muted">
                Esta vacante está cerrada y no puede
                editarse ni volver a abrirse.
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onEdit(vacancy)}
            disabled={isProcessing || isClosed}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-text-muted disabled:opacity-60"
          >
            <PencilSquareIcon className="h-5 w-5" />

            {isClosed
              ? "Edición bloqueada"
              : "Editar"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(vacancy)}
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
      </div>
    </article>
  );
}