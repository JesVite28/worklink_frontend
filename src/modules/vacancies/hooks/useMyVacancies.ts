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

import type {
  Vacancy,
  VacancyErrorResponse,
  VacancyStatus,
} from "../models/vacancy";

import {
  deleteVacancy,
  getMyVacancies,
  updateVacancyStatus,
} from "../services/vacancyService";

/*
|--------------------------------------------------------------------------
| Mensajes de error
|--------------------------------------------------------------------------
*/

function getErrorMessage(error: unknown): string {
  if (isAxiosError<VacancyErrorResponse>(error)) {
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
| Ordenar vacantes
|--------------------------------------------------------------------------
*/

function sortVacancies(
  vacancies: Vacancy[],
): Vacancy[] {
  return [...vacancies].sort(
    (firstVacancy, secondVacancy) => {
      const firstDate = new Date(
        firstVacancy.created_at,
      ).getTime();

      const secondDate = new Date(
        secondVacancy.created_at,
      ).getTime();

      return secondDate - firstDate;
    },
  );
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useMyVacancies() {
  const [
    companyProfile,
    setCompanyProfile,
  ] = useState<CompanyProfile | null>(null);

  const [vacancies, setVacancies] = useState<
    Vacancy[]
  >([]);

  const [
    selectedVacancy,
    setSelectedVacancy,
  ] = useState<Vacancy | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [profileMissing, setProfileMissing] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [
    processingVacancyId,
    setProcessingVacancyId,
  ] = useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar vacantes
  |--------------------------------------------------------------------------
  */

  const loadVacancies =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProfileMissing(false);

        const response =
          await getMyVacancies();

        setCompanyProfile(
          response.data.company_profile,
        );

        setVacancies(
          sortVacancies(
            response.data.vacancies ?? [],
          ),
        );
      } catch (requestError) {
        console.error(
          "Error al cargar las vacantes:",
          requestError,
        );

        if (
          isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setCompanyProfile(null);
          setVacancies([]);
          setProfileMissing(true);
          setError(null);

          return;
        }

        setCompanyProfile(null);
        setVacancies([]);
        setError(
          getErrorMessage(requestError),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadVacancies();
  }, [loadVacancies]);

  /*
  |--------------------------------------------------------------------------
  | Control del formulario
  |--------------------------------------------------------------------------
  */

  const openCreateForm = () => {
    setSelectedVacancy(null);
    setIsFormOpen(true);
  };

  const openEditForm = (
    vacancy: Vacancy,
  ) => {
    if (vacancy.status === "closed") {
      void showError(
        "La vacante está cerrada y ya no puede modificarse.",
      );

      return;
    }

    setSelectedVacancy(vacancy);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedVacancy(null);
    setIsFormOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Actualizar listado local
  |--------------------------------------------------------------------------
  */

  const handleVacancyCreated = (
    vacancy: Vacancy,
  ) => {
    setVacancies((previousVacancies) =>
      sortVacancies([
        vacancy,
        ...previousVacancies,
      ]),
    );

    closeForm();
  };

  const handleVacancyUpdated = (
    updatedVacancy: Vacancy,
  ) => {
    setVacancies((previousVacancies) =>
      previousVacancies.map((vacancy) =>
        vacancy.id === updatedVacancy.id
          ? updatedVacancy
          : vacancy,
      ),
    );

    closeForm();
  };

  /*
  |--------------------------------------------------------------------------
  | Cambiar estado
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    vacancy: Vacancy,
    status: VacancyStatus,
  ) => {
    if (vacancy.status === status) {
      return;
    }

    if (vacancy.status === "closed") {
      await showError(
        "Una vacante cerrada ya no puede modificarse ni reabrirse.",
      );

      return;
    }

    if (status === "closed") {
      const confirmed = window.confirm(
        `¿Deseas cerrar la vacante "${vacancy.title}"? Después de cerrarla ya no podrás editarla ni volver a abrirla.`,
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setProcessingVacancyId(vacancy.id);

      const response =
        await updateVacancyStatus(
          vacancy.id,
          status,
        );

      const updatedVacancy =
        response.data.vacancy;

      setVacancies((previousVacancies) =>
        previousVacancies.map(
          (currentVacancy) =>
            currentVacancy.id ===
            updatedVacancy.id
              ? updatedVacancy
              : currentVacancy,
        ),
      );

      let successMessage =
        "Estado actualizado correctamente.";

      if (
        updatedVacancy.status === "open"
      ) {
        successMessage =
          "Vacante abierta correctamente.";
      }

      if (
        updatedVacancy.status === "paused"
      ) {
        successMessage =
          "Vacante pausada correctamente.";
      }

      if (
        updatedVacancy.status === "closed"
      ) {
        successMessage =
          "Vacante cerrada correctamente.";
      }

      await showSuccess(
        response.message || successMessage,
      );
    } catch (requestError) {
      console.error(
        "Error al cambiar el estado de la vacante:",
        requestError,
      );

      await showError(
        getErrorMessage(requestError),
      );
    } finally {
      setProcessingVacancyId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Eliminar vacante
  |--------------------------------------------------------------------------
  */

  const handleDeleteVacancy = async (
    vacancy: Vacancy,
  ) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar la vacante "${vacancy.title}"? Esta acción la retirará del sistema.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingVacancyId(vacancy.id);

      const response =
        await deleteVacancy(vacancy.id);

      setVacancies((previousVacancies) =>
        previousVacancies.filter(
          (currentVacancy) =>
            currentVacancy.id !== vacancy.id,
        ),
      );

      if (
        selectedVacancy?.id ===
        vacancy.id
      ) {
        closeForm();
      }

      await showSuccess(
        response.message ||
          "Vacante eliminada correctamente.",
      );
    } catch (requestError) {
      console.error(
        "Error al eliminar la vacante:",
        requestError,
      );

      await showError(
        getErrorMessage(requestError),
      );
    } finally {
      setProcessingVacancyId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Contadores
  |--------------------------------------------------------------------------
  */

  const openVacanciesCount = useMemo(
    () =>
      vacancies.filter(
        (vacancy) =>
          vacancy.status === "open",
      ).length,
    [vacancies],
  );

  const pausedVacanciesCount = useMemo(
    () =>
      vacancies.filter(
        (vacancy) =>
          vacancy.status === "paused",
      ).length,
    [vacancies],
  );

  const closedVacanciesCount = useMemo(
    () =>
      vacancies.filter(
        (vacancy) =>
          vacancy.status === "closed",
      ).length,
    [vacancies],
  );

  const acceptingApplicationsCount =
    useMemo(
      () =>
        vacancies.filter(
          (vacancy) =>
            vacancy.accepts_applications,
        ).length,
      [vacancies],
    );

  const isEmpty =
    !isLoading &&
    !error &&
    !profileMissing &&
    vacancies.length === 0;

  const isProcessingVacancy = (
    vacancyId: number,
  ) =>
    processingVacancyId === vacancyId;

  return {
    companyProfile,
    vacancies,

    selectedVacancy,
    isFormOpen,

    isLoading,
    isEmpty,
    profileMissing,
    error,

    openVacanciesCount,
    pausedVacanciesCount,
    closedVacanciesCount,
    acceptingApplicationsCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleVacancyCreated,
    handleVacancyUpdated,

    handleStatusChange,
    handleDeleteVacancy,

    isProcessingVacancy,
    reloadVacancies: loadVacancies,
  };
}