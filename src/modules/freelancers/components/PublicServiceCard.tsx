import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

import CreateContractRequestForm from "../../contractRequests/components/CreateContractRequestForm";

import type { FreelancerService } from "../../services/models/service";

interface Props {
  service: FreelancerService;
}

function formatPrice(
  price: string | number | null,
): string {
  if (
    price === null ||
    price === ""
  ) {
    return "Precio a convenir";
  }

  const numericPrice = Number(price);

  if (
    Number.isNaN(numericPrice) ||
    !Number.isFinite(numericPrice)
  ) {
    return "Precio a convenir";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericPrice);
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function PublicServiceCard({
  service,
}: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="h-1.5 w-full bg-primary" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Encabezado */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Servicio profesional
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-7 text-text">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Categoría y precio */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <TagIcon className="h-4 w-4" />

            {service.category}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text">
            <BanknotesIcon className="h-4 w-4 text-text-muted" />

            {formatPrice(service.price)}
          </span>
        </div>

        {/* Descripción */}
        <p className="mt-5 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-text-muted">
          {service.description ||
            "El freelancer no agregó una descripción para este servicio."}
        </p>

        {/* Información adicional */}
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-start gap-2 text-sm text-text-muted">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <span className="line-clamp-2">
              {service.location ||
                "Ubicación o modalidad no especificada"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <CalendarDaysIcon className="h-5 w-5 shrink-0" />

            <span>
              Publicado el{" "}
              {formatDate(service.created_at)}
            </span>
          </div>
        </div>

        {/* Contratación */}
        <div className="mt-auto pt-6">
          <CreateContractRequestForm
            service={{
              id: service.id,
              title: service.title,
              description: service.description,
              category: service.category,
              location: service.location,
              price: service.price,
              is_active: service.is_active,
            }}
          />
        </div>
      </div>
    </article>
  );
}