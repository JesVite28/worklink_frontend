import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  NoSymbolIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import VacancyForm from "../components/VacancyForm";
import VacancyList from "../components/VacancyList";
import { useMyVacancies } from "../hooks/useMyVacancies";

export default function MyVacanciesPage() {
  const {
    companyProfile,
    vacancies,

    selectedVacancy,
    isFormOpen,

    isLoading,
    profileMissing,
    error,

    openVacanciesCount,
    pausedVacanciesCount,
    closedVacanciesCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleVacancyCreated,
    handleVacancyUpdated,

    handleStatusChange,
    handleDeleteVacancy,

    isProcessingVacancy,
    reloadVacancies,
  } = useMyVacancies();

  /*
  |--------------------------------------------------------------------------
  | Cargando
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-40 rounded bg-border" />

          <div className="mt-4 h-9 w-72 max-w-full rounded bg-border" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-border" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="h-11 w-11 rounded-xl bg-border" />

              <div className="mt-4 h-4 w-28 rounded bg-border" />

              <div className="mt-3 h-7 w-16 rounded bg-border" />
            </article>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="h-[520px] animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-border" />

                <div className="h-7 w-24 rounded-full bg-border" />
              </div>

              <div className="mt-6 h-6 w-3/4 rounded bg-border" />

              <div className="mt-4 h-4 w-full rounded bg-border" />

              <div className="mt-3 h-4 w-5/6 rounded bg-border" />

              <div className="mt-8 h-44 rounded-xl bg-border" />

              <div className="mt-6 h-11 rounded-xl bg-border" />
            </article>
          ))}
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Perfil empresarial faltante
  |--------------------------------------------------------------------------
  */

  if (profileMissing) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            Reclutamiento empresarial
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis vacantes
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Publica oportunidades laborales y administra las
            postulaciones que recibe tu empresa.
          </p>
        </section>

        <section className="rounded-2xl border border-warning/30 bg-warning/5 p-6 text-center shadow-card sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <BuildingOffice2Icon className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-text">
            Primero debes completar el perfil de tu empresa
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted">
            Para publicar vacantes necesitas contar con un perfil
            empresarial asociado a tu cuenta.
          </p>

          <Link
            to="/dashboard/perfil"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
          >
            <UserCircleIcon className="h-5 w-5" />
            Completar perfil empresarial
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
            Reclutamiento empresarial
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis vacantes
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
                  No se pudieron cargar las vacantes
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void reloadVacancies()}
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
              Reclutamiento empresarial
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Mis vacantes
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Publica oportunidades laborales, controla su estado y
              administra las vacantes de tu empresa.
            </p>

            {companyProfile && (
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                  <BuildingOffice2Icon className="h-4 w-4" />
                  {companyProfile.company_name}
                </span>

                {companyProfile.industry && (
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur">
                    {companyProfile.industry}
                  </span>
                )}

                {companyProfile.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/90 backdrop-blur">
                    <MapPinIcon className="h-4 w-4" />
                    {companyProfile.location}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
          >
            <PlusIcon className="h-5 w-5" />
            Publicar vacante
          </button>
        </div>
      </section>

      {/* Contadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Vacantes totales
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {vacancies.length}
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
                Abiertas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {openVacanciesCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Pausadas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {pausedVacanciesCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Cerradas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {closedVacanciesCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <NoSymbolIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Aviso */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <BriefcaseIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold text-text">
              Administración de vacantes
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Las vacantes abiertas se muestran públicamente y aceptan
              postulaciones. Las pausadas pueden volver a abrirse, pero
              una vacante cerrada queda bloqueada permanentemente.
            </p>
          </div>
        </div>
      </section>

      {/* Encabezado del listado */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Vacantes publicadas
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-muted">
            Consulta y administra las oportunidades laborales
            registradas por tu empresa.
          </p>
        </div>

        {vacancies.length > 0 && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
            Nueva vacante
          </button>
        )}
      </section>

      {/* Listado */}
      <VacancyList
        vacancies={vacancies}
        onCreate={openCreateForm}
        onEdit={openEditForm}
        onStatusChange={(vacancy, status) =>
          void handleStatusChange(
            vacancy,
            status,
          )
        }
        onDelete={(vacancy) =>
          void handleDeleteVacancy(vacancy)
        }
        isProcessingVacancy={
          isProcessingVacancy
        }
      />

      {/* Formulario */}
      {isFormOpen && (
        <VacancyForm
          vacancy={selectedVacancy}
          onCreated={handleVacancyCreated}
          onUpdated={handleVacancyUpdated}
          onClose={closeForm}
        />
      )}
    </div>
  );
}