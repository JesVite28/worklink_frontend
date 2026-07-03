import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { showError, showSuccess } from "../../../shared/services/alertService";
import { login } from "../services/authService";

type LoginFormState = {
  email: string;
  password: string;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
};

function getRedirectPath(roleName: string | null) {
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

    setIsLoading(true);

    try {
      const response = await login(form.email, form.password);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      const roleName = response.data.rol?.nombre ?? null;

      await showSuccess(response.message || "Login exitoso");
      navigate(getRedirectPath(roleName), { replace: true });
    } catch (error) {
      console.error(error);
      await showError("No fue posible iniciar sesión. Verifica tus credenciales.");
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