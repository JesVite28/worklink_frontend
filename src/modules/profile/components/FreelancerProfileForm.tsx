import {
  AcademicCapIcon,
  BanknotesIcon,
  BriefcaseIcon,
  CheckIcon,
  GlobeAltIcon,
  IdentificationIcon,
  LanguageIcon,
  LinkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

import type { FreelancerProfile } from "../models/profile";
import { useFreelancerProfileForm } from "../hooks/useFreelancerProfileForm";

interface Props {
  profile: FreelancerProfile | null;
  onSaved: (profile: FreelancerProfile) => void;
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

export default function FreelancerProfileForm({
  profile,
  onSaved,
}: Props) {
  const {
    form,
    handleChange,
    handleRateTypeChange,
    handleSubmit,
    isEditing,
    isSaving,
  } = useFreelancerProfileForm({
    profile,
    onSaved,
  });

  const isNegotiable =
    form.rate_type === "negotiable";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Información profesional */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <IdentificationIcon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              Información profesional
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Describe tu experiencia, especialidad y los servicios
              profesionales que puedes realizar.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="specialty"
              className="mb-2 block text-sm font-medium text-text"
            >
              Especialidad
            </label>

            <div className="relative">
              <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="specialty"
                name="specialty"
                type="text"
                value={form.specialty}
                onChange={handleChange}
                required
                placeholder="Ej. Desarrollo web Full Stack"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="work_mode"
              className="mb-2 block text-sm font-medium text-text"
            >
              Modalidad de trabajo
            </label>

            <div className="relative">
              <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <select
                id="work_mode"
                name="work_mode"
                value={form.work_mode}
                onChange={handleChange}
                required
                className={inputWithIconClassName}
              >
                <option value="remote">
                  Remoto
                </option>

                <option value="on_site">
                  Presencial
                </option>

                <option value="hybrid">
                  Híbrido
                </option>

                <option value="home_service">
                  Servicio a domicilio
                </option>
              </select>
            </div>
          </div>

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
                required
                placeholder="Ej. Pachuca, Hidalgo"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="service_area"
              className="mb-2 block text-sm font-medium text-text"
            >
              Área de servicio
            </label>

            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="service_area"
                name="service_area"
                type="text"
                value={form.service_area}
                onChange={handleChange}
                required
                placeholder="Ej. México, trabajo remoto"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-text"
            >
              Descripción profesional
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe tu perfil, conocimientos, fortalezas y el tipo de proyectos que realizas."
              className={`${inputClassName} resize-y`}
            />

            <p className="mt-2 text-xs text-text-muted">
              Procura escribir una descripción clara para que los
              clientes comprendan qué puedes aportar a sus proyectos.
            </p>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="experience"
              className="mb-2 block text-sm font-medium text-text"
            >
              Experiencia profesional
            </label>

            <div className="relative">
              <AcademicCapIcon className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-text-muted" />

              <textarea
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Explica tu experiencia, proyectos realizados, herramientas que dominas o años de trabajo."
                className={`${inputWithIconClassName} resize-y`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tarifa y disponibilidad */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BanknotesIcon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              Tarifa y disponibilidad
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Indica cómo cobras tus servicios y si actualmente
              aceptas nuevos proyectos.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="rate_type"
              className="mb-2 block text-sm font-medium text-text"
            >
              Tipo de tarifa
            </label>

            <div className="relative">
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <select
                id="rate_type"
                name="rate_type"
                value={form.rate_type}
                onChange={handleRateTypeChange}
                required
                className={inputWithIconClassName}
              >
                <option value="hourly">
                  Por hora
                </option>

                <option value="daily">
                  Por día
                </option>

                <option value="project">
                  Por proyecto
                </option>

                <option value="negotiable">
                  Precio negociable
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="rate"
              className="mb-2 block text-sm font-medium text-text"
            >
              Tarifa en MXN
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-medium text-text-muted">
                $
              </span>

              <input
                id="rate"
                name="rate"
                type="number"
                min="0"
                step="0.01"
                value={form.rate}
                onChange={handleChange}
                disabled={isNegotiable}
                required={!isNegotiable}
                placeholder={
                  isNegotiable
                    ? "No requerida"
                    : "Ej. 350"
                }
                className={[
                  inputWithIconClassName,
                  isNegotiable
                    ? "cursor-not-allowed opacity-60"
                    : "",
                ].join(" ")}
              />
            </div>

            {isNegotiable && (
              <p className="mt-2 text-xs text-text-muted">
                La tarifa se acordará directamente con el cliente.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4 transition hover:border-primary/50">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-primary"
              />

              <div>
                <p className="font-medium text-text">
                  Disponible para trabajar
                </p>

                <p className="mt-1 text-sm leading-6 text-text-muted">
                  Activa esta opción cuando puedas recibir nuevas
                  solicitudes o comenzar proyectos.
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Idiomas */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LanguageIcon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              Idiomas
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Agrega los idiomas que puedes utilizar para comunicarte
              con clientes y equipos de trabajo.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="languages"
            className="mb-2 block text-sm font-medium text-text"
          >
            Idiomas que dominas
          </label>

          <div className="relative">
            <LanguageIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

            <input
              id="languages"
              name="languages"
              type="text"
              value={form.languages}
              onChange={handleChange}
              required
              placeholder="Ej. Español, Inglés, Francés"
              className={inputWithIconClassName}
            />
          </div>

          <p className="mt-2 text-xs text-text-muted">
            Separa cada idioma con una coma.
          </p>
        </div>
      </section>

      {/* Enlaces profesionales */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LinkIcon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              Enlaces profesionales
            </h2>

            <p className="mt-1 text-sm leading-6 text-text-muted">
              Estos enlaces son opcionales y ayudan a demostrar tu
              experiencia y presencia profesional.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium text-text"
            >
              Sitio web
            </label>

            <div className="relative">
              <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://tusitio.com"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="portfolio_url"
              className="mb-2 block text-sm font-medium text-text"
            >
              Portafolio externo
            </label>

            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="portfolio_url"
                name="portfolio_url"
                type="url"
                value={form.portfolio_url}
                onChange={handleChange}
                placeholder="https://miportafolio.com"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="linkedin"
              className="mb-2 block text-sm font-medium text-text"
            >
              LinkedIn
            </label>

            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/usuario"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="github"
              className="mb-2 block text-sm font-medium text-text"
            >
              GitHub
            </label>

            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="github"
                name="github"
                type="url"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/usuario"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="facebook"
              className="mb-2 block text-sm font-medium text-text"
            >
              Facebook
            </label>

            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="facebook"
                name="facebook"
                type="url"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/usuario"
                className={inputWithIconClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="mb-2 block text-sm font-medium text-text"
            >
              Instagram
            </label>

            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                id="instagram"
                name="instagram"
                type="url"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/usuario"
                className={inputWithIconClassName}
              />
            </div>
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
              ? "Actualizar perfil profesional"
              : "Crear perfil profesional"}
        </button>
      </div>
    </form>
  );
}