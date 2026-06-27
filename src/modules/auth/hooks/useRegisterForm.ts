import { useState, type ChangeEvent, type FormEvent } from "react";

import { showWarning } from "../../../shared/services/alertService";

type AccountType = "Cliente" | "Freelancer" | "Empresa";

interface RegisterFormState {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  terms: boolean;
}

const initialState: RegisterFormState = {
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "Cliente",
  terms: false,
};

export function useRegisterForm() {
  const [form, setForm] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      showWarning("Contraseñas no coinciden");
      return;
    }

    if (!form.terms) {
      showWarning("Debes aceptar términos");
      return;
    }

    console.log({
      ...form,
      profileImage,
    });
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
  };
}