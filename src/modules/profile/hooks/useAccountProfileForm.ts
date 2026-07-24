import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { isAxiosError } from "axios";

import { useAuth } from "../../../context/useAuth";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import type {
  ProfileErrorResponse,
  UpdateAccountPayload,
} from "../models/profile";

import {
  deleteMyProfilePhoto,
  updateMyAccount,
  updateMyProfilePhoto,
} from "../services/profileService";

interface AccountFormState {
  name: string;
  last_name: string;
  maternal_last_name: string;
  email: string;
  phone: string;

  current_password: string;
  password: string;
  password_confirmation: string;
}

const initialState: AccountFormState = {
  name: "",
  last_name: "",
  maternal_last_name: "",
  email: "",
  phone: "",

  current_password: "",
  password: "",
  password_confirmation: "",
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
      "No fue posible actualizar la información."
    );
  }

  return "No fue posible actualizar la información.";
}

export function useAccountProfileForm() {
  const { user, updateUser } = useAuth();

  const [form, setForm] =
    useState<AccountFormState>(initialState);

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] =
    useState<File | null>(null);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] =
    useState(false);

  const [isDeletingPhoto, setIsDeletingPhoto] =
    useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      name: user.name ?? "",
      last_name: user.last_name ?? "",
      maternal_last_name:
        user.maternal_last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",

      current_password: "",
      password: "",
      password_confirmation: "",
    });

    setPhotoPreview(
      user.profile_photo_url ||
        user.profile_photo ||
        null,
    );
  }, [user]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      void showWarning(
        "Selecciona una imagen JPG, PNG o WEBP.",
      );

      event.target.value = "";
      return;
    }

    const maximumSize = 2 * 1024 * 1024;

    if (file.size > maximumSize) {
      void showWarning(
        "La fotografía no puede superar los 2 MB.",
      );

      event.target.value = "";
      return;
    }

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const cancelSelectedPhoto = () => {
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setSelectedPhoto(null);

    setPhotoPreview(
      user?.profile_photo_url ||
        user?.profile_photo ||
        null,
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      await showWarning(
        "Completa nombre, apellido paterno y correo.",
      );

      return;
    }

    const wantsToChangePassword =
      Boolean(form.current_password) ||
      Boolean(form.password) ||
      Boolean(form.password_confirmation);

    if (wantsToChangePassword) {
      if (
        !form.current_password ||
        !form.password ||
        !form.password_confirmation
      ) {
        await showWarning(
          "Completa todos los campos de contraseña.",
        );

        return;
      }

      if (form.password.length < 8) {
        await showWarning(
          "La nueva contraseña debe tener al menos 8 caracteres.",
        );

        return;
      }

      if (
        form.password !==
        form.password_confirmation
      ) {
        await showWarning(
          "La confirmación no coincide con la nueva contraseña.",
        );

        return;
      }
    }

    const payload: UpdateAccountPayload = {
      name: form.name.trim(),
      last_name: form.last_name.trim(),
      maternal_last_name:
        form.maternal_last_name.trim() || null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
    };

    if (wantsToChangePassword) {
      payload.current_password =
        form.current_password;

      payload.password = form.password;

      payload.password_confirmation =
        form.password_confirmation;
    }

    try {
      setIsSaving(true);

      const response =
        await updateMyAccount(payload);

      updateUser(response.data.user);

      setForm((previous) => ({
        ...previous,
        current_password: "",
        password: "",
        password_confirmation: "",
      }));

      await showSuccess(response.message);
    } catch (error) {
      console.error(
        "Error al actualizar la cuenta:",
        error,
      );

      await showError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedPhoto) {
      await showWarning(
        "Selecciona una fotografía antes de guardar.",
      );

      return;
    }

    try {
      setIsUpdatingPhoto(true);

      const response =
        await updateMyProfilePhoto(selectedPhoto);

      updateUser(response.data.user);

      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }

      setSelectedPhoto(null);

      setPhotoPreview(
        response.data.user.profile_photo_url ||
          response.data.user.profile_photo ||
          null,
      );

      await showSuccess(response.message);
    } catch (error) {
      console.error(
        "Error al actualizar la fotografía:",
        error,
      );

      await showError(getErrorMessage(error));
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!user?.profile_photo) {
      return;
    }

    try {
      setIsDeletingPhoto(true);

      const response =
        await deleteMyProfilePhoto();

      updateUser(response.data.user);

      setSelectedPhoto(null);
      setPhotoPreview(null);

      await showSuccess(response.message);
    } catch (error) {
      console.error(
        "Error al eliminar la fotografía:",
        error,
      );

      await showError(getErrorMessage(error));
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,

    photoPreview,
    selectedPhoto,
    handlePhotoChange,
    handleUploadPhoto,
    handleDeletePhoto,
    cancelSelectedPhoto,

    showCurrentPassword,
    setShowCurrentPassword,

    showPassword,
    setShowPassword,

    showPasswordConfirmation,
    setShowPasswordConfirmation,

    hasStoredPhoto: Boolean(user?.profile_photo),

    isSaving,
    isUpdatingPhoto,
    isDeletingPhoto,
  };
}