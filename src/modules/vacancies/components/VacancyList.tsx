import {
  BriefcaseIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import type {
  Vacancy,
  VacancyStatus,
} from "../models/vacancy";

import VacancyCard from "./VacancyCard";

interface Props {
  vacancies: Vacancy[];

  onCreate: () => void;

  onEdit: (vacancy: Vacancy) => void;

  onStatusChange: (
    vacancy: Vacancy,
    status: VacancyStatus,
  ) => void;

  onDelete: (vacancy: Vacancy) => void;

  isProcessingVacancy: (
    vacancyId: number,
  ) => boolean;
}

export default function VacancyList({
  vacancies,
  onCreate,
  onEdit,
  onStatusChange,
  onDelete,
  isProcessingVacancy,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Estado vacío
  |--------------------------------------------------------------------------
  */

  if (vacancies.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          No tienes vacantes publicadas
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Publica la primera oportunidad laboral de tu empresa
          para comenzar a recibir postulaciones de freelancers.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5" />

          Publicar primera vacante
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
        {vacancies.map((vacancy) => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            isProcessing={isProcessingVacancy(
              vacancy.id,
            )}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}