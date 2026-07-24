import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isAxiosError } from "axios";

import {
  showError,
  showSuccess,
} from "../../../shared/services/alertService";

import type {
  Application,
  ApplicationErrorResponse,
  ApplicationPagination,
  ApplicationStatus,
} from "../models/application";

import {
  deleteApplication,
  getMyApplications,
} from "../services/applicationService";

/*
|--------------------------------------------------------------------------
| Tipos locales
|--------------------------------------------------------------------------
*/

export type ApplicationStatusFilter =
  | ApplicationStatus
  | "all";

interface ApplicationCounters {
  pending: number;
  accepted: number;
  rejected: number;
}

const initialCounters: ApplicationCounters = {
  pending: 0,
  accepted: 0,
  rejected: 0,
};

/*
|--------------------------------------------------------------------------
| Mensajes de error
|--------------------------------------------------------------------------
*/

function getErrorMessage(
  error: unknown,
): string {
  if (
    isAxiosError<ApplicationErrorResponse>(
      error,
    )
  ) {
    const data = error.response?.data;

    if (data?.errors) {
      const firstError = Object.values(
        data.errors,
      ).flat()[0];

      if (firstError) {
        return firstError;
      }
    }

    return (
      data?.message ||
      "No fue posible realizar la operación."
    );
  }

  return "No fue posible realizar la operación.";
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useMyApplications() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [pagination, setPagination] =
    useState<ApplicationPagination | null>(
      null,
    );

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<Application | null>(null);

  const [
    isMessageFormOpen,
    setIsMessageFormOpen,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [profileMissing, setProfileMissing] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [
    processingApplicationId,
    setProcessingApplicationId,
  ] = useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<ApplicationStatusFilter>(
    "all",
  );

  const [page, setPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(9);

  /*
  |--------------------------------------------------------------------------
  | Contadores
  |--------------------------------------------------------------------------
  */

  const [counters, setCounters] =
    useState<ApplicationCounters>(
      initialCounters,
    );

  /*
  |--------------------------------------------------------------------------
  | Búsqueda con retraso
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        setPage(1);
        setDebouncedSearch(
          search.trim(),
        );
      },
      350,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Cargar postulaciones
  |--------------------------------------------------------------------------
  */

  const loadApplications =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProfileMissing(false);

        const selectedStatus =
          statusFilter === "all"
            ? undefined
            : statusFilter;

        const [
          applicationsResponse,
          pendingResponse,
          acceptedResponse,
          rejectedResponse,
        ] = await Promise.all([
          getMyApplications({
            search:
              debouncedSearch ||
              undefined,
            status: selectedStatus,
            page,
            per_page: perPage,
          }),

          getMyApplications({
            status: "pending",
            page: 1,
            per_page: 1,
          }),

          getMyApplications({
            status: "accepted",
            page: 1,
            per_page: 1,
          }),

          getMyApplications({
            status: "rejected",
            page: 1,
            per_page: 1,
          }),
        ]);

        setApplications(
          applicationsResponse.data
            .applications ?? [],
        );

        setPagination(
          applicationsResponse.data
            .pagination,
        );

        setCounters({
          pending:
            pendingResponse.data
              .pagination.total,

          accepted:
            acceptedResponse.data
              .pagination.total,

          rejected:
            rejectedResponse.data
              .pagination.total,
        });
      } catch (requestError) {
        console.error(
          "Error al cargar las postulaciones:",
          requestError,
        );

        if (
          isAxiosError(requestError) &&
          requestError.response?.status ===
            404
        ) {
          setApplications([]);
          setPagination(null);
          setCounters(initialCounters);
          setProfileMissing(true);
          setError(null);

          return;
        }

        setApplications([]);
        setPagination(null);
        setCounters(initialCounters);

        setError(
          getErrorMessage(requestError),
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      debouncedSearch,
      statusFilter,
      page,
      perPage,
    ]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  /*
  |--------------------------------------------------------------------------
  | Control de filtros
  |--------------------------------------------------------------------------
  */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
  };

  const handleStatusFilterChange = (
    value: ApplicationStatusFilter,
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePerPageChange = (
    value: number,
  ) => {
    setPerPage(value);
    setPage(1);
  };

  const handlePageChange = (
    nextPage: number,
  ) => {
    if (nextPage < 1) {
      return;
    }

    if (
      pagination &&
      nextPage > pagination.last_page
    ) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Formulario de mensaje
  |--------------------------------------------------------------------------
  */

  const openMessageForm = (
    application: Application,
  ) => {
    if (
      application.status !== "pending"
    ) {
      void showError(
        "Solo puedes editar el mensaje de una postulación pendiente.",
      );

      return;
    }

    setSelectedApplication(application);
    setIsMessageFormOpen(true);
  };

  const closeMessageForm = () => {
    setSelectedApplication(null);
    setIsMessageFormOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Actualizar postulación local
  |--------------------------------------------------------------------------
  */

  const handleApplicationUpdated = (
    updatedApplication: Application,
  ) => {
    setApplications(
      (previousApplications) =>
        previousApplications.map(
          (application) =>
            application.id ===
            updatedApplication.id
              ? updatedApplication
              : application,
        ),
    );

    closeMessageForm();
  };

  /*
  |--------------------------------------------------------------------------
  | Retirar postulación
  |--------------------------------------------------------------------------
  */

  const handleWithdrawApplication =
    async (
      application: Application,
    ) => {
      if (
        application.status !==
        "pending"
      ) {
        await showError(
          "Solo puedes retirar una postulación pendiente.",
        );

        return;
      }

      const vacancyTitle =
        application.vacancy?.title ||
        "esta vacante";

      const confirmed = window.confirm(
        `¿Deseas retirar tu postulación a "${vacancyTitle}"?`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingApplicationId(
          application.id,
        );

        const response =
          await deleteApplication(
            application.id,
          );

        const isOnlyApplicationOnPage =
          applications.length === 1;

        setApplications(
          (previousApplications) =>
            previousApplications.filter(
              (currentApplication) =>
                currentApplication.id !==
                application.id,
            ),
        );

        setCounters(
          (previousCounters) => ({
            ...previousCounters,

            pending: Math.max(
              0,
              previousCounters.pending - 1,
            ),
          }),
        );

        setPagination(
          (previousPagination) => {
            if (!previousPagination) {
              return null;
            }

            const total = Math.max(
              0,
              previousPagination.total - 1,
            );

            const to =
              previousPagination.to === null
                ? null
                : Math.max(
                    previousPagination.from ??
                      0,
                    previousPagination.to - 1,
                  );

            return {
              ...previousPagination,
              total,
              to:
                total === 0
                  ? null
                  : to,
            };
          },
        );

        if (
          selectedApplication?.id ===
          application.id
        ) {
          closeMessageForm();
        }

        if (
          isOnlyApplicationOnPage &&
          page > 1
        ) {
          setPage(
            (currentPage) =>
              currentPage - 1,
          );
        }

        await showSuccess(
          response.message ||
            "Postulación retirada correctamente.",
        );
      } catch (requestError) {
        console.error(
          "Error al retirar la postulación:",
          requestError,
        );

        await showError(
          getErrorMessage(requestError),
        );
      } finally {
        setProcessingApplicationId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const totalApplications =
    useMemo(
      () =>
        counters.pending +
        counters.accepted +
        counters.rejected,
      [counters],
    );

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    statusFilter !== "all";

  const isEmpty =
    !isLoading &&
    !error &&
    !profileMissing &&
    applications.length === 0;

  const isProcessingApplication = (
    applicationId: number,
  ) =>
    processingApplicationId ===
    applicationId;

  return {
    applications,
    pagination,

    selectedApplication,
    isMessageFormOpen,

    isLoading,
    isEmpty,
    profileMissing,
    error,

    search,
    statusFilter,
    page,
    perPage,
    hasActiveFilters,

    totalApplications,
    pendingApplicationsCount:
      counters.pending,
    acceptedApplicationsCount:
      counters.accepted,
    rejectedApplicationsCount:
      counters.rejected,

    handleSearchChange,
    handleStatusFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    openMessageForm,
    closeMessageForm,

    handleApplicationUpdated,
    handleWithdrawApplication,

    isProcessingApplication,

    reloadApplications:
      loadApplications,
  };
}