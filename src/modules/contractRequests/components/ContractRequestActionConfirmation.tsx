import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import type {
  ContractRequest,
} from "../models/contractRequest";

export type ContractRequestActionType =
  | "accept"
  | "reject"
  | "cancel"
  | "delete";

export interface PendingContractRequestAction {
  type: ContractRequestActionType;
  contractRequest: ContractRequest;
}

interface Props {
  pendingAction:
    | PendingContractRequestAction
    | null;

  isProcessing: boolean;

  onClose: () => void;

  onConfirm: () => Promise<boolean>;
}

interface ActionInformation {
  title: string;
  description: string;
  warning: string;

  confirmLabel: string;
  loadingLabel: string;

  icon: typeof CheckCircleIcon;

  iconClassName: string;
  buttonClassName: string;
  warningClassName: string;
}

const actionInformation: Record<
  ContractRequestActionType,
  ActionInformation
> = {
  accept: {
    title: "¿Aceptar esta solicitud?",
    description:
      "Al aceptar, el cliente o empresa recibirá la confirmación y podrás formalizar el contrato.",
    warning:
      "Después de aceptar la solicitud ya no podrás rechazarla.",

    confirmLabel: "Sí, aceptar",
    loadingLabel: "Aceptando...",

    icon: CheckCircleIcon,

    iconClassName:
      "bg-success/10 text-success",

    buttonClassName:
      "bg-success text-white",

    warningClassName:
      "border-success/20 bg-success/5 text-success",
  },

  reject: {
    title: "¿Rechazar esta solicitud?",
    description:
      "La solicitud será marcada como rechazada y el solicitante podrá consultar el resultado.",
    warning:
      "Después de rechazarla ya no podrás aceptarla ni formalizar un contrato.",

    confirmLabel: "Sí, rechazar",
    loadingLabel: "Rechazando...",

    icon: XCircleIcon,

    iconClassName:
      "bg-danger/10 text-danger",

    buttonClassName:
      "bg-danger text-white",

    warningClassName:
      "border-danger/20 bg-danger/5 text-danger",
  },

  cancel: {
    title: "¿Cancelar esta solicitud?",
    description:
      "La solicitud dejará de estar disponible para que el freelancer pueda aceptarla.",
    warning:
      "La cancelación es definitiva y esta solicitud ya no podrá modificarse.",

    confirmLabel: "Sí, cancelar",
    loadingLabel: "Cancelando...",

    icon: XCircleIcon,

    iconClassName:
      "bg-warning/10 text-warning",

    buttonClassName:
      "bg-warning text-white",

    warningClassName:
      "border-warning/20 bg-warning/5 text-warning",
  },

  delete: {
    title: "¿Eliminar esta solicitud?",
    description:
      "La solicitud será retirada de tu cuenta y dejará de aparecer en el listado.",
    warning:
      "Esta acción no se puede deshacer.",

    confirmLabel: "Sí, eliminar",
    loadingLabel: "Eliminando...",

    icon: TrashIcon,

    iconClassName:
      "bg-danger/10 text-danger",

    buttonClassName:
      "bg-danger text-white",

    warningClassName:
      "border-danger/20 bg-danger/5 text-danger",
  },
};

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

  return new Intl.NumberFormat(
    "es-MX",
    {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    },
  ).format(numericValue);
}

export default function ContractRequestActionConfirmation({
  pendingAction,
  isProcessing,
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
        !isProcessing
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
    isProcessing,
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
    contractRequest,
  } = pendingAction;

  const information =
    actionInformation[type];

  const ActionIcon =
    information.icon;

  const serviceTitle =
    contractRequest.service?.title ||
    "Servicio no disponible";

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={() => {
        if (!isProcessing) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-request-confirmation-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Encabezado */}
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                information.iconClassName,
              ].join(" ")}
            >
              <ActionIcon className="h-7 w-7" />
            </div>

            <div>
              <h2
                id="contract-request-confirmation-title"
                className="text-xl font-bold text-text"
              >
                {information.title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                {information.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
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
                  Solicitud
                </p>

                <p className="mt-1 font-semibold text-text">
                  Solicitud #{contractRequest.id}
                </p>
              </div>

              <p className="shrink-0 text-sm font-bold text-primary">
                {formatCurrency(
                  contractRequest.budget,
                )}
              </p>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Servicio solicitado
              </p>

              <p className="mt-1 break-words text-sm font-medium text-text">
                {serviceTitle}
              </p>
            </div>

            {contractRequest.description && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-text-muted">
                  {contractRequest.description}
                </p>
              </div>
            )}
          </section>

          <section
            className={[
              "flex items-start gap-3 rounded-xl border p-4",
              information.warningClassName,
            ].join(" ")}
          >
            <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm leading-6 text-text-muted">
              {information.warning}
            </p>
          </section>
        </div>

        {/* Acciones */}
        <footer className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regresar
          </button>

          <button
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isProcessing}
            className={[
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
              information.buttonClassName,
            ].join(" ")}
          >
            {isProcessing ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ActionIcon className="h-5 w-5" />
            )}

            {isProcessing
              ? information.loadingLabel
              : information.confirmLabel}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}