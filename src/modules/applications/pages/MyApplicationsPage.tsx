import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import ApplicationMessageForm from "../components/ApplicationMessageForm";
import MyApplicationFilters from "../components/MyApplicationFilters";
import MyApplicationList from "../components/MyApplicationList";
import MyApplicationPagination from "../components/MyApplicationPagination";

import { useMyApplications } from "../hooks/useMyApplications";

export default function MyApplicationsPage() {
  const {
    applications,
    pagination,

    selectedApplication,
    isMessageFormOpen,

    isLoading,
    profileMissing,
    error,

    search,
    statusFilter,
    perPage,
    hasActiveFilters,

    totalApplications,
    pendingApplicationsCount,
    acceptedApplicationsCount,
    rejectedApplicationsCount,

    handleSearchChange,
    handleStatusFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    openMessageForm,
    closeMessageForm,

    handleApplicationUpdated,
    handleWithdrawApplication,

    isProcessingApplication,
    reloadApplications,
  } = useMyApplications();

  /*
  |--------------------------------------------------------------------------
  | Estado de carga inicial
  |--------------------------------------------------------------------------
  */

  if (isLoading && !pagination) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-40 rounded bg-border" />

          <div className="mt-4 h-9 w-72 max-w-full rounded bg-border" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-border" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <article
                key={index}
                className="h-32 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
              >
                <div className="h-11 w-11 rounded-xl bg-border" />

                <div className="mt-4 h-4 w-28 rounded bg-border" />

                <div className="mt-3 h-7 w-16 rounded bg-border" />
              </article>
            ),
          )}
        </section>

        <section className="h-52 animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-5 w-44 rounded bg-border" />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="h-12 rounded-xl bg-border" />
            <div className="h-12 rounded-xl bg-border" />
            <div className="h-12 rounded-xl bg-border" />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <article
                key={index}
                className="h-[560px] animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-border" />

                  <div className="h-7 w-24 rounded-full bg-border" />
                </div>

                <div className="mt-6 h-6 w-3/4 rounded bg-border" />

                <div className="mt-4 h-4 w-full rounded bg-border" />

                <div className="mt-3 h-4 w-5/6 rounded bg-border" />

                <div className="mt-8 h-52 rounded-xl bg-border" />

                <div className="mt-6 h-24 rounded-xl bg-border" />
              </article>
            ),
          )}
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Perfil freelancer faltante
  |--------------------------------------------------------------------------
  */

  if (profileMissing) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            Seguimiento profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis postulaciones
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Consulta el estado de las vacantes a las que te
            has postulado y administra tus solicitudes pendientes.
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
            Para postularte a vacantes y consultar tus solicitudes
            necesitas tener un perfil freelancer asociado a tu cuenta.
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
            Seguimiento profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis postulaciones
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
                  No se pudieron cargar las postulaciones
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void reloadApplications()
              }
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
              Seguimiento profesional
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Mis postulaciones
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Revisa las vacantes a las que te has postulado,
              consulta la respuesta de las empresas y administra
              las solicitudes que siguen pendientes.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl bg-white/10 text-white backdrop-blur sm:self-auto">
            <DocumentMagnifyingGlassIcon className="h-8 w-8" />
          </div>
        </div>
      </section>

      {/* Contadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Postulaciones totales
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {totalApplications}
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
                Pendientes
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {pendingApplicationsCount}
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
                Aceptadas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {acceptedApplicationsCount}
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
                Rechazadas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {rejectedApplicationsCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <XCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Información */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ClockIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold text-text">
              Administración de solicitudes
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Mientras una postulación permanezca pendiente puedes
              editar el mensaje o retirarla. Después de que la empresa
              la acepte o rechace, la solicitud quedará finalizada y
              ya no podrá modificarse.
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <MyApplicationFilters
        search={search}
        statusFilter={statusFilter}
        perPage={perPage}
        totalResults={
          pagination?.total ?? 0
        }
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={
          handleStatusFilterChange
        }
        onPerPageChange={
          handlePerPageChange
        }
        onResetFilters={resetFilters}
      />

      {/* Carga de filtros o paginación */}
      {isLoading && pagination && (
        <section className="flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-10 shadow-card">
          <div className="flex items-center gap-3 text-text-muted">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

            <p className="text-sm font-medium">
              Actualizando postulaciones...
            </p>
          </div>
        </section>
      )}

      {/* Listado */}
      {!isLoading && (
        <MyApplicationList
          applications={applications}
          hasActiveFilters={
            hasActiveFilters
          }
          onResetFilters={resetFilters}
          onEditMessage={openMessageForm}
          onWithdraw={(application) =>
            void handleWithdrawApplication(
              application,
            )
          }
          isProcessingApplication={
            isProcessingApplication
          }
        />
      )}

      {/* Paginación */}
      <MyApplicationPagination
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />

      {/* Formulario para editar mensaje */}
      {isMessageFormOpen && (
        <ApplicationMessageForm
          application={selectedApplication}
          onUpdated={
            handleApplicationUpdated
          }
          onClose={closeMessageForm}
        />
      )}
    </div>
  );
}