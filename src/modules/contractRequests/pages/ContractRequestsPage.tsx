import {
  ArrowPathIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import {
  useState,
} from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import ContractRequestDetail from "../components/ContractRequestDetail";
import ContractRequestEditForm from "../components/ContractRequestEditForm";
import ContractRequestFilters from "../components/ContractRequestFilters";
import ContractRequestList from "../components/ContractRequestList";
import ContractRequestPagination from "../components/ContractRequestPagination";
import ContractRequestActionConfirmation from "../components/ContractRequestActionConfirmation";

import CreateContractForm from "../../contracts/components/CreateContractForm";

import {
  createContract,
} from "../../contracts/services/contractService";

import type {
  CreateContractPayload,
} from "../../contracts/models/contract";

import { useContractRequests } from "../hooks/useContractRequests";

import type { ContractRequest } from "../models/contractRequest";

function getCreateContractError(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (
      typeof message === "string" &&
      message.trim()
    ) {
      return message;
    }

    const validationErrors =
      response?.data?.errors;

    if (validationErrors) {
      const firstMessage =
        Object.values(validationErrors)
          .flat()
          .find(Boolean);

      if (firstMessage) {
        return firstMessage;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo formalizar el contrato.";
}

export default function ContractRequestsPage() {
  const navigate = useNavigate();

  const {
    primaryRole,
    viewMode,
    canAccessModule,
    canCreateRequest,

    contractRequests,
    pagination,
    selectedContractRequest,
    isDetailOpen,
    pendingAction,

    isLoading,
    error,

    search,
    statusFilter,
    perPage,
    hasActiveFilters,

    totalContractRequests,
    pendingContractRequestsCount,
    acceptedContractRequestsCount,
    rejectedContractRequestsCount,
    canceledContractRequestsCount,

    handleSearchChange,
    handleStatusFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    openContractRequestDetail,
    closeContractRequestDetail,

    handleUpdateContractRequestDetails,
    handleAcceptContractRequest,
    handleRejectContractRequest,
    handleCancelContractRequest,
    handleDeleteContractRequest,

    closeActionConfirmation,
    confirmContractRequestAction,

    isProcessingContractRequest,
    reloadContractRequests,
  } = useContractRequests();

  const [
    editingContractRequest,
    setEditingContractRequest,
  ] = useState<ContractRequest | null>(
    null,
  );

  const [
    isEditFormOpen,
    setIsEditFormOpen,
  ] = useState(false);

  const [
    formalizingContractRequest,
    setFormalizingContractRequest,
  ] = useState<ContractRequest | null>(
    null,
  );

  const [
    isCreateContractOpen,
    setIsCreateContractOpen,
  ] = useState(false);

  const [
    isCreatingContract,
    setIsCreatingContract,
  ] = useState(false);

  const [
    createContractError,
    setCreateContractError,
  ] = useState<string | null>(
    null,
  );

  const isReceivedView =
    viewMode === "received";

  /*
  |--------------------------------------------------------------------------
  | Formulario de edición
  |--------------------------------------------------------------------------
  */

  const openEditForm = (
    contractRequest: ContractRequest,
  ): void => {
    if (
      contractRequest.status !== "pending"
    ) {
      return;
    }

    setEditingContractRequest(
      contractRequest,
    );

    setIsEditFormOpen(true);
  };

  const closeEditForm = (): void => {
    if (
      editingContractRequest &&
      isProcessingContractRequest(
        editingContractRequest.id,
      )
    ) {
      return;
    }

    setIsEditFormOpen(false);
    setEditingContractRequest(null);
  };

  const handleEditFromDetail = (
    contractRequest: ContractRequest,
  ): void => {
    closeContractRequestDetail();
    openEditForm(contractRequest);
  };

  /*
  |--------------------------------------------------------------------------
  | Formalizar contrato
  |--------------------------------------------------------------------------
  */

  const openCreateContractForm = (
    contractRequest: ContractRequest,
  ): void => {
    if (
      !isReceivedView ||
      contractRequest.status !== "accepted"
    ) {
      return;
    }

    setCreateContractError(null);
    setFormalizingContractRequest(
      contractRequest,
    );
    setIsCreateContractOpen(true);
    closeContractRequestDetail();
  };

  const closeCreateContractForm =
    (): void => {
      if (isCreatingContract) {
        return;
      }

      setIsCreateContractOpen(false);
      setFormalizingContractRequest(null);
      setCreateContractError(null);
    };

  const handleCreateContract =
    async (
      payload: CreateContractPayload,
    ): Promise<boolean> => {
      if (isCreatingContract) {
        return false;
      }

      setIsCreatingContract(true);
      setCreateContractError(null);

      try {
        await createContract(payload);

        setIsCreateContractOpen(false);
        setFormalizingContractRequest(null);

        navigate("/dashboard/contratos");

        return true;
      } catch (error) {
        setCreateContractError(
          getCreateContractError(error),
        );

        return false;
      } finally {
        setIsCreatingContract(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Acceso
  |--------------------------------------------------------------------------
  */

  if (!canAccessModule) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Carga inicial
  |--------------------------------------------------------------------------
  */

  if (
    isLoading &&
    !pagination
  ) {
    return (
      <div className="space-y-8">
        <section className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="h-4 w-48 rounded bg-border" />

          <div className="mt-4 h-9 w-80 max-w-full rounded bg-border" />

          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-border" />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <article
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="h-11 w-11 rounded-xl bg-border" />

              <div className="mt-4 h-4 w-28 rounded bg-border" />

              <div className="mt-3 h-7 w-16 rounded bg-border" />
            </article>
          ))}
        </section>

        <section className="h-56 animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-5 w-48 rounded bg-border" />

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="h-12 rounded-xl bg-border" />
            <div className="h-12 rounded-xl bg-border" />
            <div className="h-12 rounded-xl bg-border" />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <article
              key={index}
              className="h-[590px] animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-48 rounded bg-border" />

                <div className="h-7 w-24 rounded-full bg-border" />
              </div>

              <div className="mt-6 h-28 rounded-xl bg-border" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="h-20 rounded-xl bg-border" />
                <div className="h-20 rounded-xl bg-border" />
              </div>

              <div className="mt-5 h-28 rounded-xl bg-border" />

              <div className="mt-5 h-12 rounded-xl bg-border" />
            </article>
          ))}
        </section>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <p className="text-sm font-medium text-white/80">
            {isReceivedView
              ? "Propuestas de trabajo"
              : "Contratación de servicios"}
          </p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            {isReceivedView
              ? "Solicitudes recibidas"
              : "Solicitudes enviadas"}
          </h1>
        </section>

        <section className="rounded-2xl border border-danger/30 bg-danger/5 p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text">
                  No se pudieron cargar las solicitudes
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void reloadContractRequests()
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />

              Intentar de nuevo
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              {isReceivedView
                ? "Propuestas de trabajo"
                : "Contratación de servicios"}
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {isReceivedView
                ? "Solicitudes recibidas"
                : "Solicitudes enviadas"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              {isReceivedView
                ? "Revisa las propuestas enviadas por clientes y empresas interesados en contratar tus servicios."
                : "Consulta el estado de las solicitudes que has enviado a freelancers de WorkLink."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                {isReceivedView ? (
                  <UserGroupIcon className="h-4 w-4" />
                ) : (
                  <PaperAirplaneIcon className="h-4 w-4" />
                )}

                {isReceivedView
                  ? "Solicitudes recibidas"
                  : primaryRole === "empresa"
                    ? "Cuenta empresarial"
                    : "Cuenta cliente"}
              </span>
            </div>
          </div>

          {isReceivedView ? (
            <Link
              to="/dashboard/servicios"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
            >
              <BriefcaseIcon className="h-5 w-5" />

              Administrar servicios
            </Link>
          ) : (
            <Link
              to="/freelancers"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
            >
              <UserGroupIcon className="h-5 w-5" />

              Explorar freelancers
            </Link>
          )}
        </div>
      </section>

      {/* Contadores */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Total
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {totalContractRequests}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isReceivedView ? (
                <UserGroupIcon className="h-6 w-6" />
              ) : (
                <PaperAirplaneIcon className="h-6 w-6" />
              )}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Pendientes
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {pendingContractRequestsCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Aceptadas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {acceptedContractRequestsCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Rechazadas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {rejectedContractRequestsCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <XCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Canceladas
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {canceledContractRequestsCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background text-text-muted">
              <XCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Información */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          {isReceivedView ? (
            <UserGroupIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          ) : (
            <PaperAirplaneIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
          )}

          <div>
            <h2 className="font-semibold text-text">
              {isReceivedView
                ? "Administración de propuestas"
                : "Seguimiento de solicitudes"}
            </h2>

            <p className="mt-1 max-w-4xl text-sm leading-6 text-text-muted">
              {isReceivedView
                ? "Solo puedes aceptar o rechazar solicitudes que continúen pendientes. Después de tomar una decisión, la solicitud queda finalizada."
                : "Puedes editar, cancelar o eliminar una solicitud mientras continúe pendiente. Cuando el freelancer la acepte o rechace, ya no podrá modificarse."}
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <ContractRequestFilters
        viewMode={viewMode}
        search={search}
        statusFilter={statusFilter}
        perPage={perPage}
        totalResults={
          pagination?.total ?? 0
        }
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={
          handleStatusFilterChange
        }
        onPerPageChange={
          handlePerPageChange
        }
        onResetFilters={resetFilters}
      />

      {/* Recarga por filtros */}
      {isLoading && pagination && (
        <section className="flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-10 shadow-card">
          <div className="flex items-center gap-3 text-text-muted">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

            <p className="text-sm font-medium">
              Actualizando solicitudes...
            </p>
          </div>
        </section>
      )}

      {/* Listado */}
      {!isLoading && (
        <ContractRequestList
          contractRequests={
            contractRequests
          }
          viewMode={viewMode}
          hasActiveFilters={
            hasActiveFilters
          }
          onResetFilters={resetFilters}
          onView={
            openContractRequestDetail
          }
          onEdit={openEditForm}
          onAccept={(
            contractRequest,
          ) =>
            void handleAcceptContractRequest(
              contractRequest,
            )
          }
          onReject={(
            contractRequest,
          ) =>
            void handleRejectContractRequest(
              contractRequest,
            )
          }
          onCancel={(
            contractRequest,
          ) =>
            void handleCancelContractRequest(
              contractRequest,
            )
          }
          onDelete={(
            contractRequest,
          ) =>
            void handleDeleteContractRequest(
              contractRequest,
            )
          }
          isProcessingContractRequest={
            isProcessingContractRequest
          }
        />
      )}

      {/* Paginación */}
      <ContractRequestPagination
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />

      {/* Modal de detalle */}
      {isDetailOpen && (
        <ContractRequestDetail
          contractRequest={
            selectedContractRequest
          }
          viewMode={viewMode}
          isProcessing={
            selectedContractRequest
              ? isProcessingContractRequest(
                  selectedContractRequest.id,
                )
              : false
          }
          onEdit={
            handleEditFromDetail
          }
          onFormalize={
            openCreateContractForm
          }
          onAccept={(
            contractRequest,
          ) =>
            void handleAcceptContractRequest(
              contractRequest,
            )
          }
          onReject={(
            contractRequest,
          ) =>
            void handleRejectContractRequest(
              contractRequest,
            )
          }
          onCancel={(
            contractRequest,
          ) =>
            void handleCancelContractRequest(
              contractRequest,
            )
          }
          onDelete={(
            contractRequest,
          ) =>
            void handleDeleteContractRequest(
              contractRequest,
            )
          }
          onClose={
            closeContractRequestDetail
          }
        />
      )}

      {/* Formulario de edición */}
      {canCreateRequest && (
        <ContractRequestEditForm
          contractRequest={
            editingContractRequest
          }
          isOpen={isEditFormOpen}
          isProcessing={
            editingContractRequest
              ? isProcessingContractRequest(
                  editingContractRequest.id,
                )
              : false
          }
          onSubmit={
            handleUpdateContractRequestDetails
          }
          onClose={closeEditForm}
        />
      )}

      {/* Formalizar contrato */}
      <CreateContractForm
        contractRequest={
          formalizingContractRequest
        }
        isOpen={
          isCreateContractOpen
        }
        isSubmitting={
          isCreatingContract
        }
        error={
          createContractError
        }
        onSubmit={
          handleCreateContract
        }
        onClose={
          closeCreateContractForm
        }
      />

      {/* Confirmación de acciones */}
      <ContractRequestActionConfirmation
        pendingAction={
          pendingAction
        }
        isProcessing={
          pendingAction
            ? isProcessingContractRequest(
                pendingAction.contractRequest.id,
              )
            : false
        }
        onClose={
          closeActionConfirmation
        }
        onConfirm={
          confirmContractRequestAction
        }
      />
    </div>
  );
}