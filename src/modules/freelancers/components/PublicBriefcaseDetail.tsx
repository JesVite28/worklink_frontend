import { useEffect } from "react";

import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { PublicBriefcase } from "../models/publicBriefcase";

interface Props {
  briefcase: PublicBriefcase | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeUrl(value: string): string {
  const normalizedValue = value.trim();

  if (
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return normalizedValue;
  }

  return `https://${normalizedValue}`;
}

export default function PublicBriefcaseDetail({
  briefcase,
  isLoading,
  error,
  onClose,
}: Props) {
  const isOpen =
    isLoading ||
    Boolean(error) ||
    Boolean(briefcase);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="briefcase-detail-title"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderOpenIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Proyecto de portafolio
              </p>

              <h2
                id="briefcase-detail-title"
                className="truncate text-lg font-semibold text-text"
              >
                {briefcase?.title ||
                  "Detalle del proyecto"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition hover:bg-background hover:text-text"
            aria-label="Cerrar detalle del proyecto"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido */}
        <div className="max-h-[calc(92vh-77px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

              <div>
                <p className="font-semibold text-text">
                  Cargando proyecto
                </p>

                <p className="mt-1 text-sm text-text-muted">
                  Estamos obteniendo la
                  información del portafolio.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                <FolderOpenIcon className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-text">
                No se pudo cargar el proyecto
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
                {error}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          ) : briefcase ? (
            <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
              {/* Imagen del proyecto */}
              <div className="bg-background">
                {briefcase.image_url ? (
                  <img
                    src={briefcase.image_url}
                    alt={briefcase.title}
                    className="max-h-[650px] min-h-64 w-full object-contain sm:min-h-96"
                  />
                ) : (
                  <div className="flex min-h-80 flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 to-secondary/10 px-6 text-center text-text-muted sm:min-h-[520px]">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-surface/80 text-primary shadow-soft">
                      <PhotoIcon className="h-10 w-10" />
                    </div>

                    <div>
                      <p className="font-semibold text-text">
                        Imagen no disponible
                      </p>

                      <p className="mt-1 text-sm">
                        Este proyecto no tiene una
                        imagen pública.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex flex-col p-5 sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Portafolio profesional
                  </p>

                  <h3 className="mt-2 text-2xl font-bold leading-tight text-text">
                    {briefcase.title}
                  </h3>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-text">
                    Descripción
                  </h4>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-text-muted">
                    {briefcase.description ||
                      "El freelancer no agregó una descripción para este proyecto."}
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                  <CalendarDaysIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                      Fecha de publicación
                    </p>

                    <p className="mt-1 text-sm font-semibold text-text">
                      {formatDate(
                        briefcase.created_at,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  {briefcase.project_url ? (
                    <a
                      href={normalizeUrl(
                        briefcase.project_url,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />

                      Abrir proyecto
                    </a>
                  ) : (
                    <div className="rounded-xl border border-border bg-background px-5 py-3 text-center text-sm font-medium text-text-muted">
                      Este proyecto no tiene un
                      enlace externo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}