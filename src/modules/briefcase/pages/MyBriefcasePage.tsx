import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PhotoIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import BriefcaseForm from "../components/BriefcaseForm";
import BriefcaseList from "../components/BriefcaseList";
import { useMyBriefcases } from "../hooks/useMyBriefcases";

export default function MyBriefcasePage() {
  const {
    freelancerProfile,
    briefcases,

    selectedBriefcase,
    isFormOpen,

    isLoading,
    profileMissing,
    error,

    projectsWithImageCount,
    projectsWithLinkCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleBriefcaseCreated,
    handleBriefcaseUpdated,

    handleDeleteImage,
    handleDeleteBriefcase,

    isProcessingBriefcase,
    reloadBriefcases,
  } = useMyBriefcases();

  /*
  |--------------------------------------------------------------------------
  | Estado de carga
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-40 rounded bg-border" />

          <div className="mt-4 h-8 w-72 max-w-full rounded bg-border" />

          <div className="mt-4 h-4 w-full max-w-xl rounded bg-border" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="h-10 w-10 rounded-xl bg-border" />

              <div className="mt-4 h-4 w-28 rounded bg-border" />

              <div className="mt-3 h-7 w-16 rounded bg-border" />
            </article>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
            >
              <div className="aspect-[16/10] animate-pulse bg-border" />

              <div className="animate-pulse p-6">
                <div className="h-6 w-3/4 rounded bg-border" />

                <div className="mt-5 h-4 w-full rounded bg-border" />

                <div className="mt-3 h-4 w-5/6 rounded bg-border" />

                <div className="mt-3 h-4 w-2/3 rounded bg-border" />
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Perfil profesional no registrado
  |--------------------------------------------------------------------------
  */

  if (profileMissing) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            Portafolio profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mi portafolio
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Agrega proyectos y trabajos realizados para demostrar tu
            experiencia a los clientes de WorkLink.
          </p>
        </section>

        <section className="rounded-2xl border border-warning/30 bg-warning/5 p-6 text-center shadow-card sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <UserCircleIcon className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-text">
            Primero debes completar tu perfil profesional
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted">
            Para administrar un portafolio necesitas tener registrado
            tu perfil de freelancer con especialidad, experiencia,
            ubicación y demás información profesional.
          </p>

          <Link
            to="/dashboard/perfil"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
          >
            <UserCircleIcon className="h-5 w-5" />
            Completar perfil profesional
          </Link>
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            Portafolio profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mi portafolio
          </h1>
        </section>

        <section className="rounded-2xl border border-danger/30 bg-danger/5 p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text">
                  No se pudo cargar el portafolio
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void reloadBriefcases()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Intentar de nuevo
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              Portafolio profesional
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Mi portafolio
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Publica tus mejores proyectos para mostrar tus
              habilidades, experiencia y resultados profesionales.
            </p>

            {freelancerProfile?.specialty && (
              <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                Especialidad: {freelancerProfile.specialty}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
          >
            <PlusIcon className="h-5 w-5" />
            Agregar proyecto
          </button>
        </div>
      </section>

      {/* Resumen */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Proyectos totales
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {briefcases.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Proyectos con imagen
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {projectsWithImageCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <PhotoIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Proyectos con enlace
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {projectsWithLinkCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <LinkIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Encabezado del listado */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Proyectos publicados
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-muted">
            Administra la información, imagen y enlace de cada trabajo
            agregado a tu portafolio.
          </p>
        </div>

        {briefcases.length > 0 && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
            Agregar proyecto
          </button>
        )}
      </section>

      {/* Lista de proyectos */}
      <BriefcaseList
        briefcases={briefcases}
        onCreate={openCreateForm}
        onEdit={openEditForm}
        onDeleteImage={(briefcase) =>
          void handleDeleteImage(briefcase)
        }
        onDelete={(briefcase) =>
          void handleDeleteBriefcase(briefcase)
        }
        isProcessingBriefcase={isProcessingBriefcase}
      />

      {/* Formulario */}
      {isFormOpen && (
        <BriefcaseForm
          briefcase={selectedBriefcase}
          onCreated={handleBriefcaseCreated}
          onUpdated={handleBriefcaseUpdated}
          onClose={closeForm}
        />
      )}
    </div>
  );
}