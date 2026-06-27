import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/AuthApi";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(email, password);

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Credenciales incorrectas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-surface rounded-2xl shadow-card border border-border p-8">

        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="WorkLink"
            className="h-16 mb-4"
          />

          <h1 className="text-3xl font-bold text-text">
            Bienvenido
          </h1>

          <p className="text-text-muted mt-2">
            Inicia sesión para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                px-4 py-3
                border border-border
                rounded-lg
                text-text
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-text">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                px-4 py-3
                border border-border
                rounded-lg
                text-text
                placeholder:text-text-muted
                focus:outline-none
                focus:ring-2
                focus:ring-primary
              "
              placeholder="********"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3
              bg-primary
              hover:opacity-90
              text-white
              font-semibold
              rounded-lg
              transition
              disabled:opacity-60
            "
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>

      </div>

    </div>
  );
}