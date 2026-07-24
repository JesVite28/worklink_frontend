import {
  BriefcaseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Application } from "../models/application";

import MyApplicationCard from "./MyApplicationCard";

interface Props {
  applications: Application[];
  hasActiveFilters: boolean;

  onResetFilters: () => void;

  onEditMessage: (
    application: Application,
  ) => void;

  onWithdraw: (
    application: Application,
  ) => void;

  isProcessingApplication: (
    applicationId: number,
  ) => boolean;
}

export default function MyApplicationList({
  applications,
  hasActiveFilters,
  onResetFilters,
  onEditMessage,
  onWithdraw,
  isProcessingApplication,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Sin resultados por filtros
  |--------------------------------------------------------------------------
  */

  if (
    applications.length === 0 &&
    hasActiveFilters
  ) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-card sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MagnifyingGlassIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          No encontramos postulaciones
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          No existen postulaciones que coincidan con la búsqueda o
          el estado seleccionado. Prueba con otros criterios.
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-5 py-3 font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />

          Limpiar filtros
        </button>

        <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-xl border border-border bg-background p-4 text-left">
          <FunnelIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

          <p className="text-xs leading-5 text-text-muted">
            Puedes buscar por el título o categoría de la vacante,
            así como por el contenido del mensaje enviado.
          </p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Freelancer sin postulaciones
  |--------------------------------------------------------------------------
  */

  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Todavía no tienes postulaciones
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Cuando te postules a una vacante, podrás consultar aquí
          la empresa, el mensaje enviado y el estado de la solicitud.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/20 bg-surface p-4">
          <p className="text-sm leading-6 text-text-muted">
            Las postulaciones comienzan como pendientes. Mientras la
            empresa no responda, podrás editar el mensaje o retirar
            tu solicitud.
          </p>
        </div>
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
        {applications.map(
          (application) => (
            <MyApplicationCard
              key={application.id}
              application={application}
              isProcessing={isProcessingApplication(
                application.id,
              )}
              onEditMessage={onEditMessage}
              onWithdraw={onWithdraw}
            />
          ),
        )}
      </div>
    </section>
  );
}