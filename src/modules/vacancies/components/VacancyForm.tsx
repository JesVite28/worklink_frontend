import {
  BanknotesIcon,
  BriefcaseIcon,
  CheckIcon,
  DocumentTextIcon,
  MapPinIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Vacancy } from "../models/vacancy";
import { useVacancyForm } from "../hooks/useVacancyForm";

interface Props {
  vacancy: Vacancy | null;

  onCreated: (vacancy: Vacancy) => void;

  onUpdated: (vacancy: Vacancy) => void;

  onClose: () => void;
}

const inputClassName = [
  "w-full rounded-xl border border-border bg-background",
  "px-4 py-3 text-text outline-none transition",
  "placeholder:text-text-muted",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const inputWithIconClassName = [
  "w-full rounded-xl border border-border bg-background",
  "py-3 pl-11 pr-4 text-text outline-none transition",
  "placeholder:text-text-muted",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

export default function VacancyForm({
  vacancy,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const {
    form,

    isEditing,
    isSaving,

    handleChange,
    handleSubmit,
    handleClose,
  } = useVacancyForm({
    vacancy,
    onCreated,
    onUpdated,
    onClose,
  });

  const isClosed = vacancy?.status === "closed";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vacancy-form-title"
    >
      {/* Fondo */}
      <button
        type="button"
        aria-label="Cerrar formulario"
        onClick={handleClose}
        disabled={isSaving}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseIcon className="h-6 w-6" />
            </div>

            <div>
              <h2
                id="vacancy-form-title"
                className="text-xl font-semibold text-text"
              >
                {isEditing
                  ? "Editar vacante"
                  : "Publicar vacante"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isEditing
                  ? "Actualiza la información y el estado de la oportunidad laboral."
                  : "Registra una nueva oportunidad para recibir postulaciones de freelancers."}
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
            {/* Información principal */}
            <section>
              <div className="mb-5">
                <h3 className="font-semibold text-text">
                  Información de la vacante
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-muted">
                  Describe claramente el puesto, las actividades y el
                  perfil profesional que busca la empresa.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Título */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="vacancy-title"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Título de la vacante
                  </label>

                  <div className="relative">
                    <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="vacancy-title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      disabled={isSaving || isClosed}
                      required
                      maxLength={150}
                      autoFocus
                      placeholder="Ej. Desarrollador Laravel"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      Usa un título breve y fácil de identificar.
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {form.title.length}/150
                    </span>
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label
                    htmlFor="vacancy-category"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Categoría
                  </label>

                  <div className="relative">
                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="vacancy-category"
                      name="category"
                      type="text"
                      value={form.category}
                      onChange={handleChange}
                      disabled={isSaving || isClosed}
                      required
                      maxLength={100}
                      list="vacancy-categories"
                      placeholder="Ej. Desarrollo de software"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <datalist id="vacancy-categories">
                    <option value="Desarrollo de software" />
                    <option value="Desarrollo web" />
                    <option value="Desarrollo móvil" />
                    <option value="Diseño gráfico" />
                    <option value="Marketing digital" />
                    <option value="Redacción y traducción" />
                    <option value="Fotografía y video" />
                    <option value="Soporte técnico" />
                    <option value="Administración" />
                    <option value="Consultoría" />
                  </datalist>

                  <p className="mt-2 text-right text-xs text-text-muted">
                    {form.category.length}/100
                  </p>
                </div>

                {/* Ubicación */}
                <div>
                  <label
                    htmlFor="vacancy-location"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Ubicación o modalidad
                  </label>

                  <div className="relative">
                    <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="vacancy-location"
                      name="location"
                      type="text"
                      value={form.location}
                      onChange={handleChange}
                      disabled={isSaving || isClosed}
                      required
                      maxLength={150}
                      placeholder="Ej. Pachuca, Hidalgo o modalidad remota"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <p className="mt-2 text-right text-xs text-text-muted">
                    {form.location.length}/150
                  </p>
                </div>

                {/* Salario */}
                <div>
                  <label
                    htmlFor="vacancy-salary"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Salario en MXN
                  </label>

                  <div className="relative">
                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="vacancy-salary"
                      name="salary"
                      type="number"
                      value={form.salary}
                      onChange={handleChange}
                      disabled={isSaving || isClosed}
                      min="0"
                      max="9999999999.99"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="Ej. 18000.00"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <p className="mt-2 text-xs text-text-muted">
                    Puedes dejar el campo vacío cuando el salario sea
                    negociable.
                  </p>
                </div>

                {/* Estado */}
                <div>
                  <label
                    htmlFor="vacancy-status"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Estado de la vacante
                  </label>

                  <select
                    id="vacancy-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={isSaving || isClosed}
                    required
                    className={inputClassName}
                  >
                    <option value="open">
                      Abierta
                    </option>

                    <option value="paused">
                      Pausada
                    </option>

                    {isEditing && (
                      <option value="closed">
                        Cerrada
                      </option>
                    )}
                  </select>

                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    Las vacantes abiertas reciben postulaciones. Las
                    pausadas permanecen registradas, pero no aceptan nuevas
                    solicitudes.
                  </p>
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="vacancy-description"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Descripción de la vacante
                  </label>

                  <div className="relative">
                    <DocumentTextIcon className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-text-muted" />

                    <textarea
                      id="vacancy-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      disabled={isSaving || isClosed}
                      required
                      rows={9}
                      maxLength={10000}
                      placeholder="Describe las actividades, requisitos, conocimientos necesarios, responsabilidades y condiciones de la vacante."
                      className={`${inputClassName} resize-y pl-11`}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      Incluye suficiente información para que los
                      freelancers determinen si cumplen con el perfil.
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {form.description.length}/10000
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Vista del estado */}
            <section className="border-t border-border pt-6">
              {form.status === "open" && (
                <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-success" />

                    <div>
                      <p className="font-medium text-text">
                        Vacante abierta
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        Esta vacante podrá mostrarse públicamente y
                        recibirá postulaciones de freelancers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {form.status === "paused" && (
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-warning" />

                    <div>
                      <p className="font-medium text-text">
                        Vacante pausada
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        La vacante permanecerá guardada, pero dejará de
                        mostrarse públicamente y no aceptará postulaciones.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {form.status === "closed" && (
                <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-danger" />

                    <div>
                      <p className="font-medium text-text">
                        Vacante cerrada
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        Al cerrar la vacante ya no podrá editarse ni volver
                        a abrirse. Verifica toda la información antes de
                        guardar este estado.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
              {isClosed ? "Cerrar" : "Cancelar"}
            </button>

            {!isClosed && (
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
                  ? "Guardando vacante..."
                  : isEditing
                    ? "Actualizar vacante"
                    : "Publicar vacante"}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}