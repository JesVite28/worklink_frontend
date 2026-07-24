import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { isAxiosError } from "axios";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import type {
  BriefcaseErrorResponse,
  BriefcaseFormState,
  BriefcaseProject,
  CreateBriefcasePayload,
  UpdateBriefcasePayload,
} from "../models/briefcase";

import {
  createBriefcase,
  updateBriefcase,
  updateBriefcaseImage,
} from "../services/briefcaseService";

interface Props {
  briefcase: BriefcaseProject | null;

  onCreated: (
    briefcase: BriefcaseProject,
  ) => void;

  onUpdated: (
    briefcase: BriefcaseProject,
  ) => void;

  onClose: () => void;
}

const initialState: BriefcaseFormState = {
  title: "",
  description: "",
  project_url: "",
  image: null,
};

/*
|--------------------------------------------------------------------------
| Utilidades
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
      "No fue posible guardar el proyecto."
    );
  }

  return "No fue posible guardar el proyecto.";
}

function optionalValue(
  value: string,
): string | null {
  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function isValidUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useBriefcaseForm({
  briefcase,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const [form, setForm] =
    useState<BriefcaseFormState>(
      initialState,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const isEditing = Boolean(briefcase);

  /*
  |--------------------------------------------------------------------------
  | Cargar información
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!briefcase) {
      setForm(initialState);
      return;
    }

    setForm({
      title: briefcase.title ?? "",
      description:
        briefcase.description ?? "",
      project_url:
        briefcase.project_url ?? "",
      image: null,
    });
  }, [briefcase]);

  /*
  |--------------------------------------------------------------------------
  | Vista previa de imagen
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!form.image) {
      setImagePreview(
        briefcase?.image_url ?? null,
      );

      return;
    }

    const previewUrl =
      URL.createObjectURL(form.image);

    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [
    form.image,
    briefcase?.image_url,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Campos de texto
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Seleccionar imagen
  |--------------------------------------------------------------------------
  */

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type,
      )
    ) {
      event.target.value = "";

      await showWarning(
        "La imagen debe estar en formato JPG, JPEG, PNG o WEBP.",
      );

      return;
    }

    const maximumSize =
      2 * 1024 * 1024;

    if (
      selectedFile.size > maximumSize
    ) {
      event.target.value = "";

      await showWarning(
        "La imagen no puede superar los 2 MB.",
      );

      return;
    }

    setForm((previous) => ({
      ...previous,
      image: selectedFile,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Quitar imagen seleccionada
  |--------------------------------------------------------------------------
  |
  | Esto solo descarta la nueva imagen seleccionada.
  | No elimina del servidor la imagen que ya tiene el proyecto.
  |
  */

  const clearSelectedImage = () => {
    setForm((previous) => ({
      ...previous,
      image: null,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Restablecer formulario
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    if (briefcase) {
      setForm({
        title: briefcase.title ?? "",
        description:
          briefcase.description ?? "",
        project_url:
          briefcase.project_url ?? "",
        image: null,
      });

      return;
    }

    setForm(initialState);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Validaciones
  |--------------------------------------------------------------------------
  */

  const validateForm =
    async (): Promise<boolean> => {
      const title = form.title.trim();
      const description =
        form.description.trim();

      const projectUrl =
        form.project_url.trim();

      if (!title) {
        await showWarning(
          "Ingresa el título del proyecto.",
        );

        return false;
      }

      if (title.length > 150) {
        await showWarning(
          "El título no puede superar los 150 caracteres.",
        );

        return false;
      }

      if (description.length > 3000) {
        await showWarning(
          "La descripción no puede superar los 3000 caracteres.",
        );

        return false;
      }

      if (projectUrl.length > 255) {
        await showWarning(
          "El enlace del proyecto no puede superar los 255 caracteres.",
        );

        return false;
      }

      if (
        projectUrl &&
        !isValidUrl(projectUrl)
      ) {
        await showWarning(
          "Ingresa un enlace válido que comience con http:// o https://.",
        );

        return false;
      }

      if (form.image) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (
          !allowedTypes.includes(
            form.image.type,
          )
        ) {
          await showWarning(
            "La imagen debe estar en formato JPG, JPEG, PNG o WEBP.",
          );

          return false;
        }

        if (
          form.image.size >
          2 * 1024 * 1024
        ) {
          await showWarning(
            "La imagen no puede superar los 2 MB.",
          );

          return false;
        }
      }

      return true;
    };

  /*
  |--------------------------------------------------------------------------
  | Guardar
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const isValid =
      await validateForm();

    if (!isValid) {
      return;
    }

    const title = form.title.trim();

    const description =
      optionalValue(form.description);

    const projectUrl =
      optionalValue(form.project_url);

    try {
      setIsSaving(true);

      /*
      |--------------------------------------------------------------------------
      | Actualizar proyecto existente
      |--------------------------------------------------------------------------
      */

      if (briefcase) {
        const informationChanged =
          title !== briefcase.title ||
          description !==
            briefcase.description ||
          projectUrl !==
            briefcase.project_url;

        const imageChanged =
          Boolean(form.image);

        if (
          !informationChanged &&
          !imageChanged
        ) {
          await showWarning(
            "No realizaste cambios en el proyecto.",
          );

          return;
        }

        let updatedBriefcase =
          briefcase;

        if (informationChanged) {
          const payload: UpdateBriefcasePayload =
            {
              title,
              description,
              project_url: projectUrl,
            };

          const response =
            await updateBriefcase(
              briefcase.id,
              payload,
            );

          updatedBriefcase =
            response.data.briefcase;
        }

        if (form.image) {
          const imageResponse =
            await updateBriefcaseImage(
              briefcase.id,
              form.image,
            );

          updatedBriefcase =
            imageResponse.data.briefcase;
        }

        onUpdated(updatedBriefcase);

        await showSuccess(
          "Proyecto actualizado correctamente.",
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Crear proyecto
      |--------------------------------------------------------------------------
      */

      const payload: CreateBriefcasePayload =
        {
          title,
          description,
          project_url: projectUrl,
          image: form.image,
        };

      const response =
        await createBriefcase(payload);

      onCreated(
        response.data.briefcase,
      );

      await showSuccess(
        response.message ||
          "Proyecto añadido al portafolio correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al guardar el proyecto del portafolio:",
        error,
      );

      await showError(
        getErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    imagePreview,

    isEditing,
    isSaving,

    handleChange,
    handleImageChange,
    clearSelectedImage,

    handleSubmit,
    handleClose,
    resetForm,
  };
}