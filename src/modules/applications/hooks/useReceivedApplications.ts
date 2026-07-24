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

import type { CompanyProfile } from "../../profile/models/profile";
import type { Vacancy } from "../../vacancies/models/vacancy";

import {
  getMyVacancies,
} from "../../vacancies/services/vacancyService";

import type {
  Application,
  ApplicationErrorResponse,
  ApplicationPagination,
  ApplicationStatus,
} from "../models/application";

import {
  acceptApplication,
  getApplications,
  rejectApplication,
} from "../services/applicationService";

/*
|--------------------------------------------------------------------------
| Tipos locales
|--------------------------------------------------------------------------
*/

export type ReceivedApplicationStatusFilter =
  | ApplicationStatus
  | "all";

export type ReceivedApplicationVacancyFilter =
  | number
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

    if (
      error.response?.status === 409 &&
      data?.data?.current_status
    ) {
      const labels: Record<
        ApplicationStatus,
        string
      > = {
        pending: "pendiente",
        accepted: "aceptada",
        rejected: "rechazada",
      };

      return `La postulación ya se encuentra ${labels[data.data.current_status]} y no puede modificarse.`;
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

export function useReceivedApplications() {
  const [
    companyProfile,
    setCompanyProfile,
  ] = useState<CompanyProfile | null>(null);

  const [vacancies, setVacancies] =
    useState<Vacancy[]>([]);

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
    isDetailOpen,
    setIsDetailOpen,
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
  ] =
    useState<ReceivedApplicationStatusFilter>(
      "all",
    );

  const [
    vacancyFilter,
    setVacancyFilter,
  ] =
    useState<ReceivedApplicationVacancyFilter>(
      "all",
    );

  const [page, setPage] =
    useState(1);

  const [perPage, setPerPage] =
    useState(9);

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

        const selectedVacancy =
          vacancyFilter === "all"
            ? undefined
            : vacancyFilter;

        const [
          vacanciesResponse,
          applicationsResponse,
          pendingResponse,
          acceptedResponse,
          rejectedResponse,
        ] = await Promise.all([
          getMyVacancies(),

          getApplications({
            search:
              debouncedSearch ||
              undefined,
            status: selectedStatus,
            vacancy_id: selectedVacancy,
            page,
            per_page: perPage,
          }),

          getApplications({
            status: "pending",
            page: 1,
            per_page: 1,
          }),

          getApplications({
            status: "accepted",
            page: 1,
            per_page: 1,
          }),

          getApplications({
            status: "rejected",
            page: 1,
            per_page: 1,
          }),
        ]);

        setCompanyProfile(
          vacanciesResponse.data
            .company_profile,
        );

        setVacancies(
          vacanciesResponse.data
            .vacancies ?? [],
        );

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
          "Error al cargar las postulaciones recibidas:",
          requestError,
        );

        if (
          isAxiosError(requestError) &&
          requestError.response?.status ===
            404
        ) {
          setCompanyProfile(null);
          setVacancies([]);
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
      vacancyFilter,
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
    value: ReceivedApplicationStatusFilter,
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleVacancyFilterChange = (
    value: ReceivedApplicationVacancyFilter,
  ) => {
    setVacancyFilter(value);
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
    setVacancyFilter("all");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Detalle de postulación
  |--------------------------------------------------------------------------
  */

  const openApplicationDetail = (
    application: Application,
  ) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const closeApplicationDetail = () => {
    setSelectedApplication(null);
    setIsDetailOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Aceptar postulación
  |--------------------------------------------------------------------------
  */

  const handleAcceptApplication =
    async (
      application: Application,
    ) => {
      if (
        application.status !==
        "pending"
      ) {
        await showError(
          "Solo puedes aceptar una postulación pendiente.",
        );

        return;
      }

      const freelancerName = [
        application.freelancer_profile
          ?.user?.name,
        application.freelancer_profile
          ?.user?.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      const confirmed = window.confirm(
        `¿Deseas aceptar la postulación de ${
          freelancerName ||
          "este freelancer"
        }? Esta decisión será definitiva.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingApplicationId(
          application.id,
        );

        const response =
          await acceptApplication(
            application.id,
          );

        if (
          selectedApplication?.id ===
          application.id
        ) {
          setSelectedApplication(
            response.data.application,
          );
        }

        await loadApplications();

        await showSuccess(
          response.message ||
            "Postulación aceptada correctamente.",
        );
      } catch (requestError) {
        console.error(
          "Error al aceptar la postulación:",
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
  | Rechazar postulación
  |--------------------------------------------------------------------------
  */

  const handleRejectApplication =
    async (
      application: Application,
    ) => {
      if (
        application.status !==
        "pending"
      ) {
        await showError(
          "Solo puedes rechazar una postulación pendiente.",
        );

        return;
      }

      const freelancerName = [
        application.freelancer_profile
          ?.user?.name,
        application.freelancer_profile
          ?.user?.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      const confirmed = window.confirm(
        `¿Deseas rechazar la postulación de ${
          freelancerName ||
          "este freelancer"
        }? Esta decisión será definitiva.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingApplicationId(
          application.id,
        );

        const response =
          await rejectApplication(
            application.id,
          );

        if (
          selectedApplication?.id ===
          application.id
        ) {
          setSelectedApplication(
            response.data.application,
          );
        }

        await loadApplications();

        await showSuccess(
          response.message ||
            "Postulación rechazada correctamente.",
        );
      } catch (requestError) {
        console.error(
          "Error al rechazar la postulación:",
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
    statusFilter !== "all" ||
    vacancyFilter !== "all";

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
    companyProfile,
    vacancies,
    applications,
    pagination,

    selectedApplication,
    isDetailOpen,

    isLoading,
    isEmpty,
    profileMissing,
    error,

    search,
    statusFilter,
    vacancyFilter,
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
    handleVacancyFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    openApplicationDetail,
    closeApplicationDetail,

    handleAcceptApplication,
    handleRejectApplication,

    isProcessingApplication,

    reloadApplications:
      loadApplications,
  };
}