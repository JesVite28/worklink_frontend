import {
  BriefcaseIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import ContractRequestCard from "./ContractRequestCard";

import type { ContractRequest } from "../models/contractRequest";
import type { ContractRequestViewMode } from "../hooks/useContractRequests";

interface Props {
  contractRequests: ContractRequest[];
  viewMode: ContractRequestViewMode;
  hasActiveFilters: boolean;

  onResetFilters: () => void;

  onView: (
    contractRequest: ContractRequest,
  ) => void;

  onEdit: (
    contractRequest: ContractRequest,
  ) => void;

  onAccept: (
    contractRequest: ContractRequest,
  ) => void;

  onReject: (
    contractRequest: ContractRequest,
  ) => void;

  onCancel: (
    contractRequest: ContractRequest,
  ) => void;

  onDelete: (
    contractRequest: ContractRequest,
  ) => void;

  isProcessingContractRequest: (
    contractRequestId: number,
  ) => boolean;
}

export default function ContractRequestList({
  contractRequests,
  viewMode,
  hasActiveFilters,
  onResetFilters,
  onView,
  onEdit,
  onAccept,
  onReject,
  onCancel,
  onDelete,
  isProcessingContractRequest,
}: Props) {
  const isReceivedView =
    viewMode === "received";

  /*
  |--------------------------------------------------------------------------
  | Sin resultados por filtros
  |--------------------------------------------------------------------------
  */

  if (
    contractRequests.length === 0 &&
    hasActiveFilters
  ) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-card sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MagnifyingGlassIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          No encontramos solicitudes
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          No existen solicitudes que coincidan con la
          búsqueda o el estado seleccionado. Prueba con
          otros criterios.
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-5 py-3 font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />

          Limpiar filtros
        </button>

        <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-xl border border-border bg-background p-4 text-left">
          <FunnelIcon className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />

          <p className="text-xs leading-5 text-text-muted">
            La búsqueda puede coincidir con la descripción,
            el nombre del servicio, su categoría, el cliente
            o el freelancer relacionado.
          </p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Freelancer sin solicitudes recibidas
  |--------------------------------------------------------------------------
  */

  if (
    contractRequests.length === 0 &&
    isReceivedView
  ) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserGroupIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Todavía no has recibido solicitudes
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Cuando un cliente o una empresa solicite contratar
          alguno de tus servicios, podrás consultar aquí la
          descripción del trabajo, el presupuesto y los datos
          del solicitante.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/20 bg-surface p-4">
          <div className="flex items-start gap-3 text-left">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm leading-6 text-text-muted">
              Verifica que tus servicios se encuentren activos
              y que tu perfil freelancer esté disponible para
              recibir nuevas propuestas.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Cliente o empresa sin solicitudes enviadas
  |--------------------------------------------------------------------------
  */

  if (contractRequests.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PaperAirplaneIcon className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-text">
          Todavía no has enviado solicitudes
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
          Cuando solicites contratar un servicio de WorkLink,
          podrás consultar aquí el freelancer seleccionado,
          el presupuesto propuesto y el estado de la solicitud.
        </p>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/20 bg-surface p-4">
          <div className="flex items-start gap-3 text-left">
            <BriefcaseIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

            <p className="text-sm leading-6 text-text-muted">
              Explora los perfiles y servicios publicados por
              los freelancers para encontrar al profesional
              adecuado para tu proyecto.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Listado
  |--------------------------------------------------------------------------
  */

  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contractRequests.map(
          (contractRequest) => (
            <ContractRequestCard
              key={contractRequest.id}
              contractRequest={
                contractRequest
              }
              viewMode={viewMode}
              isProcessing={isProcessingContractRequest(
                contractRequest.id,
              )}
              onView={onView}
              onEdit={onEdit}
              onAccept={onAccept}
              onReject={onReject}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ),
        )}
      </div>
    </section>
  );
}