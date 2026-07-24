import {
  BanknotesIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useEffect,
  type FormEvent,
} from "react";

import { createPortal } from "react-dom";

import { useCreateContractRequest } from "../hooks/useCreateContractRequest";

interface ServiceSummary {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  price?: string | number | null;
  is_active?: boolean;
}

interface Props {
  service: ServiceSummary;
  buttonLabel?: string;
  buttonClassName?: string;
  onSuccess?: () => void;
}

function formatCurrency(
  value: string | number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Precio a convenir";
  }

  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "Precio a convenir";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericValue);
}

export default function CreateContractRequestForm({
  service,
  buttonLabel = "Solicitar contratación",
  buttonClassName,
  onSuccess,
}: Props) {
  const {
    description,
    budget,
    errors,

    descriptionLength,
    maxDescriptionLength,

    isOpen,
    isSubmitting,

    openForm,
    closeForm,

    handleDescriptionChange,
    handleBudgetChange,

    submitContractRequest,
  } = useCreateContractRequest({
    serviceId: service.id,
    defaultBudget: service.price,

    onSuccess: () => {
      onSuccess?.();
    },
  });

  const isServiceInactive =
    service.is_active === false;

  /*
  |--------------------------------------------------------------------------
  | Bloquear desplazamiento y cerrar con Escape
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        closeForm();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isSubmitting,
    closeForm,
  ]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      isSubmitting ||
      isServiceInactive
    ) {
      return;
    }

    await submitContractRequest();
  };

  const modal =
    isOpen &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-contract-request-title"
            onMouseDown={() => {
              if (!isSubmitting) {
                closeForm();
              }
            }}
          >
            <form
              onSubmit={handleSubmit}
              onMouseDown={(event) =>
                event.stopPropagation()
              }
              className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl sm:max-h-[calc(100dvh-48px)]"
            >
              {/* Encabezado */}
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PaperAirplaneIcon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h2
                      id="create-contract-request-title"
                      className="text-lg font-semibold text-text sm:text-xl"
                    >
                      Solicitar contratación
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-text-muted sm:leading-6">
                      Describe el trabajo que necesitas y
                      proporciona un presupuesto estimado.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  aria-label="Cerrar"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </header>

              {/* Contenido desplazable */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
                {/* Servicio seleccionado */}
                <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <BriefcaseIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">
                        Servicio seleccionado
                      </p>

                      <h3 className="mt-1 break-words text-lg font-semibold text-text">
                        {service.title}
                      </h3>

                      {service.category && (
                        <p className="mt-1 text-sm font-medium text-text-muted">
                          {service.category}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 border-t border-primary/20 pt-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-text">
                          <BanknotesIcon className="h-4 w-4 text-primary" />

                          {formatCurrency(
                            service.price,
                          )}
                        </span>

                        {service.location && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-text">
                            <MapPinIcon className="h-4 w-4 text-primary" />

                            {service.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Descripción del servicio */}
                {service.description && (
                  <section className="mt-5 rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                      Descripción del servicio
                    </p>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-text-muted">
                      {service.description}
                    </p>
                  </section>
                )}

                {/* Servicio inactivo */}
                {isServiceInactive && (
                  <section className="mt-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
                    <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

                    <div>
                      <h3 className="text-sm font-semibold text-text">
                        Servicio no disponible
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-text-muted">
                        Este servicio se encuentra inactivo
                        y no puede recibir nuevas
                        solicitudes.
                      </p>
                    </div>
                  </section>
                )}

                <div className="mt-6 space-y-6">
                  {/* Descripción del trabajo */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label
                        htmlFor={`contract-request-description-${service.id}`}
                        className="flex items-center gap-2 text-sm font-medium text-text"
                      >
                        <DocumentTextIcon className="h-5 w-5 text-primary" />

                        Descripción del trabajo
                      </label>

                      <span
                        className={[
                          "shrink-0 text-xs",
                          descriptionLength >
                          maxDescriptionLength
                            ? "text-danger"
                            : "text-text-muted",
                        ].join(" ")}
                      >
                        {descriptionLength}/
                        {maxDescriptionLength}
                      </span>
                    </div>

                    <textarea
                      id={`contract-request-description-${service.id}`}
                      value={description}
                      onChange={(event) =>
                        handleDescriptionChange(
                          event.target.value,
                        )
                      }
                      disabled={
                        isSubmitting ||
                        isServiceInactive
                      }
                      rows={6}
                      maxLength={
                        maxDescriptionLength
                      }
                      placeholder="Explica qué necesitas, los objetivos del proyecto, entregables, fechas estimadas y requisitos importantes."
                      className={[
                        "mt-2 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted/70 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                        errors.description
                          ? "border-danger focus:border-danger focus:ring-danger/10"
                          : "border-border focus:border-primary focus:ring-primary/10",
                      ].join(" ")}
                    />

                    {errors.description ? (
                      <p className="mt-2 text-sm text-danger">
                        {errors.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs leading-5 text-text-muted">
                        Incluye suficiente información para
                        que el freelancer pueda evaluar el
                        alcance del trabajo.
                      </p>
                    )}
                  </div>

                  {/* Presupuesto */}
                  <div>
                    <label
                      htmlFor={`contract-request-budget-${service.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-text"
                    >
                      <BanknotesIcon className="h-5 w-5 text-primary" />

                      Presupuesto propuesto
                    </label>

                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">
                        $
                      </span>

                      <input
                        id={`contract-request-budget-${service.id}`}
                        type="text"
                        inputMode="decimal"
                        value={budget}
                        onChange={(event) =>
                          handleBudgetChange(
                            event.target.value,
                          )
                        }
                        disabled={
                          isSubmitting ||
                          isServiceInactive
                        }
                        placeholder="0.00"
                        className={[
                          "w-full rounded-xl border bg-background py-3 pl-8 pr-16 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                          errors.budget
                            ? "border-danger focus:border-danger focus:ring-danger/10"
                            : "border-border focus:border-primary focus:ring-primary/10",
                        ].join(" ")}
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-text-muted">
                        MXN
                      </span>
                    </div>

                    {errors.budget ? (
                      <p className="mt-2 text-sm text-danger">
                        {errors.budget}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs leading-5 text-text-muted">
                        Puedes modificar el precio publicado
                        o dejar el campo vacío para acordarlo
                        directamente con el freelancer.
                      </p>
                    )}
                  </div>

                  {/* Aviso */}
                  <section className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                    <p className="text-sm leading-6 text-text-muted">
                      Al enviar la solicitud, el freelancer
                      podrá revisar tu propuesta, aceptarla
                      o rechazarla. Podrás editarla o
                      cancelarla mientras permanezca
                      pendiente.
                    </p>
                  </section>
                </div>
              </div>

              {/* Acciones */}
              <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isServiceInactive
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}

                  {isSubmitting
                    ? "Enviando..."
                    : "Enviar solicitud"}
                </button>
              </footer>
            </form>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        disabled={isServiceInactive}
        className={
          buttonClassName ??
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        }
      >
        <PaperAirplaneIcon className="h-5 w-5" />

        {isServiceInactive
          ? "Servicio no disponible"
          : buttonLabel}
      </button>

      {modal}
    </>
  );
}