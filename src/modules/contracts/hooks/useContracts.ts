import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import { useAuth } from "../../../context/useAuth";

import type {
  Contract,
  ContractFilters,
  ContractStatus,
} from "../models/contract";

import {
  cancelContract as cancelContractService,
  completeContract as completeContractService,
  getContractById,
  getContracts,
} from "../services/contractService";

type ContractAction =
  | "complete"
  | "cancel";

interface PendingContractAction {
  type: ContractAction;
  contract: Contract;
}

const INITIAL_FILTERS: ContractFilters = {
  status: "all",
  search: "",
};

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message;

    if (
      typeof responseMessage === "string" &&
      responseMessage.trim()
    ) {
      return responseMessage;
    }

    const validationErrors =
      error.response?.data?.errors;

    if (
      validationErrors &&
      typeof validationErrors === "object"
    ) {
      const firstError = Object.values(
        validationErrors,
      )
        .flat()
        .find(
          (message) =>
            typeof message === "string",
        );

      if (typeof firstError === "string") {
        return firstError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function normalizeSearchValue(
  value: string | null | undefined,
): string {
  return value
    ?.trim()
    .toLowerCase() ?? "";
}

function getUserFullName(
  name?: string,
  lastName?: string,
  maternalLastName?: string | null,
): string {
  return [
    name,
    lastName,
    maternalLastName,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function useContracts() {
  const {
    user,
    primaryRole,
  } = useAuth();

  const currentUserId =
    user?.id ?? null;

  const [
    contracts,
    setContracts,
  ] = useState<Contract[]>([]);

  const [
    selectedContract,
    setSelectedContract,
  ] = useState<Contract | null>(
    null,
  );

  const [
    filters,
    setFilters,
  ] = useState<ContractFilters>(
    INITIAL_FILTERS,
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isLoadingDetail,
    setIsLoadingDetail,
  ] = useState(false);

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    detailError,
    setDetailError,
  ] = useState<string | null>(null);

  const [
    actionError,
    setActionError,
  ] = useState<string | null>(null);

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingContractAction | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Cargar contratos
  |--------------------------------------------------------------------------
  */

  const loadContracts =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const contractData =
          await getContracts();

        setContracts(contractData);
      } catch (requestError) {
        setContracts([]);

        setError(
          getErrorMessage(
            requestError,
            "No se pudieron cargar los contratos.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Consultar detalle
  |--------------------------------------------------------------------------
  */

  const openContractDetail =
    useCallback(
      async (
        contractId: number,
      ): Promise<void> => {
        setSelectedContract(null);
        setDetailError(null);
        setIsLoadingDetail(true);

        try {
          const contract =
            await getContractById(
              contractId,
            );

          setSelectedContract(
            contract,
          );
        } catch (requestError) {
          setDetailError(
            getErrorMessage(
              requestError,
              "No se pudo cargar el detalle del contrato.",
            ),
          );
        } finally {
          setIsLoadingDetail(false);
        }
      },
      [],
    );

  const closeContractDetail =
    useCallback((): void => {
      if (isUpdating) {
        return;
      }

      setSelectedContract(null);
      setDetailError(null);
    }, [isUpdating]);

  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  const handleStatusFilterChange =
    useCallback(
      (
        status: ContractFilters["status"],
      ): void => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,
            status,
          }),
        );
      },
      [],
    );

  const handleSearchChange =
    useCallback(
      (search: string): void => {
        setFilters(
          (currentFilters) => ({
            ...currentFilters,
            search,
          }),
        );
      },
      [],
    );

  const clearFilters =
    useCallback((): void => {
      setFilters(
        INITIAL_FILTERS,
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Permisos calculados
  |--------------------------------------------------------------------------
  */

  const isClientOwner =
    useCallback(
      (
        contract: Contract,
      ): boolean => {
        return (
          currentUserId !== null &&
          contract.contract_request
            ?.client_id ===
            currentUserId
        );
      },
      [currentUserId],
    );

  const isFreelancerOwner =
    useCallback(
      (
        contract: Contract,
      ): boolean => {
        return (
          currentUserId !== null &&
          contract.contract_request
            ?.freelancer_profile
            ?.user_id ===
            currentUserId
        );
      },
      [currentUserId],
    );

  const canCompleteContract =
    useCallback(
      (
        contract: Contract,
      ): boolean => {
        if (
          contract.status !==
          "in_process"
        ) {
          return false;
        }

        return (
          primaryRole === "admin" ||
          (
            primaryRole ===
              "freelancer" &&
            isFreelancerOwner(
              contract,
            )
          )
        );
      },
      [
        isFreelancerOwner,
        primaryRole,
      ],
    );

  const canCancelContract =
    useCallback(
      (
        contract: Contract,
      ): boolean => {
        if (
          contract.status !==
          "in_process"
        ) {
          return false;
        }

        if (
          primaryRole === "admin"
        ) {
          return true;
        }

        if (
          primaryRole ===
          "freelancer"
        ) {
          return isFreelancerOwner(
            contract,
          );
        }

        if (
          primaryRole ===
            "cliente" ||
          primaryRole ===
            "empresa"
        ) {
          return isClientOwner(
            contract,
          );
        }

        return false;
      },
      [
        isClientOwner,
        isFreelancerOwner,
        primaryRole,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Confirmaciones
  |--------------------------------------------------------------------------
  */

  const requestCompleteContract =
    useCallback(
      (
        contract: Contract,
      ): void => {
        if (
          !canCompleteContract(
            contract,
          )
        ) {
          setActionError(
            "No tienes permisos para completar este contrato.",
          );

          return;
        }

        setActionError(null);

        setPendingAction({
          type: "complete",
          contract,
        });
      },
      [canCompleteContract],
    );

  const requestCancelContract =
    useCallback(
      (
        contract: Contract,
      ): void => {
        if (
          !canCancelContract(
            contract,
          )
        ) {
          setActionError(
            "No tienes permisos para cancelar este contrato.",
          );

          return;
        }

        setActionError(null);

        setPendingAction({
          type: "cancel",
          contract,
        });
      },
      [canCancelContract],
    );

  const closeActionConfirmation =
    useCallback((): void => {
      if (isUpdating) {
        return;
      }

      setPendingAction(null);
      setActionError(null);
    }, [isUpdating]);

  /*
  |--------------------------------------------------------------------------
  | Actualizar contrato localmente
  |--------------------------------------------------------------------------
  */

  const replaceContract =
    useCallback(
      (
        updatedContract: Contract,
      ): void => {
        setContracts(
          (currentContracts) =>
            currentContracts.map(
              (contract) =>
                contract.id ===
                updatedContract.id
                  ? updatedContract
                  : contract,
            ),
        );

        setSelectedContract(
          (currentContract) =>
            currentContract?.id ===
            updatedContract.id
              ? updatedContract
              : currentContract,
        );
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Confirmar acción
  |--------------------------------------------------------------------------
  */

  const confirmContractAction =
    useCallback(async (): Promise<boolean> => {
      if (
        !pendingAction ||
        isUpdating
      ) {
        return false;
      }

      setIsUpdating(true);
      setActionError(null);

      try {
        const updatedContract =
          pendingAction.type ===
          "complete"
            ? await completeContractService(
                pendingAction.contract.id,
              )
            : await cancelContractService(
                pendingAction.contract.id,
              );

        replaceContract(
          updatedContract,
        );

        setPendingAction(null);

        return true;
      } catch (requestError) {
        setActionError(
          getErrorMessage(
            requestError,
            pendingAction.type ===
            "complete"
              ? "No se pudo completar el contrato."
              : "No se pudo cancelar el contrato.",
          ),
        );

        return false;
      } finally {
        setIsUpdating(false);
      }
    }, [
      isUpdating,
      pendingAction,
      replaceContract,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Carga inicial
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void loadContracts();
  }, [loadContracts]);

  /*
  |--------------------------------------------------------------------------
  | Contratos filtrados
  |--------------------------------------------------------------------------
  */

  const filteredContracts =
    useMemo(() => {
      const normalizedSearch =
        normalizeSearchValue(
          filters.search,
        );

      return contracts.filter(
        (contract) => {
          if (
            filters.status !==
              "all" &&
            contract.status !==
              filters.status
          ) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const request =
            contract.contract_request;

          const clientName =
            getUserFullName(
              request?.client?.name,
              request?.client
                ?.last_name,
              request?.client
                ?.maternal_last_name,
            );

          const freelancerName =
            getUserFullName(
              request
                ?.freelancer_profile
                ?.user?.name,
              request
                ?.freelancer_profile
                ?.user?.last_name,
              request
                ?.freelancer_profile
                ?.user
                ?.maternal_last_name,
            );

          const searchableValues = [
            String(contract.id),
            String(
              contract.request_id,
            ),
            request?.service?.title,
            request?.service?.category,
            request?.description,
            clientName,
            freelancerName,
          ]
            .map(
              normalizeSearchValue,
            )
            .filter(Boolean);

          return searchableValues.some(
            (value) =>
              value.includes(
                normalizedSearch,
              ),
          );
        },
      );
    }, [
      contracts,
      filters.search,
      filters.status,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Conteos
  |--------------------------------------------------------------------------
  */

  const statusCounts =
    useMemo(() => {
      return contracts.reduce(
        (
          counts,
          contract,
        ) => {
          counts.all += 1;

          counts[
            contract.status
          ] += 1;

          return counts;
        },
        {
          all: 0,
          in_process: 0,
          completed: 0,
          canceled: 0,
        } as Record<
          | "all"
          | ContractStatus,
          number
        >,
      );
    }, [contracts]);

  const hasContracts =
    contracts.length > 0;

  const hasFilteredContracts =
    filteredContracts.length > 0;

  const activeFiltersCount =
    [
      filters.status !== "all",
      filters.search.trim() !== "",
    ].filter(Boolean).length;

  return {
    contracts,
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

    currentUserId,
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
  };
}