import {
  BriefcaseIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import type { BriefcaseProject } from "../models/briefcase";
import BriefcaseCard from "./BriefcaseCard";

interface Props {
  briefcases: BriefcaseProject[];

  onCreate: () => void;

  onEdit: (
    briefcase: BriefcaseProject,
  ) => void;

  onDeleteImage: (
    briefcase: BriefcaseProject,
  ) => void;

  onDelete: (
    briefcase: BriefcaseProject,
  ) => void;

  isProcessingBriefcase: (
    briefcaseId: number,
  ) => boolean;
}

export default function BriefcaseList({
  briefcases,
  onCreate,
  onEdit,
  onDeleteImage,
  onDelete,
  isProcessingBriefcase,
}: Props) {
  /*
  |--------------------------------------------------------------------------
  | Estado vacío
  |--------------------------------------------------------------------------
  */

  if (briefcases.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Tu portafolio está vacío
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Agrega proyectos realizados para mostrar tu experiencia,
          habilidades y resultados a los clientes de WorkLink.
        </p>

        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
        >
          <PlusIcon className="h-5 w-5" />
          Agregar primer proyecto
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
        {briefcases.map((briefcase) => (
          <BriefcaseCard
            key={briefcase.id}
            briefcase={briefcase}
            isProcessing={isProcessingBriefcase(
              briefcase.id,
            )}
            onEdit={onEdit}
            onDeleteImage={onDeleteImage}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}