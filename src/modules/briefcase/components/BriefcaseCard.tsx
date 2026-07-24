import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  LinkIcon,
  PencilSquareIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { BriefcaseProject } from "../models/briefcase";

interface Props {
  briefcase: BriefcaseProject;
  isProcessing: boolean;

  onEdit: (
    briefcase: BriefcaseProject,
  ) => void;

  onDeleteImage: (
    briefcase: BriefcaseProject,
  ) => void;

  onDelete: (
    briefcase: BriefcaseProject,
  ) => void;
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

export default function BriefcaseCard({
  briefcase,
  isProcessing,
  onEdit,
  onDeleteImage,
  onDelete,
}: Props) {
  const hasImage = Boolean(
    briefcase.image_url,
  );

  const hasProjectLink = Boolean(
    briefcase.project_url,
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Imagen */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background">
        {hasImage ? (
          <img
            src={briefcase.image_url ?? ""}
            alt={`Proyecto ${briefcase.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PhotoIcon className="h-7 w-7" />
            </div>

            <p className="mt-4 text-sm font-medium text-text">
              Proyecto sin imagen
            </p>

            <p className="mt-1 text-xs leading-5 text-text-muted">
              Puedes agregar una captura editando este proyecto.
            </p>
          </div>
        )}

        {/* Acciones superiores */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(briefcase)}
            disabled={isProcessing}
            aria-label={`Editar ${briefcase.title}`}
            title="Editar proyecto"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>

          {hasImage && (
            <button
              type="button"
              onClick={() =>
                onDeleteImage(briefcase)
              }
              disabled={isProcessing}
              aria-label={`Eliminar imagen de ${briefcase.title}`}
              title="Eliminar imagen"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur transition hover:bg-danger disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <XMarkIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Información */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-text">
            {briefcase.title}
          </h2>
        </div>

        <p className="mt-4 line-clamp-4 text-sm leading-6 text-text-muted">
          {briefcase.description ||
            "Este proyecto todavía no tiene una descripción."}
        </p>

        {/* Datos adicionales */}
        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <CalendarDaysIcon className="h-5 w-5 shrink-0" />

            <span>
              Agregado el{" "}
              {formatDate(
                briefcase.created_at,
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-5 w-5 shrink-0 text-text-muted" />

            {hasProjectLink ? (
              <a
                href={
                  briefcase.project_url ??
                  undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 truncate font-medium text-primary transition hover:underline"
                title={
                  briefcase.project_url ??
                  undefined
                }
              >
                Ver proyecto externo
              </a>
            ) : (
              <span className="text-text-muted">
                Sin enlace externo
              </span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
          {hasProjectLink ? (
            <a
              href={
                briefcase.project_url ??
                undefined
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              Abrir proyecto
            </a>
          ) : (
            <button
              type="button"
              onClick={() =>
                onEdit(briefcase)
              }
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Agregar enlace
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onDelete(briefcase)
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
      </div>
    </article>
  );
}