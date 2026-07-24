import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuthSession } from "../../auth/hooks/useAuthSession";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import {
  acceptContractRequest,
  cancelContractRequest,
  deleteContractRequest,
  getContractRequests,
  rejectContractRequest,
  updateContractRequestDetails,
} from "../services/contractRequestService";

import type {
  ContractRequest,
  ContractRequestErrorResponse,
  ContractRequestPagination,
  ContractRequestStatus,
  UpdateContractRequestDetailsPayload,
} from "../models/contractRequest";

import type {
  PendingContractRequestAction,
} from "../components/ContractRequestActionConfirmation";

export type ContractRequestStatusFilter =
  | ContractRequestStatus
  | "all";

export type ContractRequestViewMode =
  | "sent"
  | "received";

interface ContractRequestCounters {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  canceled: number;
}

const initialCounters: ContractRequestCounters = {
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  canceled: 0,
};

function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (
    axios.isAxiosError<ContractRequestErrorResponse>(
      error,
    )
  ) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (responseData?.errors) {
      const firstValidationError =
        Object.values(responseData.errors)
          .flat()
          .find(Boolean);

      if (firstValidationError) {
        return firstValidationError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}

export function useContractRequests() {
  const { primaryRole } = useAuthSession();

  const viewMode: ContractRequestViewMode =
    primaryRole === "freelancer"
      ? "received"
      : "sent";

  const canCreateRequest =
    primaryRole === "cliente" ||
    primaryRole === "empresa";

  const canRespondRequest =
    primaryRole === "freelancer";

  const canAccessModule =
    canCreateRequest ||
    canRespondRequest;

  const [
    contractRequests,
    setContractRequests,
  ] = useState<ContractRequest[]>([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<ContractRequestPagination | null>(
      null,
    );

  const [
    selectedContractRequest,
    setSelectedContractRequest,
  ] = useState<ContractRequest | null>(null);

  const [
    isDetailOpen,
    setIsDetailOpen,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ContractRequestStatusFilter>(
      "all",
    );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(12);

  const [
    processingContractRequestId,
    setProcessingContractRequestId,
  ] = useState<number | null>(null);

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingContractRequestAction | null>(
    null,
  );

  const [
    counters,
    setCounters,
  ] =
    useState<ContractRequestCounters>(
      initialCounters,
    );

  /*
  |--------------------------------------------------------------------------
  | Búsqueda con retraso
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Cargar solicitudes
  |--------------------------------------------------------------------------
  */

  const loadContractRequests = useCallback(
    async (
      showLoading = true,
    ): Promise<void> => {
      if (!canAccessModule) {
        setContractRequests([]);
        setPagination(null);
        setIsLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setIsLoading(true);
        }

        setError(null);

        const response =
          await getContractRequests({
            status:
              statusFilter === "all"
                ? undefined
                : statusFilter,

            search:
              debouncedSearch || undefined,

            page,
            per_page: perPage,
          });

        setContractRequests(
          response.data.contract_requests,
        );

        setPagination(
          response.data.pagination,
        );
      } catch (requestError) {
        const message = getErrorMessage(
          requestError,
          "No se pudieron cargar las solicitudes de contratación.",
        );

        setError(message);
        setContractRequests([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      canAccessModule,
      debouncedSearch,
      page,
      perPage,
      statusFilter,
    ],
  );

  /*
  |--------------------------------------------------------------------------
  | Cargar contadores generales
  |--------------------------------------------------------------------------
  */

  const loadCounters =
    useCallback(async (): Promise<void> => {
      if (!canAccessModule) {
        setCounters(initialCounters);
        return;
      }

      try {
        const [
          pendingResponse,
          acceptedResponse,
          rejectedResponse,
          canceledResponse,
        ] = await Promise.all([
          getContractRequests({
            status: "pending",
            page: 1,
            per_page: 1,
          }),

          getContractRequests({
            status: "accepted",
            page: 1,
            per_page: 1,
          }),

          getContractRequests({
            status: "rejected",
            page: 1,
            per_page: 1,
          }),

          getContractRequests({
            status: "canceled",
            page: 1,
            per_page: 1,
          }),
        ]);

        const pending =
          pendingResponse.data.pagination.total;

        const accepted =
          acceptedResponse.data.pagination.total;

        const rejected =
          rejectedResponse.data.pagination.total;

        const canceled =
          canceledResponse.data.pagination.total;

        setCounters({
          pending,
          accepted,
          rejected,
          canceled,
          total:
            pending +
            accepted +
            rejected +
            canceled,
        });
      } catch {
        setCounters(initialCounters);
      }
    }, [canAccessModule]);

  /*
  |--------------------------------------------------------------------------
  | Efectos de carga
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void loadContractRequests();
  }, [loadContractRequests]);

  useEffect(() => {
    void loadCounters();
  }, [loadCounters]);

  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  const handleSearchChange = (
    value: string,
  ): void => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (
    value: ContractRequestStatusFilter,
  ): void => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePerPageChange = (
    value: number,
  ): void => {
    setPerPage(value);
    setPage(1);
  };

  const handlePageChange = (
    value: number,
  ): void => {
    if (
      value < 1 ||
      (
        pagination &&
        value > pagination.last_page
      )
    ) {
      return;
    }

    setPage(value);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilters = (): void => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Detalle
  |--------------------------------------------------------------------------
  */

  const openContractRequestDetail = (
    contractRequest: ContractRequest,
  ): void => {
    setSelectedContractRequest(
      contractRequest,
    );

    setIsDetailOpen(true);
  };

  const closeContractRequestDetail =
    (): void => {
      if (
        processingContractRequestId !== null
      ) {
        return;
      }

      setIsDetailOpen(false);
      setSelectedContractRequest(null);
    };

  /*
  |--------------------------------------------------------------------------
  | Actualizar solicitud seleccionada
  |--------------------------------------------------------------------------
  */

  const updateSelectedContractRequest = (
    updatedContractRequest: ContractRequest,
  ): void => {
    setSelectedContractRequest(
      (current) =>
        current?.id ===
        updatedContractRequest.id
          ? updatedContractRequest
          : current,
    );

    setContractRequests(
      (currentRequests) =>
        currentRequests.map(
          (contractRequest) =>
            contractRequest.id ===
            updatedContractRequest.id
              ? updatedContractRequest
              : contractRequest,
        ),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Actualizar descripción y presupuesto
  |--------------------------------------------------------------------------
  */

  const handleUpdateContractRequestDetails =
    async (
      contractRequest: ContractRequest,
      payload: UpdateContractRequestDetailsPayload,
    ): Promise<boolean> => {
      if (!canCreateRequest) {
        showWarning(
          "No tienes permisos para editar esta solicitud.",
        );

        return false;
      }

      if (
        contractRequest.status !== "pending"
      ) {
        showWarning(
          "Solo puedes editar solicitudes pendientes.",
        );

        return false;
      }

      try {
        setProcessingContractRequestId(
          contractRequest.id,
        );

        const response =
          await updateContractRequestDetails(
            contractRequest.id,
            payload,
          );

        updateSelectedContractRequest(
          response.data.contract_request,
        );

        showSuccess(
          response.message ||
            "Solicitud actualizada correctamente.",
        );

        await Promise.all([
          loadContractRequests(false),
          loadCounters(),
        ]);

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo actualizar la solicitud.",
          ),
        );

        return false;
      } finally {
        setProcessingContractRequestId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Solicitar confirmación de acción
  |--------------------------------------------------------------------------
  */

  const handleAcceptContractRequest =
    async (
      contractRequest: ContractRequest,
    ): Promise<boolean> => {
      if (!canRespondRequest) {
        showWarning(
          "Solo el freelancer puede aceptar esta solicitud.",
        );

        return false;
      }

      if (
        contractRequest.status !== "pending"
      ) {
        showWarning(
          "Esta solicitud ya fue procesada.",
        );

        return false;
      }

      setPendingAction({
        type: "accept",
        contractRequest,
      });

      return true;
    };

  const handleRejectContractRequest =
    async (
      contractRequest: ContractRequest,
    ): Promise<boolean> => {
      if (!canRespondRequest) {
        showWarning(
          "Solo el freelancer puede rechazar esta solicitud.",
        );

        return false;
      }

      if (
        contractRequest.status !== "pending"
      ) {
        showWarning(
          "Esta solicitud ya fue procesada.",
        );

        return false;
      }

      setPendingAction({
        type: "reject",
        contractRequest,
      });

      return true;
    };

  const handleCancelContractRequest =
    async (
      contractRequest: ContractRequest,
    ): Promise<boolean> => {
      if (!canCreateRequest) {
        showWarning(
          "No tienes permisos para cancelar esta solicitud.",
        );

        return false;
      }

      if (
        contractRequest.status !== "pending"
      ) {
        showWarning(
          "Solo puedes cancelar solicitudes pendientes.",
        );

        return false;
      }

      setPendingAction({
        type: "cancel",
        contractRequest,
      });

      return true;
    };

  const handleDeleteContractRequest =
    async (
      contractRequest: ContractRequest,
    ): Promise<boolean> => {
      if (!canCreateRequest) {
        showWarning(
          "No tienes permisos para eliminar esta solicitud.",
        );

        return false;
      }

      if (
        contractRequest.status !== "pending"
      ) {
        showWarning(
          "Solo puedes eliminar solicitudes pendientes.",
        );

        return false;
      }

      setPendingAction({
        type: "delete",
        contractRequest,
      });

      return true;
    };

  /*
  |--------------------------------------------------------------------------
  | Cerrar confirmación
  |--------------------------------------------------------------------------
  */

  const closeActionConfirmation =
    (): void => {
      if (
        processingContractRequestId !== null
      ) {
        return;
      }

      setPendingAction(null);
    };

  /*
  |--------------------------------------------------------------------------
  | Confirmar acción
  |--------------------------------------------------------------------------
  */

  const confirmContractRequestAction =
    async (): Promise<boolean> => {
      if (
        !pendingAction ||
        processingContractRequestId !== null
      ) {
        return false;
      }

      const {
        type,
        contractRequest,
      } = pendingAction;

      try {
        setProcessingContractRequestId(
          contractRequest.id,
        );

        if (type === "delete") {
          const response =
            await deleteContractRequest(
              contractRequest.id,
            );

          showSuccess(
            response.message ||
              "Solicitud eliminada correctamente.",
          );

          setPendingAction(null);
          setIsDetailOpen(false);
          setSelectedContractRequest(null);

          if (
            contractRequests.length === 1 &&
            page > 1
          ) {
            setPage(
              (currentPage) =>
                Math.max(
                  currentPage - 1,
                  1,
                ),
            );
          } else {
            await loadContractRequests(false);
          }

          await loadCounters();

          return true;
        }

        const response =
          type === "accept"
            ? await acceptContractRequest(
                contractRequest.id,
              )
            : type === "reject"
              ? await rejectContractRequest(
                  contractRequest.id,
                )
              : await cancelContractRequest(
                  contractRequest.id,
                );

        updateSelectedContractRequest(
          response.data.contract_request,
        );

        const successMessage =
          type === "accept"
            ? "Solicitud aceptada correctamente."
            : type === "reject"
              ? "Solicitud rechazada correctamente."
              : "Solicitud cancelada correctamente.";

        showSuccess(
          response.message ||
            successMessage,
        );

        setPendingAction(null);

        await Promise.all([
          loadContractRequests(false),
          loadCounters(),
        ]);

        return true;
      } catch (requestError) {
        const fallbackMessage =
          type === "accept"
            ? "No se pudo aceptar la solicitud."
            : type === "reject"
              ? "No se pudo rechazar la solicitud."
              : type === "cancel"
                ? "No se pudo cancelar la solicitud."
                : "No se pudo eliminar la solicitud.";

        showError(
          getErrorMessage(
            requestError,
            fallbackMessage,
          ),
        );

        return false;
      } finally {
        setProcessingContractRequestId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Recargar
  |--------------------------------------------------------------------------
  */

  const reloadContractRequests =
    useCallback(async (): Promise<void> => {
      await Promise.all([
        loadContractRequests(),
        loadCounters(),
      ]);
    }, [
      loadContractRequests,
      loadCounters,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const hasActiveFilters = useMemo(
    () =>
      search.trim().length > 0 ||
      statusFilter !== "all",
    [
      search,
      statusFilter,
    ],
  );

  const isEmpty =
    !isLoading &&
    contractRequests.length === 0;

  const isProcessingContractRequest = (
    contractRequestId: number,
  ): boolean =>
    processingContractRequestId ===
    contractRequestId;

  return {
    primaryRole,
    viewMode,
    canAccessModule,
    canCreateRequest,
    canRespondRequest,

    contractRequests,
    pagination,
    selectedContractRequest,
    isDetailOpen,
    pendingAction,

    isLoading,
    isEmpty,
    error,

    search,
    statusFilter,
    page,
    perPage,
    hasActiveFilters,

    totalContractRequests:
      counters.total,

    pendingContractRequestsCount:
      counters.pending,

    acceptedContractRequestsCount:
      counters.accepted,

    rejectedContractRequestsCount:
      counters.rejected,

    canceledContractRequestsCount:
      counters.canceled,

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
  };
}