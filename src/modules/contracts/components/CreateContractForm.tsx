import {
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { createPortal } from "react-dom";

import type { ContractRequest } from "../../contractRequests/models/contractRequest";

import type {
  CreateContractPayload,
} from "../models/contract";

interface Props {
  contractRequest: ContractRequest | null;
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;

  onSubmit: (
    payload: CreateContractPayload,
  ) => Promise<boolean>;

  onClose: () => void;
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  totalAmount?: string;
}

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeAmount(
  value: string | number | null,
): string {
  if (
    value === null ||
    value === ""
  ) {
    return "";
  }

  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "";
  }

  return numericValue.toFixed(2);
}

function formatCurrency(
  value: string,
): string {
  const numericValue = Number(value);

  if (
    !value ||
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "$0.00";
  }

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    },
  ).format(numericValue);
}

export default function CreateContractForm({
  contractRequest,
  isOpen,
  isSubmitting,
  error,
  onSubmit,
  onClose,
}: Props) {
  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    totalAmount,
    setTotalAmount,
  ] = useState("");

  const [
    formErrors,
    setFormErrors,
  ] = useState<FormErrors>({});

  /*
  |--------------------------------------------------------------------------
  | Inicializar formulario
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !isOpen ||
      !contractRequest
    ) {
      return;
    }

    setStartDate(getToday());

    setEndDate("");

    setTotalAmount(
      normalizeAmount(
        contractRequest.budget,
      ),
    );

    setFormErrors({});
  }, [
    contractRequest,
    isOpen,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Bloquear scroll y Escape
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
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
    onClose,
  ]);

  if (
    !isOpen ||
    !contractRequest ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const serviceTitle =
    contractRequest.service?.title ||
    "Servicio no disponible";

  /*
  |--------------------------------------------------------------------------
  | Validación
  |--------------------------------------------------------------------------
  */

  const validateForm =
    (): boolean => {
      const validationErrors: FormErrors =
        {};

      if (!startDate) {
        validationErrors.startDate =
          "La fecha de inicio es obligatoria.";
      }

      if (
        endDate &&
        startDate &&
        endDate < startDate
      ) {
        validationErrors.endDate =
          "La fecha final debe ser igual o posterior a la fecha de inicio.";
      }

      if (!totalAmount.trim()) {
        validationErrors.totalAmount =
          "El monto total es obligatorio.";
      } else {
        const numericAmount =
          Number(totalAmount);

        if (
          Number.isNaN(
            numericAmount,
          ) ||
          !Number.isFinite(
            numericAmount,
          )
        ) {
          validationErrors.totalAmount =
            "Ingresa un monto válido.";
        } else if (
          numericAmount < 0
        ) {
          validationErrors.totalAmount =
            "El monto no puede ser negativo.";
        } else if (
          numericAmount >
          99999999.99
        ) {
          validationErrors.totalAmount =
            "El monto supera el límite permitido.";
        }
      }

      setFormErrors(
        validationErrors,
      );

      return (
        Object.keys(
          validationErrors,
        ).length === 0
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Enviar
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      isSubmitting ||
      !validateForm()
    ) {
      return;
    }

    const payload: CreateContractPayload =
      {
        request_id:
          contractRequest.id,

        start_date:
          startDate,

        end_date:
          endDate || null,

        total_amount:
          Number(totalAmount),
      };

    await onSubmit(payload);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-contract-title"
        className="flex max-h-[calc(100dvh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
              <DocumentCheckIcon className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-success">
                Solicitud aceptada
              </p>

              <h2
                id="create-contract-title"
                className="mt-1 text-xl font-bold text-text"
              >
                Formalizar contrato
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Define las condiciones finales para comenzar el trabajo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar formulario"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 p-5 sm:p-6">
            {/* Solicitud */}
            <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Solicitud seleccionada
              </p>

              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-text">
                    {serviceTitle}
                  </p>

                  <p className="mt-1 text-sm text-text-muted">
                    Solicitud #{contractRequest.id}
                  </p>
                </div>
              </div>

              {contractRequest.description && (
                <p className="mt-4 line-clamp-3 whitespace-pre-wrap border-t border-border pt-4 text-sm leading-6 text-text-muted">
                  {contractRequest.description}
                </p>
              )}
            </section>

            {/* Fechas */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-primary" />

                <h3 className="font-semibold text-text">
                  Duración del contrato
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contract-start-date"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Fecha de inicio
                    <span className="ml-1 text-danger">
                      *
                    </span>
                  </label>

                  <input
                    id="contract-start-date"
                    type="date"
                    value={startDate}
                    min={getToday()}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setStartDate(
                        event.target.value,
                      );

                      setFormErrors(
                        (current) => ({
                          ...current,
                          startDate:
                            undefined,
                          endDate:
                            undefined,
                        }),
                      );
                    }}
                    className={[
                      "w-full rounded-xl border bg-background px-4 py-3 text-sm text-text outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                      formErrors.startDate
                        ? "border-danger focus:border-danger focus:ring-danger/10"
                        : "border-border focus:border-primary focus:ring-primary/10",
                    ].join(" ")}
                  />

                  {formErrors.startDate && (
                    <p className="mt-2 text-xs font-medium text-danger">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contract-end-date"
                    className="mb-2 block text-sm font-medium text-text"
                  >
                    Fecha de finalización
                    <span className="ml-2 text-xs font-normal text-text-muted">
                      Opcional
                    </span>
                  </label>

                  <input
                    id="contract-end-date"
                    type="date"
                    value={endDate}
                    min={
                      startDate ||
                      getToday()
                    }
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setEndDate(
                        event.target.value,
                      );

                      setFormErrors(
                        (current) => ({
                          ...current,
                          endDate:
                            undefined,
                        }),
                      );
                    }}
                    className={[
                      "w-full rounded-xl border bg-background px-4 py-3 text-sm text-text outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                      formErrors.endDate
                        ? "border-danger focus:border-danger focus:ring-danger/10"
                        : "border-border focus:border-primary focus:ring-primary/10",
                    ].join(" ")}
                  />

                  {formErrors.endDate && (
                    <p className="mt-2 text-xs font-medium text-danger">
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Monto */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5 text-primary" />

                <h3 className="font-semibold text-text">
                  Monto acordado
                </h3>
              </div>

              <label
                htmlFor="contract-total-amount"
                className="mb-2 block text-sm font-medium text-text"
              >
                Monto total
                <span className="ml-1 text-danger">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                  $
                </span>

                <input
                  id="contract-total-amount"
                  type="number"
                  value={totalAmount}
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  disabled={isSubmitting}
                  placeholder="0.00"
                  onChange={(event) => {
                    setTotalAmount(
                      event.target.value,
                    );

                    setFormErrors(
                      (current) => ({
                        ...current,
                        totalAmount:
                          undefined,
                      }),
                    );
                  }}
                  className={[
                    "w-full rounded-xl border bg-background py-3 pl-9 pr-16 text-sm text-text outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                    formErrors.totalAmount
                      ? "border-danger focus:border-danger focus:ring-danger/10"
                      : "border-border focus:border-primary focus:ring-primary/10",
                  ].join(" ")}
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">
                  MXN
                </span>
              </div>

              {formErrors.totalAmount ? (
                <p className="mt-2 text-xs font-medium text-danger">
                  {formErrors.totalAmount}
                </p>
              ) : (
                <p className="mt-2 text-xs text-text-muted">
                  Total del contrato:{" "}
                  <span className="font-semibold text-primary">
                    {formatCurrency(
                      totalAmount,
                    )}
                  </span>
                </p>
              )}
            </section>

            {/* Advertencia */}
            <section className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

              <p className="text-sm leading-6 text-text-muted">
                Una vez formalizado, el contrato aparecerá como en proceso para ambas partes. Después solo podrá completarse o cancelarse.
              </p>
            </section>

            {/* Error del backend */}
            {error && (
              <section className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <p className="text-sm font-medium text-danger">
                  {error}
                </p>
              </section>
            )}
          </div>

          {/* Acciones */}
          <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Regresar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <DocumentCheckIcon className="h-5 w-5" />
              )}

              {isSubmitting
                ? "Formalizando..."
                : "Formalizar contrato"}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}