import { Link } from "react-router-dom";

import {
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import type { Vacancy } from "../models/vacancy";

interface VacancyPublicCardProps {
  vacancy: Vacancy;
}

const DEFAULT_COMPANY_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab";

function formatSalary(salary: string | null): string {
  if (!salary) {
    return "Salario a convenir";
  }

  const numericSalary = Number(salary);

  if (!Number.isFinite(numericSalary)) {
    return salary;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(numericSalary);
}

function formatPublicationDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getCompanyImage(vacancy: Vacancy): string {
  return (
    vacancy.company_profile?.user?.profile_photo_url ||
    vacancy.company_profile?.user?.profile_photo ||
    DEFAULT_COMPANY_IMAGE
  );
}

export default function VacancyPublicCard({
  vacancy,
}: VacancyPublicCardProps) {
  const companyName =
    vacancy.company_profile?.company_name ||
    "Empresa de WorkLink";

  const companyImage = getCompanyImage(vacancy);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-6">
      {/* Empresa */}
      <header className="flex items-start gap-4">
        <img
          src={companyImage}
          alt={`Empresa ${companyName}`}
          className="h-14 w-14 shrink-0 rounded-xl border border-border bg-background object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_COMPANY_IMAGE;
          }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-lg font-semibold text-text">
                {vacancy.title}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                <BuildingOffice2Icon className="h-4 w-4 shrink-0" />

                <span className="truncate">
                  {companyName}
                </span>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Abierta
            </span>
          </div>
        </div>
      </header>

      {/* Información */}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-4 w-4 shrink-0" />

          <span>{vacancy.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4 shrink-0" />

          <span>{vacancy.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4 shrink-0" />

          <span>
            {formatPublicationDate(vacancy.created_at)}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="mt-5 line-clamp-3 flex-1 text-sm leading-6 text-text-muted">
        {vacancy.description}
      </p>

      {/* Salario y acción */}
      <footer className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs text-text-muted">
            <BanknotesIcon className="h-4 w-4" />
            Salario
          </p>

          <p className="mt-1 text-lg font-bold text-primary">
            {formatSalary(vacancy.salary)}
          </p>
        </div>

        <Link
          to={`/vacantes/${vacancy.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
        >
          Ver vacante
        </Link>
      </footer>

      {!vacancy.accepts_applications && (
        <p className="mt-4 rounded-xl bg-warning/10 px-4 py-3 text-center text-xs font-medium text-warning">
          Esta vacante ya no está recibiendo postulaciones.
        </p>
      )}
    </article>
  );
}