import {
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Availability } from "../models/availability";
import { useAvailabilityForm } from "../hooks/useAvailabilityForm";

interface Props {
  availability: Availability | null;

  onCreated: (
    availability: Availability,
  ) => void;

  onUpdated: (
    availability: Availability,
  ) => void;

  onClose: () => void;
}

const inputClassName = [
  "w-full rounded-xl border border-border bg-background",
  "px-4 py-3 text-text outline-none transition",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const inputWithIconClassName = [
  "w-full rounded-xl border border-border bg-background",
  "py-3 pl-11 pr-4 text-text outline-none transition",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

export default function AvailabilityForm({
  availability,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const {
    form,

    isEditing,
    isSaving,

    minimumStartDate,
    minimumEndDate,

    handleChange,
    handleSubmit,
    handleClose,
  } = useAvailabilityForm({
    availability,
    onCreated,
    onUpdated,
    onClose,
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="availability-form-title"
    >
      {/* Fondo */}
      <button
        type="button"
        aria-label="Cerrar formulario"
        onClick={handleClose}
        disabled={isSaving}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDaysIcon className="h-6 w-6" />
            </div>

            <div>
              <h2
                id="availability-form-title"
                className="text-xl font-semibold text-text"
              >
                {isEditing
                  ? "Editar disponibilidad"
                  : "Registrar disponibilidad"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isEditing
                  ? "Actualiza las fechas o el estado del periodo seleccionado."
                  : "Indica el periodo y el estado de tu disponibilidad profesional."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
            {/* Fechas */}
            <section>
              <div className="mb-5 flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

                <div>
                  <h3 className="font-semibold text-text">
                    Periodo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    Selecciona la fecha en la que comienza y termina este
                    periodo.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Fecha inicial */}
                <div>
                  <label
                    htmlFor="availability-start-date"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Fecha inicial
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="availability-start-date"
                      name="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      disabled={isSaving}
                      min={minimumStartDate}
                      required
                      className={inputWithIconClassName}
                    />
                  </div>
                </div>

                {/* Fecha final */}
                <div>
                  <label
                    htmlFor="availability-end-date"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Fecha final
                  </label>

                  <div className="relative">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="availability-end-date"
                      name="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      disabled={
                        isSaving ||
                        !form.start_date
                      }
                      min={minimumEndDate}
                      required
                      className={inputWithIconClassName}
                    />
                  </div>

                  {!form.start_date && (
                    <p className="mt-2 text-xs text-text-muted">
                      Primero selecciona la fecha inicial.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Estado */}
            <section className="border-t border-border pt-6">
              <div className="mb-5 flex items-start gap-3">
                <ExclamationCircleIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

                <div>
                  <h3 className="font-semibold text-text">
                    Estado del periodo
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    Define si durante esas fechas estás disponible, ocupado
                    o de vacaciones.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="availability-status"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Estado
                </label>

                <select
                  id="availability-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                  className={inputClassName}
                >
                  <option value="available">
                    Disponible
                  </option>

                  <option value="busy">
                    Ocupado
                  </option>

                  <option value="vacation">
                    Vacaciones
                  </option>
                </select>
              </div>

              {/* Vista del estado */}
              <div className="mt-4">
                {form.status === "available" && (
                  <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-success" />

                      <div>
                        <p className="font-medium text-text">
                          Disponible
                        </p>

                        <p className="mt-1 text-sm leading-6 text-text-muted">
                          Durante este periodo puedes recibir solicitudes
                          y comenzar nuevos proyectos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {form.status === "busy" && (
                  <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-warning" />

                      <div>
                        <p className="font-medium text-text">
                          Ocupado
                        </p>

                        <p className="mt-1 text-sm leading-6 text-text-muted">
                          Durante este periodo estás trabajando en otros
                          proyectos y podrías no aceptar solicitudes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {form.status === "vacation" && (
                  <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-secondary" />

                      <div>
                        <p className="font-medium text-text">
                          Vacaciones
                        </p>

                        <p className="mt-1 text-sm leading-6 text-text-muted">
                          Este periodo será identificado como tiempo de
                          descanso o ausencia.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Advertencia */}
            <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-6 text-text-muted">
                  Los periodos no pueden superponerse con otra
                  disponibilidad registrada. La fecha final debe ser igual
                  o posterior a la fecha inicial.
                </p>
              </div>
            </section>
          </div>

          {/* Acciones */}
          <footer className="flex flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <CheckIcon className="h-5 w-5" />
              )}

              {isSaving
                ? "Guardando disponibilidad..."
                : isEditing
                  ? "Actualizar disponibilidad"
                  : "Registrar disponibilidad"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}