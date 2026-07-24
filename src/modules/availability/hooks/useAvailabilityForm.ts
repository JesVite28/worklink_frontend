import {
  useEffect,
  useMemo,
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
  Availability,
  AvailabilityErrorResponse,
  AvailabilityFormState,
  CreateAvailabilityPayload,
  UpdateAvailabilityPayload,
} from "../models/availability";

import {
  createAvailability,
  updateAvailability,
} from "../services/availabilityService";

interface Props {
  availability: Availability | null;

  onCreated: (
    availability: Availability,
  ) => void;

  onUpdated: (
    availability: Availability,
  ) => void;

  onClose: () => void;
}

const initialState: AvailabilityFormState = {
  start_date: "",
  end_date: "",
  status: "available",
};

/*
|--------------------------------------------------------------------------
| Utilidades
|--------------------------------------------------------------------------
*/

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    today.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getErrorMessage(
  error: unknown,
): string {
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
      "No fue posible guardar la disponibilidad."
    );
  }

  return "No fue posible guardar la disponibilidad.";
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useAvailabilityForm({
  availability,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const [form, setForm] =
    useState<AvailabilityFormState>(
      initialState,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const isEditing = Boolean(availability);

  const today = useMemo(
    () => getTodayDate(),
    [],
  );

  /*
  |--------------------------------------------------------------------------
  | Cargar disponibilidad seleccionada
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!availability) {
      setForm(initialState);

      return;
    }

    setForm({
      start_date:
        availability.start_date ?? "",
      end_date:
        availability.end_date ?? "",
      status: availability.status,
    });
  }, [availability]);

  /*
  |--------------------------------------------------------------------------
  | Actualizar campos
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => {
      /*
       * Si la fecha inicial cambia y la fecha final
       * queda antes, limpiamos la fecha final.
       */
      if (
        name === "start_date" &&
        previous.end_date &&
        previous.end_date < value
      ) {
        return {
          ...previous,
          start_date: value,
          end_date: "",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Restablecer y cerrar
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    if (availability) {
      setForm({
        start_date:
          availability.start_date ?? "",
        end_date:
          availability.end_date ?? "",
        status: availability.status,
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
      if (!form.start_date) {
        await showWarning(
          "Selecciona la fecha inicial.",
        );

        return false;
      }

      if (!form.end_date) {
        await showWarning(
          "Selecciona la fecha final.",
        );

        return false;
      }

      /*
       * En edición solamente validamos que no sea
       * anterior a hoy cuando la fecha inicial cambió.
       *
       * Esto permite modificar únicamente el estado de
       * un periodo que ya comenzó.
       */
      const startDateChanged =
        !availability ||
        form.start_date !==
          availability.start_date;

      if (
        startDateChanged &&
        form.start_date < today
      ) {
        await showWarning(
          "La fecha inicial no puede ser anterior al día de hoy.",
        );

        return false;
      }

      if (
        form.end_date < form.start_date
      ) {
        await showWarning(
          "La fecha final debe ser igual o posterior a la fecha inicial.",
        );

        return false;
      }

      const validStatuses = [
        "available",
        "busy",
        "vacation",
      ];

      if (
        !validStatuses.includes(
          form.status,
        )
      ) {
        await showWarning(
          "Selecciona un estado válido.",
        );

        return false;
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

    try {
      setIsSaving(true);

      /*
      |--------------------------------------------------------------------------
      | Actualización
      |--------------------------------------------------------------------------
      */

      if (availability) {
        const payload: UpdateAvailabilityPayload =
          {};

        if (
          form.start_date !==
          availability.start_date
        ) {
          payload.start_date =
            form.start_date;
        }

        if (
          form.end_date !==
          availability.end_date
        ) {
          payload.end_date =
            form.end_date;
        }

        if (
          form.status !==
          availability.status
        ) {
          payload.status = form.status;
        }

        if (
          Object.keys(payload).length === 0
        ) {
          await showWarning(
            "No realizaste cambios en la disponibilidad.",
          );

          return;
        }

        const response =
          await updateAvailability(
            availability.id,
            payload,
          );

        onUpdated(
          response.data.availability,
        );

        await showSuccess(
          response.message ||
            "Disponibilidad actualizada correctamente.",
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Creación
      |--------------------------------------------------------------------------
      */

      const payload: CreateAvailabilityPayload =
        {
          start_date: form.start_date,
          end_date: form.end_date,
          status: form.status,
        };

      const response =
        await createAvailability(payload);

      onCreated(
        response.data.availability,
      );

      await showSuccess(
        response.message ||
          "Disponibilidad creada correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al guardar la disponibilidad:",
        error,
      );

      await showError(
        getErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fechas mínimas para los inputs
  |--------------------------------------------------------------------------
  */

  const minimumStartDate =
    availability &&
    availability.start_date < today
      ? availability.start_date
      : today;

  const minimumEndDate =
    form.start_date || today;

  return {
    form,

    isEditing,
    isSaving,

    today,
    minimumStartDate,
    minimumEndDate,

    handleChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}