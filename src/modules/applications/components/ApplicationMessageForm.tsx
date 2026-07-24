import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import type { Application } from "../models/application";
import { useApplicationMessageForm } from "../hooks/useApplicationMessageForm";

interface Props {
  application: Application | null;

  onUpdated: (
    application: Application,
  ) => void;

  onClose: () => void;
}

const statusInformation = {
  pending: {
    label: "Pendiente",
    className:
      "border-warning/30 bg-warning/10 text-warning",
  },

  accepted: {
    label: "Aceptada",
    className:
      "border-success/30 bg-success/10 text-success",
  },

  rejected: {
    label: "Rechazada",
    className:
      "border-danger/30 bg-danger/10 text-danger",
  },
};

export default function ApplicationMessageForm({
  application,
  onUpdated,
  onClose,
}: Props) {
  const {
    form,

    isSaving,
    hasChanges,
    charactersRemaining,

    handleChange,
    handleSubmit,
    handleClose,
  } = useApplicationMessageForm({
    application,
    onUpdated,
    onClose,
  });

  if (!application) {
    return null;
  }

  const vacancy = application.vacancy;

  const status =
    statusInformation[application.status];

  const canEdit =
    application.status === "pending";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-message-form-title"
    >
      {/* Fondo */}
      <button
        type="button"
        onClick={handleClose}
        disabled={isSaving}
        aria-label="Cerrar formulario"
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>

            <div>
              <h2
                id="application-message-form-title"
                className="text-xl font-semibold text-text"
              >
                Editar mensaje de postulación
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Actualiza el mensaje que enviaste junto con
                tu postulación.
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

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-6">
            {/* Información de la vacante */}
            <section className="rounded-2xl border border-border bg-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                      Vacante
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-text">
                      {vacancy?.title ||
                        "Vacante no disponible"}
                    </h3>

                    {vacancy?.category && (
                      <p className="mt-1 text-sm text-text-muted">
                        {vacancy.category}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={[
                    "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold",
                    status.className,
                  ].join(" ")}
                >
                  {status.label}
                </span>
              </div>

              <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm text-text-muted">
                  <BuildingOffice2Icon className="mt-0.5 h-5 w-5 shrink-0" />

                  <span>
                    {vacancy?.company_profile
                      ?.company_name ||
                      "Empresa no disponible"}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-text-muted">
                  <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0" />

                  <span>
                    {vacancy?.location ||
                      "Ubicación no disponible"}
                  </span>
                </div>
              </div>
            </section>

            {/* Aviso de edición */}
            {canEdit ? (
              <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                  <div>
                    <p className="font-medium text-text">
                      Postulación pendiente
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      Puedes modificar el mensaje mientras
                      la empresa no haya aceptado o rechazado
                      tu postulación.
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

                  <div>
                    <p className="font-medium text-text">
                      Edición bloqueada
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-muted">
                      La postulación ya fue procesada y su
                      mensaje no puede modificarse.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Mensaje */}
            <section>
              <label
                htmlFor="application-message"
                className="mb-2 block text-sm font-medium text-text"
              >
                Mensaje para la empresa
              </label>

              <div className="relative">
                <ChatBubbleLeftRightIcon className="pointer-events-none absolute left-3 top-4 h-5 w-5 text-text-muted" />

                <textarea
                  id="application-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  disabled={
                    isSaving || !canEdit
                  }
                  rows={10}
                  maxLength={5000}
                  autoFocus
                  placeholder="Explica brevemente por qué te interesa la vacante, tu experiencia y las habilidades relacionadas con el puesto."
                  className="w-full resize-y rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                <p className="text-text-muted">
                  El mensaje es opcional. Puedes dejarlo vacío.
                </p>

                <span
                  className={
                    charactersRemaining < 100
                      ? "font-medium text-warning"
                      : "text-text-muted"
                  }
                >
                  {form.message.length}/5000 caracteres
                </span>
              </div>
            </section>

            {/* Recomendación */}
            <section className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-medium text-text">
                Recomendaciones para tu mensaje
              </h3>

              <p className="mt-2 text-sm leading-6 text-text-muted">
                Menciona tu experiencia relacionada con la
                vacante, las tecnologías o habilidades que
                dominas y la forma en que puedes contribuir al
                proyecto de la empresa.
              </p>
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
              {canEdit ? "Cancelar" : "Cerrar"}
            </button>

            {canEdit && (
              <button
                type="submit"
                disabled={
                  isSaving || !hasChanges
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <CheckIcon className="h-5 w-5" />
                )}

                {isSaving
                  ? "Guardando mensaje..."
                  : "Guardar cambios"}
              </button>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}