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
  CreateVacancyPayload,
  UpdateVacancyPayload,
  Vacancy,
  VacancyErrorResponse,
  VacancyFormState,
  VacancyStatus,
} from "../models/vacancy";

import {
  createVacancy,
  updateVacancy,
} from "../services/vacancyService";

interface Props {
  vacancy: Vacancy | null;

  onCreated: (vacancy: Vacancy) => void;

  onUpdated: (vacancy: Vacancy) => void;

  onClose: () => void;
}

const initialState: VacancyFormState = {
  title: "",
  description: "",
  category: "",
  location: "",
  salary: "",
  status: "open",
};

/*
|--------------------------------------------------------------------------
| Utilidades
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
      "No fue posible guardar la vacante."
    );
  }

  return "No fue posible guardar la vacante.";
}

function normalizeSalary(
  salary: string | null,
): number | null {
  if (
    salary === null ||
    salary === undefined ||
    salary.trim() === ""
  ) {
    return null;
  }

  const numericSalary = Number(salary);

  if (
    Number.isNaN(numericSalary) ||
    !Number.isFinite(numericSalary)
  ) {
    return null;
  }

  return numericSalary;
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useVacancyForm({
  vacancy,
  onCreated,
  onUpdated,
  onClose,
}: Props) {
  const [form, setForm] =
    useState<VacancyFormState>(
      initialState,
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const isEditing = Boolean(vacancy);

  /*
  |--------------------------------------------------------------------------
  | Cargar vacante seleccionada
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!vacancy) {
      setForm(initialState);

      return;
    }

    setForm({
      title: vacancy.title ?? "",
      description:
        vacancy.description ?? "",
      category: vacancy.category ?? "",
      location: vacancy.location ?? "",
      salary: vacancy.salary ?? "",
      status: vacancy.status,
    });
  }, [vacancy]);

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

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Restablecer formulario
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    if (vacancy) {
      setForm({
        title: vacancy.title ?? "",
        description:
          vacancy.description ?? "",
        category: vacancy.category ?? "",
        location: vacancy.location ?? "",
        salary: vacancy.salary ?? "",
        status: vacancy.status,
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
      const category =
        form.category.trim();
      const location =
        form.location.trim();
      const salary = form.salary.trim();

      if (!title) {
        await showWarning(
          "Ingresa el título de la vacante.",
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
          "Ingresa la descripción de la vacante.",
        );

        return false;
      }

      if (description.length > 10000) {
        await showWarning(
          "La descripción no puede superar los 10000 caracteres.",
        );

        return false;
      }

      if (!category) {
        await showWarning(
          "Ingresa la categoría de la vacante.",
        );

        return false;
      }

      if (category.length > 100) {
        await showWarning(
          "La categoría no puede superar los 100 caracteres.",
        );

        return false;
      }

      if (!location) {
        await showWarning(
          "Ingresa la ubicación o modalidad de la vacante.",
        );

        return false;
      }

      if (location.length > 150) {
        await showWarning(
          "La ubicación no puede superar los 150 caracteres.",
        );

        return false;
      }

      if (salary) {
        const numericSalary =
          Number(salary);

        if (
          Number.isNaN(numericSalary) ||
          !Number.isFinite(numericSalary)
        ) {
          await showWarning(
            "El salario debe ser un número válido.",
          );

          return false;
        }

        if (numericSalary < 0) {
          await showWarning(
            "El salario no puede ser negativo.",
          );

          return false;
        }

        if (
          numericSalary >
          9999999999.99
        ) {
          await showWarning(
            "El salario supera el valor máximo permitido.",
          );

          return false;
        }
      }

      const validStatuses: VacancyStatus[] =
        [
          "open",
          "paused",
          "closed",
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

      if (
        !vacancy &&
        form.status === "closed"
      ) {
        await showWarning(
          "Una vacante nueva solamente puede publicarse abierta o pausada.",
        );

        return false;
      }

      if (
        vacancy?.status === "closed"
      ) {
        await showWarning(
          "Una vacante cerrada ya no puede modificarse.",
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

    const title = form.title.trim();
    const description =
      form.description.trim();
    const category =
      form.category.trim();
    const location =
      form.location.trim();

    const salary =
      form.salary.trim()
        ? Number(form.salary)
        : null;

    try {
      setIsSaving(true);

      /*
      |--------------------------------------------------------------------------
      | Actualizar
      |--------------------------------------------------------------------------
      */

      if (vacancy) {
        const payload: UpdateVacancyPayload =
          {};

        if (title !== vacancy.title) {
          payload.title = title;
        }

        if (
          description !==
          vacancy.description
        ) {
          payload.description =
            description;
        }

        if (
          category !== vacancy.category
        ) {
          payload.category = category;
        }

        if (
          location !== vacancy.location
        ) {
          payload.location = location;
        }

        const currentSalary =
          normalizeSalary(
            vacancy.salary,
          );

        if (salary !== currentSalary) {
          payload.salary = salary;
        }

        if (
          form.status !== vacancy.status
        ) {
          payload.status = form.status;
        }

        if (
          Object.keys(payload).length === 0
        ) {
          await showWarning(
            "No realizaste cambios en la vacante.",
          );

          return;
        }

        if (
          payload.status === "closed"
        ) {
          const confirmed =
            window.confirm(
              `¿Deseas cerrar la vacante "${vacancy.title}"? Después de cerrarla ya no podrá editarse ni reabrirse.`,
            );

          if (!confirmed) {
            return;
          }
        }

        const response =
          await updateVacancy(
            vacancy.id,
            payload,
          );

        onUpdated(
          response.data.vacancy,
        );

        await showSuccess(
          response.message ||
            "Vacante actualizada correctamente.",
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Crear
      |--------------------------------------------------------------------------
      */

      const createStatus:
        | "open"
        | "paused" =
        form.status === "paused"
          ? "paused"
          : "open";

      const payload: CreateVacancyPayload =
        {
          title,
          description,
          category,
          location,
          salary,
          status: createStatus,
        };

      const response =
        await createVacancy(payload);

      onCreated(
        response.data.vacancy,
      );

      await showSuccess(
        response.message ||
          "Vacante creada correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al guardar la vacante:",
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