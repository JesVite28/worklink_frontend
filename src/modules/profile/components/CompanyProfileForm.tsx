import {
  BuildingOffice2Icon,
  CheckIcon,
  DocumentTextIcon,
  MapPinIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

import type { CompanyProfile } from "../models/profile";
import { useCompanyProfileForm } from "../hooks/useCompanyProfileForm";

interface Props {
  profile: CompanyProfile | null;
  onSaved: (profile: CompanyProfile) => void;
}

const inputClassName = [
  "w-full rounded-xl border border-border bg-background",
  "px-4 py-3 text-text outline-none transition",
  "placeholder:text-text-muted",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
].join(" ");

const inputWithIconClassName = [
  "w-full rounded-xl border border-border bg-background",
  "py-3 pl-11 pr-4 text-text outline-none transition",
  "placeholder:text-text-muted",
  "focus:border-primary focus:ring-2 focus:ring-primary/20",
].join(" ");

export default function CompanyProfileForm({
  profile,
  onSaved,
}: Props) {
  const {
    form,
    handleChange,
    handleSubmit,
    isEditing,
    isSaving,
  } = useCompanyProfileForm({
    profile,
    onSaved,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BuildingOffice2Icon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              Información de la empresa
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Agrega los datos públicos que ayudarán a los freelancers
              y clientes a conocer mejor tu organización.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label
              htmlFor="company_name"
              className="mb-2 block text-sm font-medium text-text"
            >
              Nombre de la empresa
            </label>

            <div className="relative">
              <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="company_name"
                name="company_name"
                type="text"
                value={form.company_name}
                onChange={handleChange}
                required
                maxLength={150}
                autoComplete="organization"
                placeholder="Ej. Tecnologías WorkLink"
                className={inputWithIconClassName}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-text-muted">
                {form.company_name.length}/150
              </span>
            </div>
          </div>

          {/* Industria */}
          <div>
            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium text-text"
            >
              Industria o sector
            </label>

            <div className="relative">
              <RectangleStackIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="industry"
                name="industry"
                type="text"
                value={form.industry}
                onChange={handleChange}
                maxLength={100}
                placeholder="Ej. Tecnologías de la información"
                className={inputWithIconClassName}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-text-muted">
                {form.industry.length}/100
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-text"
            >
              Ubicación
            </label>

            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                maxLength={150}
                autoComplete="address-level2"
                placeholder="Ej. Pachuca, Hidalgo"
                className={inputWithIconClassName}
              />
            </div>

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-text-muted">
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
              Descripción de la empresa
            </label>

            <div className="relative">
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-text-muted" />

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                placeholder="Describe las actividades, experiencia, objetivos y servicios principales de la empresa."
                className={`${inputClassName} resize-y pl-11`}
              />
            </div>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-text-muted">
                Esta información podrá mostrarse en el perfil público de
                la empresa.
              </p>

              <span className="text-xs text-text-muted">
                {form.description.length}/5000
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vista informativa */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <BuildingOffice2Icon className="h-6 w-6 shrink-0 text-primary" />

          <div>
            <h3 className="font-semibold text-text">
              Perfil público empresarial
            </h3>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              El nombre, descripción, industria y ubicación podrán ser
              consultados por otros usuarios dentro de WorkLink. Los datos
              privados de la cuenta no se mostrarán públicamente.
            </p>
          </div>
        </div>
      </section>

      {/* Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <CheckIcon className="h-5 w-5" />

          {isSaving
            ? "Guardando perfil..."
            : isEditing
              ? "Actualizar perfil empresarial"
              : "Crear perfil empresarial"}
        </button>
      </div>
    </form>
  );
}