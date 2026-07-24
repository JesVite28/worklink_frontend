import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import MyApplicationPagination from "../components/MyApplicationPagination";
import ReceivedApplicationDetail from "../components/ReceivedApplicationDetail";
import ReceivedApplicationFilters from "../components/ReceivedApplicationFilters";
import ReceivedApplicationList from "../components/ReceivedApplicationList";

import { useReceivedApplications } from "../hooks/useReceivedApplications";

export default function ReceivedApplicationsPage() {
  const {
    companyProfile,
    vacancies,
    applications,
    pagination,

    selectedApplication,
    isDetailOpen,

    isLoading,
    profileMissing,
    error,

    search,
    statusFilter,
    vacancyFilter,
    perPage,
    hasActiveFilters,

    totalApplications,
    pendingApplicationsCount,
    acceptedApplicationsCount,
    rejectedApplicationsCount,

    handleSearchChange,
    handleStatusFilterChange,
    handleVacancyFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    openApplicationDetail,
    closeApplicationDetail,

    handleAcceptApplication,
    handleRejectApplication,

    isProcessingApplication,
    reloadApplications,
  } = useReceivedApplications();

  const openVacanciesCount = vacancies.filter(
    (vacancy) => vacancy.status === "open",
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Carga inicial
  |--------------------------------------------------------------------------
  */

  if (isLoading && !pagination) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-48 rounded bg-border" />

          <div className="mt-4 h-9 w-80 max-w-full rounded bg-border" />

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

        <section className="h-64 animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-5 w-52 rounded bg-border" />

          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <div className="h-12 rounded-xl bg-border" />
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
                className="h-[620px] animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-xl bg-border" />

                  <div className="h-7 w-24 rounded-full bg-border" />
                </div>

                <div className="mt-6 h-14 w-full rounded bg-border" />

                <div className="mt-6 h-40 rounded-xl bg-border" />

                <div className="mt-5 h-24 rounded-xl bg-border" />

                <div className="mt-5 h-28 rounded-xl bg-border" />
              </article>
            ),
          )}
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
            Postulaciones recibidas
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Consulta los candidatos interesados en las vacantes de
            tu empresa y administra cada solicitud.
          </p>
        </section>

        <section className="rounded-2xl border border-warning/30 bg-warning/5 p-6 text-center shadow-card sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <BuildingOffice2Icon className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-text">
            Primero debes completar el perfil empresarial
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted">
            Para publicar vacantes y recibir postulaciones necesitas
            contar con un perfil empresarial asociado a tu cuenta.
          </p>

          <Link
            to="/dashboard/perfil"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90"
          >
            <BuildingOffice2Icon className="h-5 w-5" />

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
            Postulaciones recibidas
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
              Reclutamiento empresarial
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Postulaciones recibidas
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Revisa los perfiles interesados en tus vacantes,
              consulta sus mensajes y decide qué candidatos continúan
              en el proceso.
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

          <Link
            to="/dashboard/vacantes"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
          >
            <BriefcaseIcon className="h-5 w-5" />

            Administrar vacantes
          </Link>
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
              <UserGroupIcon className="h-6 w-6" />
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <UserGroupIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

            <div>
              <h2 className="font-semibold text-text">
                Evaluación de candidatos
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-text-muted">
                Puedes aceptar o rechazar únicamente las postulaciones
                pendientes. Después de registrar una decisión, el estado
                queda finalizado y no puede modificarse nuevamente.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-primary/20 bg-surface px-4 py-3 text-sm">
            <p className="text-text-muted">
              Vacantes abiertas
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              {openVacanciesCount}
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <ReceivedApplicationFilters
        vacancies={vacancies}
        search={search}
        statusFilter={statusFilter}
        vacancyFilter={vacancyFilter}
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
        onVacancyFilterChange={
          handleVacancyFilterChange
        }
        onPerPageChange={
          handlePerPageChange
        }
        onResetFilters={resetFilters}
      />

      {/* Recarga por filtros */}
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
        <ReceivedApplicationList
          applications={applications}
          hasActiveFilters={
            hasActiveFilters
          }
          onResetFilters={resetFilters}
          onView={openApplicationDetail}
          onAccept={(application) =>
            void handleAcceptApplication(
              application,
            )
          }
          onReject={(application) =>
            void handleRejectApplication(
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

      {/* Detalle */}
      {isDetailOpen && (
        <ReceivedApplicationDetail
          application={selectedApplication}
          isProcessing={
            selectedApplication
              ? isProcessingApplication(
                  selectedApplication.id,
                )
              : false
          }
          onAccept={(application) =>
            void handleAcceptApplication(
              application,
            )
          }
          onReject={(application) =>
            void handleRejectApplication(
              application,
            )
          }
          onClose={closeApplicationDetail}
        />
      )}
    </div>
  );
}