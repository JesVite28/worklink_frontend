import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  EyeIcon,
  FolderOpenIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

import type { PublicBriefcase } from "../models/publicBriefcase";

interface Props {
  briefcase: PublicBriefcase;

  onView: (
    briefcase: PublicBriefcase,
  ) => void;
}

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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

function normalizeUrl(
  value: string,
): string {
  const normalizedValue = value.trim();

  if (
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return normalizedValue;
  }

  return `https://${normalizedValue}`;
}

export default function PublicBriefcaseCard({
  briefcase,
  onView,
}: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Imagen */}
      <button
        type="button"
        onClick={() =>
          onView(briefcase)
        }
        className="relative block h-52 w-full overflow-hidden bg-background text-left sm:h-60"
        aria-label={`Ver proyecto ${briefcase.title}`}
      >
        {briefcase.image_url ? (
          <img
            src={briefcase.image_url}
            alt={briefcase.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/10 to-secondary/10 text-text-muted">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface/80 text-primary shadow-soft">
              <PhotoIcon className="h-7 w-7" />
            </div>

            <span className="text-sm font-medium">
              Imagen no disponible
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-200 group-hover:bg-black/40 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-lg">
            <EyeIcon className="h-5 w-5" />

            Ver proyecto
          </span>
        </div>
      </button>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderOpenIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              Proyecto de portafolio
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-7 text-text">
              {briefcase.title}
            </h3>
          </div>
        </div>

        <p className="mt-5 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
          {briefcase.description ||
            "El freelancer no agregó una descripción para este proyecto."}
        </p>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-text-muted">
          <CalendarDaysIcon className="h-5 w-5 shrink-0" />

          <span>
            Publicado el{" "}
            {formatDate(
              briefcase.created_at,
            )}
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              onView(briefcase)
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <EyeIcon className="h-5 w-5" />

            Ver detalles
          </button>

          {briefcase.project_url ? (
            <a
              href={normalizeUrl(
                briefcase.project_url,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />

              Abrir proyecto
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-muted opacity-60"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />

              Sin enlace
            </button>
          )}
        </div>
      </div>
    </article>
  );
}