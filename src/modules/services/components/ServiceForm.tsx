import {
  BanknotesIcon,
  BriefcaseIcon,
  CheckIcon,
  MapPinIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { FreelancerService } from "../models/service";
import { useServiceForm } from "../hooks/useServiceForm";

interface Props {
  service: FreelancerService | null;

  onCreated: (
    service: FreelancerService,
  ) => void;

  onUpdated: (
    service: FreelancerService,
  ) => void;

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

export default function ServiceForm({
  service,
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
  } = useServiceForm({
    service,
    onCreated,
    onUpdated,
    onClose,
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-form-title"
    >
      <button
        type="button"
        aria-label="Cerrar formulario"
        onClick={handleClose}
        disabled={isSaving}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseIcon className="h-6 w-6" />
            </div>

            <div>
              <h2
                id="service-form-title"
                className="text-xl font-semibold text-text"
              >
                {isEditing
                  ? "Editar servicio"
                  : "Crear servicio"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isEditing
                  ? "Actualiza la información y disponibilidad de tu servicio."
                  : "Agrega un nuevo servicio a tu perfil profesional."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-xl p-2 text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar"
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
            <section className="grid gap-5 md:grid-cols-2">
              {/* Título */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Título del servicio
                </label>

                <div className="relative">
                  <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    disabled={isSaving}
                    required
                    maxLength={150}
                    autoFocus
                    placeholder="Ej. Desarrollo de sitios web responsivos"
                    className={inputWithIconClassName}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-muted">
                    Utiliza un título claro y fácil de entender.
                  </p>

                  <span className="shrink-0 text-xs text-text-muted">
                    {form.title.length}/150
                  </span>
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Categoría
                </label>

                <div className="relative">
                  <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={form.category}
                    onChange={handleChange}
                    disabled={isSaving}
                    required
                    maxLength={100}
                    list="service-categories"
                    placeholder="Ej. Desarrollo web"
                    className={inputWithIconClassName}
                  />
                </div>

                <datalist id="service-categories">
                  <option value="Desarrollo web" />
                  <option value="Desarrollo móvil" />
                  <option value="Diseño gráfico" />
                  <option value="Marketing digital" />
                  <option value="Redacción y traducción" />
                  <option value="Fotografía y video" />
                  <option value="Soporte técnico" />
                  <option value="Consultoría" />
                  <option value="Administración" />
                  <option value="Educación" />
                </datalist>

                <p className="mt-2 text-right text-xs text-text-muted">
                  {form.category.length}/100
                </p>
              </div>

              {/* Precio */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Precio en MXN
                </label>

                <div className="relative">
                  <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    disabled={isSaving}
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="Ej. 1500.00"
                    className={inputWithIconClassName}
                  />
                </div>

                <p className="mt-2 text-xs text-text-muted">
                  Puedes dejarlo vacío cuando el precio dependa del
                  proyecto.
                </p>
              </div>

              {/* Ubicación */}
              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Ubicación del servicio
                </label>

                <div className="relative">
                  <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    disabled={isSaving}
                    maxLength={150}
                    placeholder="Ej. Pachuca, Hidalgo o servicio remoto"
                    className={inputWithIconClassName}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-muted">
                    Especifica dónde puedes proporcionar el servicio.
                  </p>

                  <span className="shrink-0 text-xs text-text-muted">
                    {form.location.length}/150
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Descripción del servicio
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={isSaving}
                  required
                  rows={7}
                  maxLength={3000}
                  placeholder="Describe qué incluye el servicio, cómo trabajas, tiempos aproximados de entrega y los resultados que recibirá el cliente."
                  className={`${inputClassName} resize-y`}
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-muted">
                    Incluye información suficiente para resolver las
                    dudas principales del cliente.
                  </p>

                  <span className="shrink-0 text-xs text-text-muted">
                    {form.description.length}/3000
                  </span>
                </div>
              </div>
            </section>

            {/* Estado */}
            <section className="rounded-2xl border border-border bg-background p-4">
              <label className="flex cursor-pointer items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-text">
                    Servicio activo
                  </p>

                  <p className="mt-1 text-sm leading-6 text-text-muted">
                    Los servicios activos pueden mostrarse públicamente
                    y estar disponibles para recibir solicitudes.
                  </p>
                </div>

                <div className="relative mt-1 shrink-0">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="peer sr-only"
                  />

                  <div className="h-6 w-11 rounded-full bg-border transition peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-60" />

                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </div>
              </label>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    form.is_active
                      ? "bg-success"
                      : "bg-text-muted",
                  ].join(" ")}
                />

                <span className="text-sm font-medium text-text">
                  {form.is_active
                    ? "El servicio se publicará como activo"
                    : "El servicio permanecerá oculto"}
                </span>
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
                ? "Guardando servicio..."
                : isEditing
                  ? "Actualizar servicio"
                  : "Crear servicio"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}