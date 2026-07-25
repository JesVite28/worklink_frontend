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
  CreateFreelancerProfilePayload,
  FreelancerProfile,
  ProfileErrorResponse,
  RateType,
  WorkMode,
} from "../models/profile";

import {
  createFreelancerProfile,
  updateFreelancerProfile,
} from "../services/profileService";

interface FreelancerFormState {
  description: string;
  specialty: string;
  location: string;
  service_area: string;
  work_mode: WorkMode;
  experience: string;

  rate_type: RateType;
  rate: string;

  languages: string;

  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
  portfolio_url: string;

  available: boolean;
}

interface Props {
  profile: FreelancerProfile | null;
  onSaved: (profile: FreelancerProfile) => void;
}

const initialState: FreelancerFormState = {
  description: "",
  specialty: "",
  location: "",
  service_area: "",
  work_mode: "remote",
  experience: "",

  rate_type: "hourly",
  rate: "",

  languages: "",

  website: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  github: "",
  portfolio_url: "",

  available: true,
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
      "No fue posible guardar el perfil profesional."
    );
  }

  return "No fue posible guardar el perfil profesional.";
}

function valueOrNull(value: string): string | null {
  const normalizedValue = value.trim();

  return normalizedValue || null;
}

export function useFreelancerProfileForm({
  profile,
  onSaved,
}: Props) {
  const [form, setForm] =
    useState<FreelancerFormState>(initialState);

  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(profile);

  useEffect(() => {
    if (!profile) {
      setForm(initialState);
      return;
    }

    setForm({
      description: profile.description ?? "",
      specialty: profile.specialty ?? "",
      location: profile.location ?? "",
      service_area: profile.service_area ?? "",
      work_mode: profile.work_mode ?? "remote",
      experience: profile.experience ?? "",

      rate_type: profile.rate_type ?? "hourly",
      rate:
        profile.rate_type === "negotiable"
          ? ""
          : profile.rate ?? "",

      languages: (profile.languages ?? []).join(", "),

      website:
        profile.professional_links?.website ?? "",
      facebook:
        profile.professional_links?.facebook ?? "",
      instagram:
        profile.professional_links?.instagram ?? "",
      linkedin:
        profile.professional_links?.linkedin ?? "",
      github:
        profile.professional_links?.github ?? "",
      portfolio_url:
        profile.professional_links?.portfolio_url ?? "",

      available: Boolean(profile.available),
    });
  }, [profile]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((previous) => ({
        ...previous,
        [target.name]: target.checked,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [target.name]: target.value,
    }));
  };

  const handleRateTypeChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const rateType = event.target.value as RateType;

    setForm((previous) => ({
      ...previous,
      rate_type: rateType,
      rate:
        rateType === "negotiable"
          ? ""
          : previous.rate,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !form.description.trim() ||
      !form.specialty.trim() ||
      !form.location.trim() ||
      !form.service_area.trim() ||
      !form.experience.trim()
    ) {
      await showWarning(
        "Completa todos los campos profesionales obligatorios.",
      );

      return;
    }

    let numericRate: number | null = null;

    if (form.rate_type !== "negotiable") {
      numericRate = Number(form.rate);

      if (
        !form.rate.trim() ||
        Number.isNaN(numericRate) ||
        numericRate <= 0
      ) {
        await showWarning(
          "Ingresa una tarifa válida mayor que cero.",
        );

        return;
      }
    }

    const languages = Array.from(
      new Set(
        form.languages
          .split(",")
          .map((language) => language.trim())
          .filter(Boolean),
      ),
    );

    if (languages.length === 0) {
      await showWarning(
        "Agrega al menos un idioma.",
      );

      return;
    }

    const payload: CreateFreelancerProfilePayload = {
      description: form.description.trim(),
      specialty: form.specialty.trim(),
      location: form.location.trim(),
      service_area: form.service_area.trim(),
      work_mode: form.work_mode,
      experience: form.experience.trim(),

      rate_type: form.rate_type,
      rate: numericRate,

      languages,

      website: valueOrNull(form.website),
      facebook: valueOrNull(form.facebook),
      instagram: valueOrNull(form.instagram),
      linkedin: valueOrNull(form.linkedin),
      github: valueOrNull(form.github),
      portfolio_url: valueOrNull(
        form.portfolio_url,
      ),

      available: form.available,
    };

    try {
      setIsSaving(true);

      const response =
        profile
          ? await updateFreelancerProfile(
            profile.id,
            payload,
          )
          : await createFreelancerProfile(payload);

      onSaved(response.data.profile);

      await showSuccess(
        response.message ||
        (profile
          ? "Perfil profesional actualizado correctamente."
          : "Perfil profesional creado correctamente."),
      );
    } catch (error) {
      console.error(
        "Error al guardar el perfil freelancer:",
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
    handleRateTypeChange,
    handleSubmit,

    isEditing,
    isSaving,
  };
}