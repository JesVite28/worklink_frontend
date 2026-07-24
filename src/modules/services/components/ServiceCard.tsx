import {
  BanknotesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilSquareIcon,
  PowerIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import type { FreelancerService } from "../models/service";

interface Props {
  service: FreelancerService;
  isProcessing: boolean;
  onEdit: (service: FreelancerService) => void;
  onToggleStatus: (
    service: FreelancerService,
  ) => void;
  onDelete: (service: FreelancerService) => void;
}

function formatPrice(
  price: string | null,
): string {
  if (!price) {
    return "Precio por acordar";
  }

  const numericPrice = Number(price);

  if (
    Number.isNaN(numericPrice) ||
    !Number.isFinite(numericPrice)
  ) {
    return "Precio por acordar";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericPrice);
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

export default function ServiceCard({
  service,
  isProcessing,
  onEdit,
  onToggleStatus,
  onDelete,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Estado superior */}
      <div
        className={[
          "h-1.5 w-full",
          service.is_active
            ? "bg-success"
            : "bg-text-muted/40",
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  service.is_active
                    ? "bg-success/10 text-success"
                    : "bg-text-muted/10 text-text-muted",
                ].join(" ")}
              >
                <span
                  className={[
                    "mr-2 h-2 w-2 rounded-full",
                    service.is_active
                      ? "bg-success"
                      : "bg-text-muted",
                  ].join(" ")}
                />

                {service.is_active
                  ? "Servicio activo"
                  : "Servicio inactivo"}
              </span>
            </div>

            <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-text">
              {service.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onEdit(service)}
            disabled={isProcessing}
            aria-label={`Editar ${service.title}`}
            title="Editar servicio"
            className="shrink-0 rounded-xl border border-border bg-background p-2.5 text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Información */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <TagIcon className="h-4 w-4" />
            {service.category}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-medium text-text">
            <BanknotesIcon className="h-4 w-4 text-text-muted" />
            {formatPrice(service.price)}
          </span>
        </div>

        <p className="mt-5 line-clamp-4 text-sm leading-6 text-text-muted">
          {service.description}
        </p>

        {/* Datos adicionales */}
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-start gap-2 text-sm text-text-muted">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <span className="line-clamp-2">
              {service.location ||
                "Ubicación no especificada"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <CalendarDaysIcon className="h-5 w-5 shrink-0" />

            <span>
              Creado el{" "}
              {formatDate(service.created_at)}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              onToggleStatus(service)
            }
            disabled={isProcessing}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition",
              "disabled:cursor-not-allowed disabled:opacity-60",
              service.is_active
                ? "border-border bg-background text-text hover:border-primary/40 hover:text-primary"
                : "border-primary bg-primary text-white hover:opacity-90",
            ].join(" ")}
          >
            {isProcessing ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
            ) : (
              <PowerIcon className="h-5 w-5" />
            )}

            {service.is_active
              ? "Desactivar"
              : "Activar"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <TrashIcon className="h-5 w-5" />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}