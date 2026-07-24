import axios from "axios";

import {
  useMemo,
  useState,
} from "react";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import ContractActionConfirmation from "../components/ContractActionConfirmation";
import ContractCard from "../components/ContractCard";
import ContractDetail from "../components/ContractDetail";
import ContractFilters from "../components/ContractFilters";

import ReviewForm from "../../reviews/components/ReviewForm";
import { createReview } from "../../reviews/services/reviewService";

import {
  showError,
  showSuccess,
} from "../../../shared/services/alertService";

import useContracts from "../hooks/useContracts";

import type {
  Contract,
  ContractUser,
} from "../models/contract";

import type {
  CreateReviewPayload,
  ReviewErrorResponse,
} from "../../reviews/models/review";

const roleDescriptions = {
  cliente:
    "Consulta los servicios que contrataste y revisa el progreso de cada trabajo.",
  empresa:
    "Consulta las contrataciones realizadas por tu empresa y administra su seguimiento.",
  freelancer:
    "Administra los contratos formalizados para tus servicios y marca los trabajos terminados.",
  admin:
    "Consulta y administra los contratos registrados dentro de WorkLink.",
} as const;


function getUserFullName(
  user: ContractUser | null | undefined,
): string {
  if (!user) {
    return "Usuario";
  }

  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getReviewErrorMessage(
  error: unknown,
): string {
  if (
    axios.isAxiosError<ReviewErrorResponse>(
      error,
    )
  ) {
    const responseData =
      error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    const validationMessage =
      responseData?.errors
        ? Object.values(
          responseData.errors,
        )
          .flat()
          .find(Boolean)
        : null;

    if (validationMessage) {
      return validationMessage;
    }
  }

  return "No se pudo publicar la calificación.";
}

export default function ContractsPage() {
  const [
    contractToReview,
    setContractToReview,
  ] = useState<Contract | null>(
    null,
  );

  const [
    reviewedContractIds,
    setReviewedContractIds,
  ] = useState<Set<number>>(
    () => new Set(),
  );

  const [
    isSavingReview,
    setIsSavingReview,
  ] = useState(false);

  const {
    filteredContracts,

    selectedContract,
    pendingAction,

    filters,
    statusCounts,
    activeFiltersCount,

    hasContracts,
    hasFilteredContracts,

    isLoading,
    isLoadingDetail,
    isUpdating,

    error,
    detailError,
    actionError,

    primaryRole,

    loadContracts,
    openContractDetail,
    closeContractDetail,

    handleStatusFilterChange,
    handleSearchChange,
    clearFilters,

    canCompleteContract,
    canCancelContract,

    requestCompleteContract,
    requestCancelContract,
    closeActionConfirmation,
    confirmContractAction,
  } = useContracts();

  const canReviewContract = (
    contract: Contract,
  ): boolean =>
    contract.status ===
    "completed" &&
    primaryRole !== "admin" &&
    !contract.has_reviewed &&
    !reviewedContractIds.has(
      contract.id,
    );

  const evaluatedUserName =
    useMemo(() => {
      if (!contractToReview) {
        return undefined;
      }

      const request =
        contractToReview
          .contract_request;

      const evaluatedUser =
        primaryRole === "freelancer"
          ? request?.client
          : request
            ?.freelancer_profile
            ?.user;

      return getUserFullName(
        evaluatedUser,
      );
    }, [
      contractToReview,
      primaryRole,
    ]);

  const handleOpenReview = (
    contract: Contract,
  ): void => {
    setContractToReview(
      contract,
    );
  };

  const handleCloseReview =
    (): void => {
      if (isSavingReview) {
        return;
      }

      setContractToReview(null);
    };

  const handleCreateReview =
    async (
      payload: CreateReviewPayload,
    ): Promise<boolean> => {
      if (
        isSavingReview ||
        !contractToReview
      ) {
        return false;
      }

      try {
        setIsSavingReview(true);

        await createReview(payload);

        setReviewedContractIds(
          (currentIds) => {
            const updatedIds =
              new Set(currentIds);

            updatedIds.add(
              contractToReview.id,
            );

            return updatedIds;
          },
        );

        showSuccess(
          "Calificación publicada correctamente.",
        );

        return true;
      } catch (requestError) {
        showError(
          getReviewErrorMessage(
            requestError,
          ),
        );

        return false;
      } finally {
        setIsSavingReview(false);
      }
    };

  const description =
    primaryRole &&
      primaryRole in roleDescriptions
      ? roleDescriptions[
      primaryRole as keyof typeof roleDescriptions
      ]
      : "Consulta y administra tus contratos dentro de WorkLink.";

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <DocumentCheckIcon className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-semibold text-primary">
                  Contrataciones formalizadas
                </p>

                <h1 className="mt-1 text-2xl font-bold text-text sm:text-3xl">
                  Contratos
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                  {description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadContracts();
              }}
              disabled={
                isLoading ||
                isUpdating
              }
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowPathIcon
                className={[
                  "h-5 w-5",
                  isLoading
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />

              Actualizar
            </button>
          </div>
        </section>

        {/* Filtros */}
        <ContractFilters
          filters={filters}
          statusCounts={
            statusCounts
          }
          activeFiltersCount={
            activeFiltersCount
          }
          isLoading={isLoading}
          onStatusChange={
            handleStatusFilterChange
          }
          onSearchChange={
            handleSearchChange
          }
          onClear={clearFilters}
        />

        {/* Error principal */}
        {error && (
          <section className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <ExclamationTriangleIcon className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-text">
              No se pudieron cargar los contratos
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadContracts();
              }}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />

              Intentar de nuevo
            </button>
          </section>
        )}

        {/* Cargando */}
        {!error &&
          isLoading && (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <article
                    key={index}
                    className="h-[540px] animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="h-4 w-28 rounded bg-border" />

                        <div className="mt-2 h-3 w-20 rounded bg-border" />
                      </div>

                      <div className="h-8 w-24 rounded-full bg-border" />
                    </div>

                    <div className="mt-8 flex gap-3">
                      <div className="h-11 w-11 rounded-xl bg-border" />

                      <div className="flex-1">
                        <div className="h-3 w-28 rounded bg-border" />

                        <div className="mt-2 h-6 w-3/4 rounded bg-border" />
                      </div>
                    </div>

                    <div className="mt-6 h-24 rounded-xl bg-border" />

                    <div className="mt-4 h-20 rounded-xl bg-border" />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="h-24 rounded-xl bg-border" />

                      <div className="h-24 rounded-xl bg-border" />
                    </div>

                    <div className="mt-8 h-11 rounded-xl bg-border" />
                  </article>
                ),
              )}
            </section>
          )}

        {/* Sin contratos */}
        {!error &&
          !isLoading &&
          !hasContracts && (
            <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-14 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ClipboardDocumentListIcon className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                Todavía no tienes contratos
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                Los contratos aparecerán cuando una solicitud de contratación aceptada sea formalizada por el freelancer.
              </p>
            </section>
          )}

        {/* Sin resultados */}
        {!error &&
          !isLoading &&
          hasContracts &&
          !hasFilteredContracts && (
            <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-14 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BriefcaseIcon className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                No encontramos contratos
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                No existen contratos que coincidan con los filtros seleccionados.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Limpiar filtros
              </button>
            </section>
          )}

        {/* Lista de contratos */}
        {!error &&
          !isLoading &&
          hasFilteredContracts && (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredContracts.map(
                (contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    primaryRole={
                      primaryRole
                    }
                    canComplete={canCompleteContract(
                      contract,
                    )}
                    canCancel={canCancelContract(
                      contract,
                    )}
                    isUpdating={
                      isUpdating
                    }
                    onView={(
                      selected,
                    ) => {
                      void openContractDetail(
                        selected.id,
                      );
                    }}
                    onComplete={
                      requestCompleteContract
                    }
                    onCancel={
                      requestCancelContract
                    }
                  />
                ),
              )}
            </section>
          )}
      </div>

      {/* Detalle */}
      <ContractDetail
        contract={
          selectedContract
        }
        isLoading={
          isLoadingDetail
        }
        isUpdating={
          isUpdating
        }
        error={detailError}
        canComplete={
          selectedContract
            ? canCompleteContract(
              selectedContract,
            )
            : false
        }
        canCancel={
          selectedContract
            ? canCancelContract(
              selectedContract,
            )
            : false
        }
        canReview={
          selectedContract
            ? canReviewContract(
              selectedContract,
            )
            : false
        }
        onClose={
          closeContractDetail
        }
        onComplete={
          requestCompleteContract
        }
        onCancel={
          requestCancelContract
        }
        onReview={
          handleOpenReview
        }
      />

      {/* Formulario para calificar */}
      <ReviewForm
        isOpen={
          contractToReview !== null
        }
        contractId={
          contractToReview?.id ??
          null
        }
        review={null}
        evaluatedUserName={
          evaluatedUserName
        }
        isSaving={
          isSavingReview
        }
        onClose={
          handleCloseReview
        }
        onCreate={
          handleCreateReview
        }
        onUpdate={async () =>
          false
        }
      />

      {/* Confirmación */}
      <ContractActionConfirmation
        pendingAction={
          pendingAction
        }
        isUpdating={
          isUpdating
        }
        error={actionError}
        onClose={
          closeActionConfirmation
        }
        onConfirm={
          confirmContractAction
        }
      />
    </>
  );
}