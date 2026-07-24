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
  Application,
  ApplicationErrorResponse,
} from "../models/application";

import { updateApplicationMessage } from "../services/applicationService";

interface Props {
  application: Application | null;

  onUpdated: (
    application: Application,
  ) => void;

  onClose: () => void;
}

interface ApplicationMessageFormState {
  message: string;
}

const initialState: ApplicationMessageFormState = {
  message: "",
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
      const statusLabels = {
        pending: "pendiente",
        accepted: "aceptada",
        rejected: "rechazada",
      };

      const currentStatus =
        statusLabels[
          data.data.current_status
        ];

      return `La postulación se encuentra ${currentStatus} y ya no puede modificarse.`;
    }

    return (
      data?.message ||
      "No fue posible actualizar el mensaje."
    );
  }

  return "No fue posible actualizar el mensaje.";
}

/*
|--------------------------------------------------------------------------
| Normalizar mensajes
|--------------------------------------------------------------------------
*/

function normalizeMessage(
  message: string | null,
): string {
  return message?.trim() ?? "";
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useApplicationMessageForm({
  application,
  onUpdated,
  onClose,
}: Props) {
  const [form, setForm] =
    useState<ApplicationMessageFormState>(
      initialState,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Cargar postulación seleccionada
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!application) {
      setForm(initialState);

      return;
    }

    setForm({
      message: application.message ?? "",
    });
  }, [application]);

  /*
  |--------------------------------------------------------------------------
  | Actualizar campo
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setForm({
      message: event.target.value,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Restablecer y cerrar
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setForm({
      message:
        application?.message ?? "",
    });
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    resetForm();
    onClose();
  };

  /*
  |--------------------------------------------------------------------------
  | Guardar mensaje
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!application) {
      await showError(
        "No se encontró la postulación seleccionada.",
      );

      return;
    }

    if (
      application.status !== "pending"
    ) {
      await showWarning(
        "Solo puedes editar el mensaje de una postulación pendiente.",
      );

      return;
    }

    const message = form.message.trim();

    if (message.length > 5000) {
      await showWarning(
        "El mensaje no puede superar los 5000 caracteres.",
      );

      return;
    }

    const currentMessage =
      normalizeMessage(
        application.message,
      );

    if (message === currentMessage) {
      await showWarning(
        "No realizaste cambios en el mensaje.",
      );

      return;
    }

    try {
      setIsSaving(true);

      const response =
        await updateApplicationMessage(
          application.id,
          {
            message:
              message.length > 0
                ? message
                : null,
          },
        );

      onUpdated(
        response.data.application,
      );

      await showSuccess(
        response.message ||
          "Mensaje actualizado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al actualizar el mensaje de la postulación:",
        error,
      );

      await showError(
        getErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const charactersRemaining =
    5000 - form.message.length;

  const hasChanges =
    normalizeMessage(form.message) !==
    normalizeMessage(
      application?.message ?? null,
    );

  return {
    form,

    isSaving,
    hasChanges,
    charactersRemaining,

    handleChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}