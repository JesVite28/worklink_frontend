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
  CreateServicePayload,
  FreelancerService,
  ServiceErrorResponse,
  ServiceFormState,
} from "../models/service";

import {
  createService,
  updateService,
} from "../services/serviceService";

interface Props {
  service: FreelancerService | null;
  onCreated: (
    service: FreelancerService,
  ) => void;
  onUpdated: (
    service: FreelancerService,
  ) => void;
  onClose: () => void;
}

const initialState: ServiceFormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  location: "",
  is_active: true,
};

function getErrorMessage(
  error: unknown,
): string {
  if (isAxiosError<ServiceErrorResponse>(error)) {
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
      "No fue posible guardar el servicio."
    );
  }

  return "No fue posible guardar el servicio.";
}

function optionalValue(
  value: string,
): string | null {
  const normalizedValue = value.trim();

  return normalizedValue || null;
}

export function useServiceForm({
  service,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const [form, setForm] =
    useState<ServiceFormState>(initialState);

  const [isSaving, setIsSaving] =
    useState(false);

  const isEditing = Boolean(service);

  /*
  |--------------------------------------------------------------------------
  | Cargar información del servicio seleccionado
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!service) {
      setForm(initialState);
      return;
    }

    setForm({
      title: service.title ?? "",
      description: service.description ?? "",
      price: service.price ?? "",
      category: service.category ?? "",
      location: service.location ?? "",
      is_active: service.is_active,
    });
  }, [service]);

  /*
  |--------------------------------------------------------------------------
  | Actualizar campos
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
    ) {
      const checked = event.target.checked;

      setForm((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Restablecer y cerrar
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
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

  const validateForm = async (): Promise<boolean> => {
    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category.trim();
    const location = form.location.trim();
    const price = form.price.trim();

    if (!title) {
      await showWarning(
        "Ingresa el título del servicio.",
      );

      return false;
    }

    if (title.length > 150) {
      await showWarning(
        "El título no puede superar los 150 caracteres.",
      );

      return false;
    }

    if (!description) {
      await showWarning(
        "Ingresa una descripción para el servicio.",
      );

      return false;
    }

    if (description.length > 3000) {
      await showWarning(
        "La descripción no puede superar los 3000 caracteres.",
      );

      return false;
    }

    if (!category) {
      await showWarning(
        "Ingresa la categoría del servicio.",
      );

      return false;
    }

    if (category.length > 100) {
      await showWarning(
        "La categoría no puede superar los 100 caracteres.",
      );

      return false;
    }

    if (location.length > 150) {
      await showWarning(
        "La ubicación no puede superar los 150 caracteres.",
      );

      return false;
    }

    if (price) {
      const numericPrice = Number(price);

      if (
        Number.isNaN(numericPrice) ||
        !Number.isFinite(numericPrice)
      ) {
        await showWarning(
          "La tarifa debe ser un número válido.",
        );

        return false;
      }

      if (numericPrice < 0) {
        await showWarning(
          "La tarifa no puede ser negativa.",
        );

        return false;
      }
    }

    return true;
  };

  /*
  |--------------------------------------------------------------------------
  | Guardar servicio
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

    const normalizedPrice =
      form.price.trim();

    const payload: CreateServicePayload = {
      title: form.title.trim(),
      description:
        form.description.trim(),
      price: normalizedPrice
        ? Number(normalizedPrice)
        : null,
      category: form.category.trim(),
      location: optionalValue(
        form.location,
      ),
      is_active: form.is_active,
    };

    try {
      setIsSaving(true);

      if (service) {
        const response =
          await updateService(
            service.id,
            payload,
          );

        const updatedService =
          response.data.service;

        onUpdated(updatedService);

        await showSuccess(
          response.message ||
            "Servicio actualizado correctamente.",
        );

        return;
      }

      const response =
        await createService(payload);

      const createdService =
        response.data.service;

      onCreated(createdService);

      await showSuccess(
        response.message ||
          "Servicio creado correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al guardar el servicio:",
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

    isEditing,
    isSaving,

    handleChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}