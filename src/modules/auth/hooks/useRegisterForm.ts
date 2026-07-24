import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginModal } from "../../../context/LoginModalContext";
import { isAxiosError } from "axios";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";
import { register, type RegisterPayload } from "../services/authService";

type AccountType = "Cliente" | "Freelancer" | "Empresa";

interface RegisterFormState {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  terms: boolean;
}

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const initialState: RegisterFormState = {
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  accountType: "Cliente",
  terms: false,
};

const roleMap: Record<AccountType, string> = {
  Cliente: "cliente",
  Freelancer: "freelancer",
  Empresa: "empresa",
};

function getRegisterErrorMessage(error: unknown) {
  if (isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];

      if (firstError) return firstError;
    }

    return data?.message || "No fue posible registrar la cuenta.";
  }

  return "No fue posible registrar la cuenta.";
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const { openLoginModal } = useLoginModal();

  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Preview visual de la imagen
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Archivo real que se mandará al backend
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setAccountType = (type: AccountType) => {
    setForm((previous) => ({
      ...previous,
      accountType: type,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.nombres.trim() ||
      !form.apellidoPaterno.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      await showWarning("Completa los campos obligatorios.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      await showWarning("Las contraseñas no coinciden.");
      return;
    }

    if (!form.terms) {
      await showWarning("Debes aceptar términos y condiciones.");
      return;
    }

    const payload: RegisterPayload = {
      name: form.nombres.trim(),
      last_name: form.apellidoPaterno.trim(),
      maternal_last_name: form.apellidoMaterno.trim() || undefined,
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
      password_confirmation: form.confirmPassword,
      role: roleMap[form.accountType],
      profile_photo: profilePhotoFile ?? undefined,
    };

    setIsLoading(true);

    try {
      const response = await register(payload);

      await showSuccess(response.message || "Cuenta registrada correctamente.");
      // Abrir modal de login como respaldo interno
      openLoginModal(null);
    } catch (error) {
      console.error(error);
      await showError(getRegisterErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    setAccountType,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    profileImage,
    setProfileImage,
    profilePhotoFile,
    setProfilePhotoFile,
    isLoading,
  };
}