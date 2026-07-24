import {
  BriefcaseIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import type { FreelancerService } from "../models/service";
import ServiceCard from "./ServiceCard";

interface Props {
  services: FreelancerService[];

  onCreate: () => void;

  onEdit: (
    service: FreelancerService,
  ) => void;

  onToggleStatus: (
    service: FreelancerService,
  ) => void;

  onDelete: (
    service: FreelancerService,
  ) => void;

  isProcessingService: (
    serviceId: number,
  ) => boolean;
}

export default function ServicesList({
  services,
  onCreate,
  onEdit,
  onToggleStatus,
  onDelete,
  isProcessingService,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Estado vacío
  |--------------------------------------------------------------------------
  */

  if (services.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Todavía no tienes servicios
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Publica tu primer servicio para que los clientes
          puedan conocer qué ofreces, cuánto cuesta y dónde
          puedes realizarlo.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5" />
          Crear primer servicio
        </button>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Listado
  |--------------------------------------------------------------------------
  */

  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isProcessing={isProcessingService(
              service.id,
            )}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}