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
  CompanyProfile,
  CreateCompanyProfilePayload,
  ProfileErrorResponse,
} from "../models/profile";

import {
  createCompanyProfile,
  updateCompanyProfile,
} from "../services/profileService";

interface CompanyFormState {
  company_name: string;
  description: string;
  industry: string;
  location: string;
}

interface Props {
  profile: CompanyProfile | null;
  onSaved: (profile: CompanyProfile) => void;
}

const initialState: CompanyFormState = {
  company_name: "",
  description: "",
  industry: "",
  location: "",
};

function getErrorMessage(error: unknown): string {
  if (isAxiosError<ProfileErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];

      if (firstError) {
        return firstError;
      }
    }

    return (
      data?.message ||
      "No fue posible guardar el perfil empresarial."
    );
  }

  return "No fue posible guardar el perfil empresarial.";
}

function valueOrNull(value: string): string | null {
  const normalizedValue = value.trim();

  return normalizedValue || null;
}

export function useCompanyProfileForm({
  profile,
  onSaved,
}: Props) {
  const [form, setForm] =
    useState<CompanyFormState>(initialState);

  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(profile);

  useEffect(() => {
    if (!profile) {
      setForm(initialState);
      return;
    }

    setForm({
      company_name: profile.company_name ?? "",
      description: profile.description ?? "",
      industry: profile.industry ?? "",
      location: profile.location ?? "",
    });
  }, [profile]);

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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const companyName = form.company_name.trim();

    if (!companyName) {
      await showWarning(
        "Ingresa el nombre de la empresa.",
      );

      return;
    }

    if (companyName.length > 150) {
      await showWarning(
        "El nombre de la empresa no puede superar los 150 caracteres.",
      );

      return;
    }

    if (form.industry.trim().length > 100) {
      await showWarning(
        "La industria no puede superar los 100 caracteres.",
      );

      return;
    }

    if (form.location.trim().length > 150) {
      await showWarning(
        "La ubicación no puede superar los 150 caracteres.",
      );

      return;
    }

    if (form.description.trim().length > 5000) {
      await showWarning(
        "La descripción no puede superar los 5000 caracteres.",
      );

      return;
    }

    const payload: CreateCompanyProfilePayload = {
      company_name: companyName,
      description: valueOrNull(form.description),
      industry: valueOrNull(form.industry),
      location: valueOrNull(form.location),
    };

    try {
      setIsSaving(true);

      const response = profile
        ? await updateCompanyProfile(
            profile.id,
            payload,
          )
        : await createCompanyProfile(payload);

      onSaved(response.data.company_profile);

      await showSuccess(
        response.message ||
          (profile
            ? "Perfil empresarial actualizado correctamente."
            : "Perfil empresarial creado correctamente."),
      );
    } catch (error) {
      console.error(
        "Error al guardar el perfil empresarial:",
        error,
      );

      await showError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,

    isEditing,
    isSaving,
  };
}