import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import type { Contract } from "../models/contract";

type ContractAction =
  | "complete"
  | "cancel";

interface PendingContractAction {
  type: ContractAction;
  contract: Contract;
}

interface Props {
  pendingAction:
    | PendingContractAction
    | null;

  isUpdating: boolean;
  error: string | null;

  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

function formatCurrency(
  value: string | number,
): string {
  const numericValue = Number(value);

  if (
    Number.isNaN(numericValue) ||
    !Number.isFinite(numericValue)
  ) {
    return "Monto no disponible";
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

export default function ContractActionConfirmation({
  pendingAction,

  isUpdating,
  error,

  onClose,
  onConfirm,
}: Props) {
  const isOpen =
    pendingAction !== null;

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
        !isUpdating
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
    isUpdating,
    onClose,
  ]);

  if (
    !pendingAction ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const {
    type,
    contract,
  } = pendingAction;

  const isCompleteAction =
    type === "complete";

  const serviceTitle =
    contract.contract_request
      ?.service?.title ||
    "Servicio no disponible";

  const title =
    isCompleteAction
      ? "¿Completar este contrato?"
      : "¿Cancelar este contrato?";

  const description =
    isCompleteAction
      ? "Al confirmar, el contrato quedará finalizado y ya no podrá modificarse."
      : "Al confirmar, el contrato será cancelado definitivamente y ya no podrá continuar.";

  const confirmLabel =
    isCompleteAction
      ? "Sí, completar"
      : "Sí, cancelar";

  const loadingLabel =
    isCompleteAction
      ? "Completando..."
      : "Cancelando...";

  const ActionIcon =
    isCompleteAction
      ? CheckCircleIcon
      : XCircleIcon;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isUpdating) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-action-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                isCompleteAction
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger",
              ].join(" ")}
            >
              <ActionIcon className="h-7 w-7" />
            </div>

            <div>
              <h2
                id="contract-action-title"
                className="text-xl font-bold text-text"
              >
                {title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition hover:bg-background hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar confirmación"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Información */}
        <div className="space-y-4 px-5 py-5 sm:px-6">
          <section className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Contrato
                </p>

                <p className="mt-1 font-semibold text-text">
                  Contrato #{contract.id}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-primary">
                {formatCurrency(
                  contract.total_amount,
                )}
              </p>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Servicio
              </p>

              <p className="mt-1 break-words text-sm font-medium text-text">
                {serviceTitle}
              </p>
            </div>
          </section>

          <section
            className={[
              "flex items-start gap-3 rounded-xl border p-4",
              isCompleteAction
                ? "border-success/20 bg-success/5"
                : "border-danger/20 bg-danger/5",
            ].join(" ")}
          >
            <ExclamationTriangleIcon
              className={[
                "mt-0.5 h-5 w-5 shrink-0",
                isCompleteAction
                  ? "text-success"
                  : "text-danger",
              ].join(" ")}
            />

            <p className="text-sm leading-6 text-text-muted">
              {isCompleteAction
                ? "Después de completar el contrato, el cliente o empresa podrá calificar el trabajo realizado."
                : "La cancelación afecta a ambas partes y el contrato ya no podrá marcarse como completado."}
            </p>
          </section>

          {error && (
            <section className="rounded-xl border border-danger/30 bg-danger/5 p-4">
              <p className="text-sm font-medium text-danger">
                {error}
              </p>
            </section>
          )}
        </div>

        {/* Acciones */}
        <footer className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regresar
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isUpdating}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
              isCompleteAction
                ? "bg-success"
                : "bg-danger",
            ].join(" ")}
          >
            {isUpdating ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ActionIcon className="h-5 w-5" />
            )}

            {isUpdating
              ? loadingLabel
              : confirmLabel}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}