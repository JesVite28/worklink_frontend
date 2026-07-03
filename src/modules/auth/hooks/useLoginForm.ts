import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { showError, showSuccess } from "../../../shared/services/alertService";
import { login } from "../services/authService";
import type { UserData } from "../models/authResponse";

type LoginFormState = {
  email: string;
  password: string;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
};

function getPrimaryRoleName(user: UserData): string | null {
  return user.role?.name ?? user.roles?.[0]?.name ?? null;
}

function getRedirectPath(user: UserData) {
  const roleName = getPrimaryRoleName(user);

  return roleName?.toLowerCase() === "admin" ? "/admin" : "/dashboard";
}

export function useLoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>(initialState);
  const [selectedRole, setSelectedRole] = useState("cliente");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      await showError("Ingresa tu correo y contraseña.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(form.email, form.password);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await showSuccess(response.message || "Login exitoso");

      navigate(getRedirectPath(user), { replace: true });
    } catch (error) {
      console.error(error);

      let message = "No fue posible iniciar sesión. Verifica tus credenciales.";

      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      await showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    selectedRole,
    setSelectedRole,
    isLoading,
  };
}