import {
  ArrowUpTrayIcon,
  BriefcaseIcon,
  CheckIcon,
  DocumentTextIcon,
  LinkIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useRef,
  type ChangeEvent,
} from "react";

import type {
  BriefcaseProject,
} from "../models/briefcase";

import {
  useBriefcaseForm,
} from "../hooks/useBriefcaseForm";

interface Props {
  briefcase: BriefcaseProject | null;

  onCreated: (
    briefcase: BriefcaseProject,
  ) => void;

  onUpdated: (
    briefcase: BriefcaseProject,
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

export default function BriefcaseForm({
  briefcase,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const {
    form,
    imagePreview,

    isEditing,
    isSaving,

    handleChange,
    handleImageChange,
    clearSelectedImage,

    handleSubmit,
    handleClose,
  } = useBriefcaseForm({
    briefcase,
    onCreated,
    onUpdated,
    onClose,
  });

  const handleSelectImage = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    void handleImageChange(event);
  };

  const handleDiscardSelectedImage = () => {
    clearSelectedImage();

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefcase-form-title"
    >
      {/* Fondo para cerrar */}
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
                id="briefcase-form-title"
                className="text-xl font-semibold text-text"
              >
                {isEditing
                  ? "Editar proyecto"
                  : "Agregar proyecto"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {isEditing
                  ? "Actualiza la información o reemplaza la imagen del proyecto."
                  : "Agrega un trabajo realizado para mostrarlo en tu portafolio profesional."}
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
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* Información */}
              <section className="space-y-5">
                {/* Título */}
                <div>
                  <label
                    htmlFor="briefcase-title"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Título del proyecto
                  </label>

                  <div className="relative">
                    <BriefcaseIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="briefcase-title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      disabled={isSaving}
                      required
                      maxLength={150}
                      autoFocus
                      placeholder="Ej. Tienda en línea desarrollada con Laravel"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      Escribe un nombre claro para identificar tu trabajo.
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {form.title.length}/150
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label
                    htmlFor="briefcase-description"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Descripción
                  </label>

                  <div className="relative">
                    <DocumentTextIcon className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-text-muted" />

                    <textarea
                      id="briefcase-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      disabled={isSaving}
                      rows={8}
                      maxLength={3000}
                      placeholder="Describe el objetivo del proyecto, tu participación, las herramientas utilizadas y los resultados obtenidos."
                      className={`${inputClassName} resize-y pl-11`}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      La descripción es opcional, pero ayuda a explicar tu experiencia.
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {form.description.length}/3000
                    </span>
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label
                    htmlFor="briefcase-project-url"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Enlace del proyecto
                  </label>

                  <div className="relative">
                    <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                    <input
                      id="briefcase-project-url"
                      name="project_url"
                      type="url"
                      value={form.project_url}
                      onChange={handleChange}
                      disabled={isSaving}
                      maxLength={255}
                      placeholder="https://github.com/usuario/proyecto"
                      className={inputWithIconClassName}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      Puedes agregar GitHub, Behance, un sitio publicado u otra evidencia.
                    </p>

                    <span className="shrink-0 text-xs text-text-muted">
                      {form.project_url.length}/255
                    </span>
                  </div>
                </div>
              </section>

              {/* Imagen */}
              <aside className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-text">
                    Imagen del proyecto
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    Formatos JPG, JPEG, PNG o WEBP. Máximo 2 MB.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="aspect-[4/3] w-full">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={
                          form.title
                            ? `Vista previa de ${form.title}`
                            : "Vista previa del proyecto"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <PhotoIcon className="h-7 w-7" />
                        </div>

                        <p className="mt-4 text-sm font-medium text-text">
                          Sin imagen seleccionada
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-muted">
                          Agrega una captura o evidencia visual del proyecto.
                        </p>
                      </div>
                    )}
                  </div>

                  {form.image && (
                    <div className="border-t border-border px-4 py-3">
                      <p className="truncate text-xs font-medium text-text">
                        {form.image.name}
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        {(form.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>

                <label
                  className={[
                    "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl",
                    "border border-primary bg-primary/5 px-4 py-3",
                    "text-sm font-medium text-primary transition",
                    "hover:bg-primary hover:text-white",
                    isSaving
                      ? "pointer-events-none cursor-not-allowed opacity-60"
                      : "",
                  ].join(" ")}
                >
                  <ArrowUpTrayIcon className="h-5 w-5" />

                  {form.image
                    ? "Seleccionar otra imagen"
                    : imagePreview
                      ? "Reemplazar imagen"
                      : "Seleccionar imagen"}

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isSaving}
                    onChange={handleSelectImage}
                    className="sr-only"
                  />
                </label>

                {form.image && (
                  <button
                    type="button"
                    onClick={handleDiscardSelectedImage}
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-danger/40 hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Descartar imagen seleccionada
                  </button>
                )}

                {isEditing &&
                  briefcase?.image_url &&
                  !form.image && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-xs leading-5 text-text-muted">
                        El proyecto ya tiene una imagen. Selecciona otra solamente cuando desees reemplazarla.
                      </p>
                    </div>
                  )}
              </aside>
            </div>
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
                ? "Guardando proyecto..."
                : isEditing
                  ? "Actualizar proyecto"
                  : "Agregar al portafolio"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}