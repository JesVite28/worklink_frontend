import { useNavigate } from "react-router-dom";

import {
  BriefcaseIcon,
  MapPinIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import type { FreelancerService } from "../models/service";

interface Props {
  service: FreelancerService;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

function formatPrice(price: string | null): string {
  if (!price) {
    return "Precio a convenir";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return price;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function getFreelancerName(
  service: FreelancerService,
): string {
  const user =
    service.freelancer_profile?.user;

  if (!user) {
    return "Freelancer";
  }

  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getFreelancerImage(
  service: FreelancerService,
): string {
  const user =
    service.freelancer_profile?.user;

  return (
    user?.profile_photo_url ||
    user?.profile_photo ||
    DEFAULT_IMAGE
  );
}

export default function ServiceFeedCard({
  service,
}: Props) {
  const navigate = useNavigate();

  const freelancerName =
    getFreelancerName(service);

  const freelancerImage =
    getFreelancerImage(service);

  function handleViewProfile() {
    navigate(
      `/freelancers/${service.freelancer_id}`,
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition hover:border-primary/30 hover:shadow-lg">
      {/* Autor */}
      <header className="flex items-center gap-3 border-b border-border p-4 sm:p-5">
        <img
          src={freelancerImage}
          alt={`Perfil de ${freelancerName}`}
          className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              DEFAULT_IMAGE;
          }}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-text">
            {freelancerName}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
            <UserCircleIcon className="h-4 w-4 shrink-0" />

            <span className="truncate">
              {service.freelancer_profile
                ?.specialty ||
                "Profesional independiente"}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Servicio
        </span>
      </header>

      {/* Contenido */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BriefcaseIcon className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-text">
              {service.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-primary">
              {service.category}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-muted">
          {service.description}
        </p>

        {service.location && (
          <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <MapPinIcon className="h-4 w-4 shrink-0" />

            <span className="line-clamp-1">
              {service.location}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-text-muted">
              Precio desde
            </p>

            <p className="mt-1 text-lg font-bold text-primary">
              {formatPrice(service.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewProfile}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
          >
            Ver perfil
          </button>
        </div>
      </div>
    </article>
  );
}