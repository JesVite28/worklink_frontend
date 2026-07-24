import { useNavigate } from "react-router-dom";

import { StarIcon } from "@heroicons/react/24/solid";
import {
  BriefcaseIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import type {
  Freelancer,
  WorkMode,
} from "../models/freelancer";

interface Props {
  freelancer: Freelancer;
  variant?: "default" | "feed";
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

const workModeLabels: Record<WorkMode, string> = {
  remote: "Remoto",
  on_site: "Presencial",
  hybrid: "Híbrido",
  home_service: "A domicilio",
};

export default function FreelancerCard({
  freelancer,
  variant = "default",
}: Props) {
  const navigate = useNavigate();

  const displayedLanguages =
    freelancer.languages?.slice(0, 3) ?? [];

  function handleViewProfile() {
    navigate(`/freelancers/${freelancer.id}`);
  }

  if (variant === "feed") {
    return (
      <article className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:shadow-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Lado izquierdo */}
          <div className="flex min-w-0 gap-4">
            <img
              src={freelancer.image}
              alt={`Perfil de ${freelancer.name}`}
              className="h-20 w-20 shrink-0 rounded-full border-4 border-primary/10 object-cover sm:h-24 sm:w-24"
              onError={(event) => {
                event.currentTarget.src = DEFAULT_IMAGE;
              }}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-text">
                  {freelancer.name}
                </h3>

                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    freelancer.available
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {freelancer.available
                    ? "Disponible"
                    : "No disponible"}
                </span>
              </div>

              <p className="mt-1 text-base font-medium text-primary">
                {freelancer.profession}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 shrink-0" />
                  <span>{freelancer.location}</span>
                </div>

                {freelancer.workMode && (
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="h-4 w-4 shrink-0" />
                    <span>
                      {
                        workModeLabels[
                          freelancer.workMode
                        ]
                      }
                    </span>
                  </div>
                )}
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-text-muted">
                {freelancer.description}
              </p>

              {displayedLanguages.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {displayedLanguages.map(
                    (language) => (
                      <span
                        key={language}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                      >
                        {language}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex shrink-0 flex-col gap-4 sm:items-end">
            <div className="flex items-center gap-1 text-sm">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="font-medium text-text">
                {freelancer.rating > 0
                  ? freelancer.rating.toFixed(1)
                  : "0.0"}
              </span>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-text-muted">
                Tarifa
              </p>

              <p className="text-xl font-bold text-primary">
                {freelancer.price}
              </p>
            </div>

            <button
              type="button"
              onClick={handleViewProfile}
              className="w-full rounded-xl bg-primary px-5 py-2.5 text-white transition hover:opacity-90 sm:w-auto"
            >
              Ver perfil
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Imagen */}
      <div className="h-44 sm:h-52 w-full overflow-hidden relative bg-background">
        <img
          src={freelancer.image}
          alt={`Perfil de ${freelancer.name}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = DEFAULT_IMAGE;
          }}
        />

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium shadow ${
            freelancer.available
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {freelancer.available
            ? "Disponible"
            : "No disponible"}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Nombre y calificación */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-text min-w-0 line-clamp-1">
            {freelancer.name}
          </h3>

          <div className="flex items-center gap-1 text-sm shrink-0">
            <StarIcon className="h-4 w-4 text-yellow-400" />

            <span className="text-text">
              {freelancer.rating > 0
                ? freelancer.rating.toFixed(1)
                : "0.0"}
            </span>
          </div>
        </div>

        <p className="text-primary text-sm font-medium mt-1 line-clamp-1">
          {freelancer.profession}
        </p>

        {/* Ubicación */}
        <div className="flex items-center gap-2 mt-3 text-sm text-text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0" />

          <span className="line-clamp-1">
            {freelancer.location}
          </span>
        </div>

        {/* Modalidad */}
        {freelancer.workMode && (
          <div className="flex items-center gap-2 mt-2 text-sm text-text-muted">
            <BriefcaseIcon className="h-4 w-4 shrink-0" />

            <span>
              {workModeLabels[freelancer.workMode]}
            </span>
          </div>
        )}

        {/* Descripción */}
        <p className="text-sm text-text-muted mt-4 line-clamp-3">
          {freelancer.description}
        </p>

        {/* Idiomas */}
        {displayedLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {displayedLanguages.map((language) => (
              <span
                key={language}
                className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
              >
                {language}
              </span>
            ))}
          </div>
        )}

        {/* Precio y botón */}
        <div className="mt-auto pt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs text-text-muted">
              Tarifa
            </p>

            <p className="text-primary font-bold text-base sm:text-lg">
              {freelancer.price}
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewProfile}
            className="w-full sm:w-auto bg-primary text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Ver perfil
          </button>
        </div>
      </div>
    </article>
  );
}