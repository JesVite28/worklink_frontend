import {
  BanknotesIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ContractRequest,
  UpdateContractRequestDetailsPayload,
} from "../models/contractRequest";

interface Props {
  contractRequest: ContractRequest | null;
  isOpen: boolean;
  isProcessing: boolean;

  onSubmit: (
    contractRequest: ContractRequest,
    payload: UpdateContractRequestDetailsPayload,
  ) => Promise<boolean>;

  onClose: () => void;
}

interface FormErrors {
  description?: string;
  budget?: string;
}

const MAX_DESCRIPTION_LENGTH = 10000;
const MAX_BUDGET = 9999999999.99;

function formatCurrency(
  value: string | number | null,
): string {
  if (
    value === null ||
    value === ""
  ) {
    return "A convenir";
  }

  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "A convenir";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(numericValue);
}

export default function ContractRequestEditForm({
  contractRequest,
  isOpen,
  isProcessing,
  onSubmit,
  onClose,
}: Props) {
  const [
    description,
    setDescription,
  ] = useState("");

  const [
    budget,
    setBudget,
  ] = useState("");

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  /*
  |--------------------------------------------------------------------------
  | Cargar datos de la solicitud
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!contractRequest) {
      setDescription("");
      setBudget("");
      setErrors({});
      return;
    }

    setDescription(
      contractRequest.description ?? "",
    );

    setBudget(
      contractRequest.budget !== null
        ? String(contractRequest.budget)
        : "",
    );

    setErrors({});
  }, [contractRequest]);

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const descriptionLength =
    description.length;

  const isPending =
    contractRequest?.status === "pending";

  const hasChanges = useMemo(() => {
    if (!contractRequest) {
      return false;
    }

    const originalDescription =
      contractRequest.description.trim();

    const currentDescription =
      description.trim();

    const originalBudget =
      contractRequest.budget === null
        ? ""
        : String(
            Number(
              contractRequest.budget,
            ),
          );

    const currentBudget =
      budget.trim() === ""
        ? ""
        : String(Number(budget));

    return (
      originalDescription !==
        currentDescription ||
      originalBudget !== currentBudget
    );
  }, [
    budget,
    contractRequest,
    description,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Validación
  |--------------------------------------------------------------------------
  */

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    const normalizedDescription =
      description.trim();

    if (!normalizedDescription) {
      nextErrors.description =
        "La descripción es obligatoria.";
    } else if (
      normalizedDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      nextErrors.description =
        `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (budget.trim() !== "") {
      const numericBudget =
        Number(budget);

      if (
        Number.isNaN(numericBudget) ||
        !Number.isFinite(numericBudget)
      ) {
        nextErrors.budget =
          "Ingresa un presupuesto válido.";
      } else if (numericBudget < 0) {
        nextErrors.budget =
          "El presupuesto no puede ser negativo.";
      } else if (
        numericBudget > MAX_BUDGET
      ) {
        nextErrors.budget =
          "El presupuesto supera el máximo permitido.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Cambios del formulario
  |--------------------------------------------------------------------------
  */

  const handleDescriptionChange = (
    value: string,
  ): void => {
    setDescription(value);

    if (errors.description) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        description: undefined,
      }));
    }
  };

  const handleBudgetChange = (
    value: string,
  ): void => {
    if (
      value !== "" &&
      !/^\d*(\.\d{0,2})?$/.test(value)
    ) {
      return;
    }

    setBudget(value);

    if (errors.budget) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        budget: undefined,
      }));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Guardar
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (
      !contractRequest ||
      isProcessing ||
      !isPending
    ) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload: UpdateContractRequestDetailsPayload =
      {
        description:
          description.trim(),

        budget:
          budget.trim() === ""
            ? null
            : Number(budget),
      };

    const updated = await onSubmit(
      contractRequest,
      payload,
    );

    if (updated) {
      onClose();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Renderizado
  |--------------------------------------------------------------------------
  */

  if (
    !isOpen ||
    !contractRequest
  ) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-contract-request-title"
    >
      {/* Fondo */}
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        aria-label="Cerrar formulario"
        className="absolute inset-0 cursor-default"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PencilSquareIcon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h2
                id="edit-contract-request-title"
                className="text-xl font-semibold text-text"
              >
                Editar solicitud
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Actualiza la descripción del trabajo
                y el presupuesto propuesto.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Cerrar"
            className="rounded-xl p-2 text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Contenido */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {/* Servicio */}
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Servicio solicitado
                </p>

                <h3 className="mt-1 font-semibold text-text">
                  {contractRequest.service
                    ?.title ||
                    "Servicio no disponible"}
                </h3>

                {contractRequest.service
                  ?.category && (
                  <p className="mt-1 text-sm text-text-muted">
                    {
                      contractRequest
                        .service.category
                    }
                  </p>
                )}
              </div>
            </div>
          </section>

          {!isPending && (
            <section className="mt-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
              <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning" />

              <div>
                <h3 className="text-sm font-semibold text-text">
                  Solicitud no editable
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-muted">
                  Esta solicitud ya fue procesada y
                  no puede modificarse.
                </p>
              </div>
            </section>
          )}

          <div className="mt-6 space-y-6">
            {/* Descripción */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="contract-request-description"
                  className="flex items-center gap-2 text-sm font-medium text-text"
                >
                  <DocumentTextIcon className="h-5 w-5 text-primary" />

                  Descripción del trabajo
                </label>

                <span
                  className={[
                    "text-xs",
                    descriptionLength >
                    MAX_DESCRIPTION_LENGTH
                      ? "text-danger"
                      : "text-text-muted",
                  ].join(" ")}
                >
                  {descriptionLength}/
                  {MAX_DESCRIPTION_LENGTH}
                </span>
              </div>

              <textarea
                id="contract-request-description"
                value={description}
                onChange={(event) =>
                  handleDescriptionChange(
                    event.target.value,
                  )
                }
                disabled={
                  isProcessing ||
                  !isPending
                }
                rows={8}
                placeholder="Describe el trabajo, los objetivos, entregables, fechas estimadas y cualquier requisito importante."
                className={[
                  "mt-2 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted/70 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
                  errors.description
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border focus:border-primary focus:ring-primary/10",
                ].join(" ")}
              />

              {errors.description && (
                <p className="mt-2 text-sm text-danger">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Presupuesto */}
            <div>
              <label
                htmlFor="contract-request-budget"
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
                  id="contract-request-budget"
                  type="text"
                  inputMode="decimal"
                  value={budget}
                  onChange={(event) =>
                    handleBudgetChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    isProcessing ||
                    !isPending
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
                  Puedes dejar este campo vacío
                  cuando el precio sea a convenir.
                </p>
              )}
            </div>

            {/* Comparación */}
            <section className="rounded-xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-text">
                Resumen de cambios
              </h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-text-muted">
                    Presupuesto anterior
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text">
                    {formatCurrency(
                      contractRequest.budget,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted">
                    Nuevo presupuesto
                  </p>

                  <p className="mt-1 text-sm font-semibold text-primary">
                    {budget.trim() === ""
                      ? "A convenir"
                      : formatCurrency(
                          budget,
                        )}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Acciones */}
        <footer className="flex flex-col-reverse gap-3 border-t border-border bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 font-medium text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={
              isProcessing ||
              !isPending ||
              !hasChanges
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <PencilSquareIcon className="h-5 w-5" />
            )}

            {isProcessing
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </footer>
      </form>
    </div>
  );
}