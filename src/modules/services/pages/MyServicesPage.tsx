import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeSlashIcon,
  PlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import ServiceForm from "../components/ServiceForm";
import ServicesList from "../components/ServicesList";
import { useMyServices } from "../hooks/useMyServices";

export default function MyServicesPage() {
  const {
    freelancerProfile,
    services,

    selectedService,
    isFormOpen,

    isLoading,
    profileMissing,
    error,

    activeServicesCount,
    inactiveServicesCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleServiceCreated,
    handleServiceUpdated,
    handleToggleStatus,
    handleDeleteService,

    isProcessingService,
    reloadServices,
  } = useMyServices();

  /*
  |--------------------------------------------------------------------------
  | Cargando
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-36 rounded bg-border" />
          <div className="mt-4 h-8 w-72 max-w-full rounded bg-border" />
          <div className="mt-4 h-4 w-full max-w-xl rounded bg-border" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="h-10 w-10 rounded-xl bg-border" />
              <div className="mt-4 h-4 w-24 rounded bg-border" />
              <div className="mt-3 h-7 w-16 rounded bg-border" />
            </div>
          ))}
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="h-6 w-24 rounded bg-border" />
              <div className="mt-5 h-7 w-3/4 rounded bg-border" />
              <div className="mt-5 h-4 w-full rounded bg-border" />
              <div className="mt-3 h-4 w-5/6 rounded bg-border" />
              <div className="mt-3 h-4 w-2/3 rounded bg-border" />
            </div>
          ))}
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Perfil profesional inexistente
  |--------------------------------------------------------------------------
  */

  if (profileMissing) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            Administración de servicios
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis servicios
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Publica y administra los servicios que ofrecerás a los
            clientes de WorkLink.
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
            Para publicar servicios necesitas registrar tu especialidad,
            experiencia, ubicación, tarifa e idiomas en tu perfil de
            freelancer.
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
            Administración de servicios
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mis servicios
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
                  No se pudieron cargar los servicios
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void reloadServices()}
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
              Administración de servicios
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Mis servicios
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Publica, actualiza y controla los servicios que muestras
              en tu perfil profesional.
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
            Nuevo servicio
          </button>
        </div>
      </section>

      {/* Resumen */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Servicios totales
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {services.length}
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
                Servicios activos
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {activeServicesCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Servicios inactivos
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {inactiveServicesCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-text-muted/10 text-text-muted">
              <EyeSlashIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Encabezado del listado */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Servicios publicados
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Administra la información, visibilidad y disponibilidad de
            cada servicio.
          </p>
        </div>

        {services.length > 0 && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
            Agregar servicio
          </button>
        )}
      </section>

      {/* Listado */}
      <ServicesList
        services={services}
        onCreate={openCreateForm}
        onEdit={openEditForm}
        onToggleStatus={(service) =>
          void handleToggleStatus(service)
        }
        onDelete={(service) =>
          void handleDeleteService(service)
        }
        isProcessingService={isProcessingService}
      />

      {/* Formulario modal */}
      {isFormOpen && (
        <ServiceForm
          service={selectedService}
          onCreated={handleServiceCreated}
          onUpdated={handleServiceUpdated}
          onClose={closeForm}
        />
      )}
    </div>
  );
}