import {
  BriefcaseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Application } from "../models/application";

import ReceivedApplicationCard from "./ReceivedApplicationCard";

interface Props {
  applications: Application[];
  hasActiveFilters: boolean;

  onResetFilters: () => void;

  onView: (
    application: Application,
  ) => void;

  onAccept: (
    application: Application,
  ) => void;

  onReject: (
    application: Application,
  ) => void;

  isProcessingApplication: (
    applicationId: number,
  ) => boolean;
}

export default function ReceivedApplicationList({
  applications,
  hasActiveFilters,
  onResetFilters,
  onView,
  onAccept,
  onReject,
  isProcessingApplication,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Sin resultados por los filtros
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
          No hay candidatos que coincidan con la búsqueda, la
          vacante o el estado seleccionado. Prueba utilizando otros
          criterios.
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-5 py-3 font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />

          Limpiar filtros
        </button>

        <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-xl border border-border bg-background p-4 text-left">
          <FunnelIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

          <p className="text-xs leading-5 text-text-muted">
            La búsqueda puede coincidir con el nombre del candidato,
            el mensaje enviado, el título de la vacante o su categoría.
          </p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empresa sin postulaciones recibidas
  |--------------------------------------------------------------------------
  */

  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserGroupIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Todavía no has recibido postulaciones
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Cuando un freelancer se postule a una de las vacantes de
          tu empresa, podrás consultar aquí su perfil profesional,
          experiencia, mensaje y datos de contacto.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/20 bg-surface p-4">
          <div className="flex items-start gap-3 text-left">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm leading-6 text-text-muted">
              Verifica que al menos una de tus vacantes se encuentre
              abierta. Las vacantes pausadas o cerradas no pueden
              recibir nuevas postulaciones.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Listado de candidatos
  |--------------------------------------------------------------------------
  */

  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {applications.map(
          (application) => (
            <ReceivedApplicationCard
              key={application.id}
              application={application}
              isProcessing={isProcessingApplication(
                application.id,
              )}
              onView={onView}
              onAccept={onAccept}
              onReject={onReject}
            />
          ),
        )}
      </div>
    </section>
  );
}