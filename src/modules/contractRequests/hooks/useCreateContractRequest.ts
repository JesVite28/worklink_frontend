import axios from "axios";
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useLoginModal } from "../../../context/LoginModalContext";

import { useAuthSession } from "../../auth/hooks/useAuthSession";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import {
  createContractRequest,
} from "../services/contractRequestService";

import type {
  ContractRequest,
  ContractRequestErrorResponse,
  CreateContractRequestPayload,
} from "../models/contractRequest";

interface UseCreateContractRequestOptions {
  serviceId: number;
  defaultBudget?: string | number | null;

  onSuccess?: (
    contractRequest: ContractRequest,
  ) => void;
}

interface FormErrors {
  description?: string;
  budget?: string;
}

const MAX_DESCRIPTION_LENGTH = 10000;
const MAX_BUDGET = 9999999999.99;

function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (
    axios.isAxiosError<ContractRequestErrorResponse>(
      error,
    )
  ) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (responseData?.errors) {
      const firstError =
        Object.values(responseData.errors)
          .flat()
          .find(Boolean);

      if (firstError) {
        return firstError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}

export function useCreateContractRequest({
  serviceId,
  defaultBudget = null,
  onSuccess,
}: UseCreateContractRequestOptions) {
  const navigate = useNavigate();

  const location = useLocation();
  const { openLoginModal } = useLoginModal();

  const {
    token,
    primaryRole,
  } = useAuthSession();

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    budget,
    setBudget,
  ] = useState(
    defaultBudget !== null &&
      defaultBudget !== undefined
      ? String(defaultBudget)
      : "",
  );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const canCreateContractRequest =
    primaryRole === "cliente" ||
    primaryRole === "empresa";

  const descriptionLength =
    description.length;

  const hasContent = useMemo(
    () =>
      description.trim().length > 0 ||
      budget.trim().length > 0,
    [
      budget,
      description,
    ],
  );

  /*
  |--------------------------------------------------------------------------
  | Abrir formulario
  |--------------------------------------------------------------------------
  */

  const openForm = useCallback((): void => {
    if (!token) {
      showWarning(
        "Debes iniciar sesión para solicitar la contratación de un servicio.",
      );

      openLoginModal(location.pathname);

      return;
    }

    if (!canCreateContractRequest) {
      showWarning(
        "Solo las cuentas de cliente o empresa pueden solicitar servicios.",
      );

      return;
    }

    setErrors({});
    setIsOpen(true);
  }, [
    canCreateContractRequest,
    navigate,
    token,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Cerrar formulario
  |--------------------------------------------------------------------------
  */

  const closeForm = useCallback((): void => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
    setErrors({});
  }, [isSubmitting]);

  /*
  |--------------------------------------------------------------------------
  | Restablecer formulario
  |--------------------------------------------------------------------------
  */

  const resetForm = useCallback((): void => {
    setDescription("");

    setBudget(
      defaultBudget !== null &&
        defaultBudget !== undefined
        ? String(defaultBudget)
        : "",
    );

    setErrors({});
  }, [defaultBudget]);

  /*
  |--------------------------------------------------------------------------
  | Cambiar descripción
  |--------------------------------------------------------------------------
  */

  const handleDescriptionChange = (
    value: string,
  ): void => {
    setDescription(value);

    if (errors.description) {
      setErrors(
        (currentErrors) => ({
          ...currentErrors,
          description: undefined,
        }),
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Cambiar presupuesto
  |--------------------------------------------------------------------------
  */

  const handleBudgetChange = (
    value: string,
  ): void => {
    if (
      value !== "" &&
      !/^\d*(\.\d{0,2})?$/.test(value)
    ) {
      return;
    }

    setBudget(value);

    if (errors.budget) {
      setErrors(
        (currentErrors) => ({
          ...currentErrors,
          budget: undefined,
        }),
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Validar formulario
  |--------------------------------------------------------------------------
  */

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    const normalizedDescription =
      description.trim();

    if (!normalizedDescription) {
      nextErrors.description =
        "Describe el trabajo que deseas solicitar.";
    } else if (
      normalizedDescription.length >
      MAX_DESCRIPTION_LENGTH
    ) {
      nextErrors.description =
        `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (budget.trim() !== "") {
      const numericBudget =
        Number(budget);

      if (
        Number.isNaN(numericBudget) ||
        !Number.isFinite(numericBudget)
      ) {
        nextErrors.budget =
          "Ingresa un presupuesto válido.";
      } else if (numericBudget < 0) {
        nextErrors.budget =
          "El presupuesto no puede ser negativo.";
      } else if (
        numericBudget > MAX_BUDGET
      ) {
        nextErrors.budget =
          "El presupuesto supera el máximo permitido.";
      }
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Crear solicitud
  |--------------------------------------------------------------------------
  */

  const submitContractRequest =
    async (): Promise<boolean> => {
      if (!token) {
        showWarning(
          "Debes iniciar sesión para solicitar este servicio.",
        );

        openLoginModal(location.pathname);

        return false;
      }

      if (!canCreateContractRequest) {
        showWarning(
          "Tu tipo de cuenta no puede crear solicitudes de contratación.",
        );

        return false;
      }

      if (
        !Number.isInteger(serviceId) ||
        serviceId <= 0
      ) {
        showError(
          "El servicio seleccionado no es válido.",
        );

        return false;
      }

      if (!validateForm()) {
        return false;
      }

      const payload: CreateContractRequestPayload =
        {
          service_id: serviceId,

          description:
            description.trim(),

          budget:
            budget.trim() === ""
              ? null
              : Number(budget),
        };

      try {
        setIsSubmitting(true);

        const response =
          await createContractRequest(
            payload,
          );

        const createdContractRequest =
          response.data.contract_request;

        showSuccess(
          response.message ||
            "Solicitud de contratación enviada correctamente.",
        );

        onSuccess?.(
          createdContractRequest,
        );

        resetForm();
        setIsOpen(false);

        navigate(
          "/dashboard/solicitudes",
        );

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo enviar la solicitud de contratación.",
          ),
        );

        return false;
      } finally {
        setIsSubmitting(false);
      }
    };

  return {
    description,
    budget,
    errors,

    descriptionLength,
    maxDescriptionLength:
      MAX_DESCRIPTION_LENGTH,

    hasContent,
    isOpen,
    isSubmitting,

    canCreateContractRequest,

    openForm,
    closeForm,
    resetForm,

    handleDescriptionChange,
    handleBudgetChange,

    submitContractRequest,
  };
}