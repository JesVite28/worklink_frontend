import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  SunIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import AvailabilityForm from "../components/AvailabilityForm";
import AvailabilityList from "../components/AvailabilityList";
import { useMyAvailabilities } from "../hooks/useMyAvailabilities";

export default function MyAvailabilityPage() {
  const {
    freelancerProfile,
    availabilities,

    selectedAvailability,
    isFormOpen,

    isLoading,
    profileMissing,
    error,

    availableCount,
    busyCount,
    vacationCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleAvailabilityCreated,
    handleAvailabilityUpdated,

    handleStatusChange,
    handleDeleteAvailability,

    isProcessingAvailability,
    reloadAvailabilities,
  } = useMyAvailabilities();

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

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
              className="h-[420px] animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-border" />

                <div className="h-7 w-24 rounded-full bg-border" />
              </div>

              <div className="mt-6 h-6 w-3/4 rounded bg-border" />

              <div className="mt-4 h-4 w-full rounded bg-border" />

              <div className="mt-3 h-4 w-5/6 rounded bg-border" />

              <div className="mt-8 h-40 rounded-xl bg-border" />
            </article>
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
            Calendario profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mi disponibilidad
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            Registra los periodos en los que estarás disponible,
            ocupado o de vacaciones.
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
            Para registrar periodos de disponibilidad necesitas tener
            un perfil freelancer asociado a tu cuenta.
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
            Calendario profesional
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Mi disponibilidad
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
                  No se pudo cargar la disponibilidad
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void reloadAvailabilities()}
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
              Calendario profesional
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Mi disponibilidad
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Organiza tus periodos laborales para indicar cuándo
              puedes recibir nuevos proyectos.
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
            Registrar periodo
          </button>
        </div>
      </section>

      {/* Resumen */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Periodos totales
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {availabilities.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Disponibles
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {availableCount}
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
                Ocupados
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {busyCount}
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
                Vacaciones
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {vacationCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <SunIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Información */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CalendarDaysIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

          <div>
            <h2 className="font-semibold text-text">
              Organización de periodos
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Los rangos no pueden superponerse. Puedes cambiar
              rápidamente el estado de un periodo desde cada tarjeta o
              editar sus fechas mediante el formulario.
            </p>
          </div>
        </div>
      </section>

      {/* Encabezado del listado */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">
            Periodos registrados
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-muted">
            Consulta y administra las fechas asociadas a tu
            disponibilidad profesional.
          </p>
        </div>

        {availabilities.length > 0 && (
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
            Registrar periodo
          </button>
        )}
      </section>

      {/* Lista */}
      <AvailabilityList
        availabilities={availabilities}
        onCreate={openCreateForm}
        onEdit={openEditForm}
        onStatusChange={(availability, status) =>
          void handleStatusChange(
            availability,
            status,
          )
        }
        onDelete={(availability) =>
          void handleDeleteAvailability(
            availability,
          )
        }
        isProcessingAvailability={
          isProcessingAvailability
        }
      />

      {/* Formulario */}
      {isFormOpen && (
        <AvailabilityForm
          availability={selectedAvailability}
          onCreated={handleAvailabilityCreated}
          onUpdated={handleAvailabilityUpdated}
          onClose={closeForm}
        />
      )}
    </div>
  );
}