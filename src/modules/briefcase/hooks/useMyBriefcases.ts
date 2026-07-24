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
  BriefcaseErrorResponse,
  BriefcaseProject,
} from "../models/briefcase";

import {
  deleteBriefcase,
  deleteBriefcaseImage,
  getMyBriefcases,
} from "../services/briefcaseService";

/*
|--------------------------------------------------------------------------
| Mensajes de error
|--------------------------------------------------------------------------
*/

function getErrorMessage(error: unknown): string {
  if (isAxiosError<BriefcaseErrorResponse>(error)) {
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

export function useMyBriefcases() {
  const [
    freelancerProfile,
    setFreelancerProfile,
  ] = useState<FreelancerProfile | null>(null);

  const [briefcases, setBriefcases] = useState<
    BriefcaseProject[]
  >([]);

  const [
    selectedBriefcase,
    setSelectedBriefcase,
  ] = useState<BriefcaseProject | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [profileMissing, setProfileMissing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    processingBriefcaseId,
    setProcessingBriefcaseId,
  ] = useState<number | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar mi portafolio
  |--------------------------------------------------------------------------
  */

  const loadBriefcases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProfileMissing(false);

      const response =
        await getMyBriefcases();

      setFreelancerProfile(
        response.data.freelancer_profile,
      );

      setBriefcases(
        response.data.briefcases ?? [],
      );
    } catch (requestError) {
      console.error(
        "Error al cargar el portafolio:",
        requestError,
      );

      if (
        isAxiosError(requestError) &&
        requestError.response?.status === 404
      ) {
        setFreelancerProfile(null);
        setBriefcases([]);
        setProfileMissing(true);
        setError(null);

        return;
      }

      setFreelancerProfile(null);
      setBriefcases([]);
      setError(
        getErrorMessage(requestError),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBriefcases();
  }, [loadBriefcases]);

  /*
  |--------------------------------------------------------------------------
  | Abrir y cerrar formulario
  |--------------------------------------------------------------------------
  */

  const openCreateForm = () => {
    setSelectedBriefcase(null);
    setIsFormOpen(true);
  };

  const openEditForm = (
    briefcase: BriefcaseProject,
  ) => {
    setSelectedBriefcase(briefcase);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedBriefcase(null);
    setIsFormOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Actualizar listado local
  |--------------------------------------------------------------------------
  */

  const handleBriefcaseCreated = (
    briefcase: BriefcaseProject,
  ) => {
    setBriefcases((previous) => [
      briefcase,
      ...previous,
    ]);

    closeForm();
  };

  const handleBriefcaseUpdated = (
    updatedBriefcase: BriefcaseProject,
  ) => {
    setBriefcases((previous) =>
      previous.map((briefcase) =>
        briefcase.id === updatedBriefcase.id
          ? updatedBriefcase
          : briefcase,
      ),
    );

    closeForm();
  };

  /**
   * Actualiza el proyecto en pantalla sin cerrar el formulario.
   * Se utilizará cuando se reemplace o elimine una imagen.
   */
  const replaceBriefcaseInList = (
    updatedBriefcase: BriefcaseProject,
  ) => {
    setBriefcases((previous) =>
      previous.map((briefcase) =>
        briefcase.id === updatedBriefcase.id
          ? updatedBriefcase
          : briefcase,
      ),
    );

    setSelectedBriefcase((current) =>
      current?.id === updatedBriefcase.id
        ? updatedBriefcase
        : current,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Eliminar imagen
  |--------------------------------------------------------------------------
  */

  const handleDeleteImage = async (
    briefcase: BriefcaseProject,
  ) => {
    if (!briefcase.image_url) {
      await showError(
        "Este proyecto no tiene una imagen para eliminar.",
      );

      return;
    }

    const confirmed = window.confirm(
      `¿Deseas eliminar la imagen del proyecto "${briefcase.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingBriefcaseId(
        briefcase.id,
      );

      const response =
        await deleteBriefcaseImage(
          briefcase.id,
        );

      replaceBriefcaseInList(
        response.data.briefcase,
      );

      await showSuccess(
        response.message ||
          "Imagen eliminada correctamente.",
      );
    } catch (requestError) {
      console.error(
        "Error al eliminar la imagen:",
        requestError,
      );

      await showError(
        getErrorMessage(requestError),
      );
    } finally {
      setProcessingBriefcaseId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Eliminar proyecto
  |--------------------------------------------------------------------------
  */

  const handleDeleteBriefcase = async (
    briefcase: BriefcaseProject,
  ) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el proyecto "${briefcase.title}" del portafolio? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingBriefcaseId(
        briefcase.id,
      );

      const response =
        await deleteBriefcase(
          briefcase.id,
        );

      setBriefcases((previous) =>
        previous.filter(
          (currentBriefcase) =>
            currentBriefcase.id !==
            briefcase.id,
        ),
      );

      if (
        selectedBriefcase?.id ===
        briefcase.id
      ) {
        closeForm();
      }

      await showSuccess(
        response.message ||
          "Proyecto eliminado correctamente.",
      );
    } catch (requestError) {
      console.error(
        "Error al eliminar el proyecto:",
        requestError,
      );

      await showError(
        getErrorMessage(requestError),
      );
    } finally {
      setProcessingBriefcaseId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Información calculada
  |--------------------------------------------------------------------------
  */

  const projectsWithImageCount =
    useMemo(
      () =>
        briefcases.filter(
          (briefcase) =>
            Boolean(briefcase.image_url),
        ).length,
      [briefcases],
    );

  const projectsWithLinkCount =
    useMemo(
      () =>
        briefcases.filter(
          (briefcase) =>
            Boolean(briefcase.project_url),
        ).length,
      [briefcases],
    );

  const isEmpty =
    !isLoading &&
    !error &&
    !profileMissing &&
    briefcases.length === 0;

  const isProcessingBriefcase = (
    briefcaseId: number,
  ) =>
    processingBriefcaseId === briefcaseId;

  return {
    freelancerProfile,
    briefcases,

    selectedBriefcase,
    isFormOpen,

    isLoading,
    isEmpty,
    profileMissing,
    error,

    projectsWithImageCount,
    projectsWithLinkCount,

    openCreateForm,
    openEditForm,
    closeForm,

    handleBriefcaseCreated,
    handleBriefcaseUpdated,
    replaceBriefcaseInList,

    handleDeleteImage,
    handleDeleteBriefcase,

    isProcessingBriefcase,
    reloadBriefcases: loadBriefcases,
  };
}