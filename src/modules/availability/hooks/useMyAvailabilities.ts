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

import type { FreelancerProfile } from "../../profile/models/profile";

import type {
  Availability,
  AvailabilityErrorResponse,
  AvailabilityStatus,
} from "../models/availability";

import {
  deleteAvailability,
  getMyAvailabilities,
  updateAvailabilityStatus,
} from "../services/availabilityService";

/*
|--------------------------------------------------------------------------
| Mensajes de error
|--------------------------------------------------------------------------
*/

function getErrorMessage(error: unknown): string {
  if (
    isAxiosError<AvailabilityErrorResponse>(
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

export function useMyAvailabilities() {
  const [
    freelancerProfile,
    setFreelancerProfile,
  ] = useState<FreelancerProfile | null>(
    null,
  );

  const [
    availabilities,
    setAvailabilities,
  ] = useState<Availability[]>([]);

  const [
    selectedAvailability,
    setSelectedAvailability,
  ] = useState<Availability | null>(null);

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
    processingAvailabilityId,
    setProcessingAvailabilityId,
  ] = useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar disponibilidades
  |--------------------------------------------------------------------------
  */

  const loadAvailabilities =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProfileMissing(false);

        const response =
          await getMyAvailabilities();

        setFreelancerProfile(
          response.data.freelancer_profile,
        );

        setAvailabilities(
          response.data.availabilities ?? [],
        );
      } catch (requestError) {
        console.error(
          "Error al cargar las disponibilidades:",
          requestError,
        );

        if (
          isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setFreelancerProfile(null);
          setAvailabilities([]);
          setProfileMissing(true);
          setError(null);

          return;
        }

        setFreelancerProfile(null);
        setAvailabilities([]);
        setError(
          getErrorMessage(requestError),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadAvailabilities();
  }, [loadAvailabilities]);

  /*
  |--------------------------------------------------------------------------
  | Control del formulario
  |--------------------------------------------------------------------------
  */

  const openCreateForm = () => {
    setSelectedAvailability(null);
    setIsFormOpen(true);
  };

  const openEditForm = (
    availability: Availability,
  ) => {
    setSelectedAvailability(availability);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedAvailability(null);
    setIsFormOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Actualizar listado local
  |--------------------------------------------------------------------------
  */

  const sortAvailabilities = (
    items: Availability[],
  ): Availability[] => {
    return [...items].sort((first, second) =>
      first.start_date.localeCompare(
        second.start_date,
      ),
    );
  };

  const handleAvailabilityCreated = (
    availability: Availability,
  ) => {
    setAvailabilities((previous) =>
      sortAvailabilities([
        ...previous,
        availability,
      ]),
    );

    closeForm();
  };

  const handleAvailabilityUpdated = (
    updatedAvailability: Availability,
  ) => {
    setAvailabilities((previous) =>
      sortAvailabilities(
        previous.map((availability) =>
          availability.id ===
          updatedAvailability.id
            ? updatedAvailability
            : availability,
        ),
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
    availability: Availability,
    status: AvailabilityStatus,
  ) => {
    if (availability.status === status) {
      return;
    }

    try {
      setProcessingAvailabilityId(
        availability.id,
      );

      const response =
        await updateAvailabilityStatus(
          availability.id,
          status,
        );

      const updatedAvailability =
        response.data.availability;

      setAvailabilities((previous) =>
        previous.map(
          (currentAvailability) =>
            currentAvailability.id ===
            updatedAvailability.id
              ? updatedAvailability
              : currentAvailability,
        ),
      );

      await showSuccess(
        response.message ||
          "Estado actualizado correctamente.",
      );
    } catch (requestError) {
      console.error(
        "Error al cambiar el estado:",
        requestError,
      );

      await showError(
        getErrorMessage(requestError),
      );
    } finally {
      setProcessingAvailabilityId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Eliminar disponibilidad
  |--------------------------------------------------------------------------
  */

  const handleDeleteAvailability =
    async (
      availability: Availability,
    ) => {
      const confirmed = window.confirm(
        `¿Deseas eliminar la disponibilidad del ${availability.start_date} al ${availability.end_date}? Esta acción no se puede deshacer.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setProcessingAvailabilityId(
          availability.id,
        );

        const response =
          await deleteAvailability(
            availability.id,
          );

        setAvailabilities((previous) =>
          previous.filter(
            (currentAvailability) =>
              currentAvailability.id !==
              availability.id,
          ),
        );

        if (
          selectedAvailability?.id ===
          availability.id
        ) {
          closeForm();
        }

        await showSuccess(
          response.message ||
            "Disponibilidad eliminada correctamente.",
        );
      } catch (requestError) {
        console.error(
          "Error al eliminar la disponibilidad:",
          requestError,
        );

        await showError(
          getErrorMessage(requestError),
        );
      } finally {
        setProcessingAvailabilityId(null);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Contadores
  |--------------------------------------------------------------------------
  */

  const availableCount = useMemo(
    () =>
      availabilities.filter(
        (availability) =>
          availability.status ===
          "available",
      ).length,
    [availabilities],
  );

  const busyCount = useMemo(
    () =>
      availabilities.filter(
        (availability) =>
          availability.status === "busy",
      ).length,
    [availabilities],
  );

  const vacationCount = useMemo(
    () =>
      availabilities.filter(
        (availability) =>
          availability.status ===
          "vacation",
      ).length,
    [availabilities],
  );

  const isEmpty =
    !isLoading &&
    !error &&
    !profileMissing &&
    availabilities.length === 0;

  const isProcessingAvailability = (
    availabilityId: number,
  ) =>
    processingAvailabilityId ===
    availabilityId;

  return {
    freelancerProfile,
    availabilities,

    selectedAvailability,
    isFormOpen,

    isLoading,
    isEmpty,
    profileMissing,
    error,

    availableCount,
    busyCount,
    vacationCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleAvailabilityCreated,
    handleAvailabilityUpdated,

    handleStatusChange,
    handleDeleteAvailability,

    isProcessingAvailability,
    reloadAvailabilities:
      loadAvailabilities,
  };
}