import {
  CalendarDaysIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import type {
  Availability,
  AvailabilityStatus,
} from "../models/availability";

import AvailabilityCard from "./AvailabilityCard";

interface Props {
  availabilities: Availability[];

  onCreate: () => void;

  onEdit: (
    availability: Availability,
  ) => void;

  onStatusChange: (
    availability: Availability,
    status: AvailabilityStatus,
  ) => void;

  onDelete: (
    availability: Availability,
  ) => void;

  isProcessingAvailability: (
    availabilityId: number,
  ) => boolean;
}

export default function AvailabilityList({
  availabilities,
  onCreate,
  onEdit,
  onStatusChange,
  onDelete,
  isProcessingAvailability,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Estado vacío
  |--------------------------------------------------------------------------
  */

  if (availabilities.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarDaysIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          No tienes periodos registrados
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Registra las fechas en las que estarás disponible,
          ocupado o de vacaciones para que los clientes conozcan
          tu situación laboral.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5" />

          Registrar disponibilidad
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
        {availabilities.map(
          (availability) => (
            <AvailabilityCard
              key={availability.id}
              availability={availability}
              isProcessing={isProcessingAvailability(
                availability.id,
              )}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ),
        )}
      </div>
    </section>
  );
}