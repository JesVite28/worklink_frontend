import { Link } from "react-router-dom";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginPage() {
  const {
    form,
    handleChange,
    handleSubmit,
    selectedRole,
    setSelectedRole,
    isLoading,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Iniciar Sesión
          </h1>

          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {["cliente", "freelancer", "empresa"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedRole(item)}
                className={`flex-1 py-2 text-sm rounded-lg transition ${
                  selectedRole === item
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-background"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-lg hover:bg-muted transition"
            >
              <span>🔒</span>
              Usar autenticación biométrica
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}