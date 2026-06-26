import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../shared/components/layout/Navbar";
import Footer from "../home/components/Footer";

export default function Login() {
  const [role, setRole] = useState("cliente");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">

        {/* CARD */}
        <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 sm:p-8">

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-center mb-6">
            Iniciar Sesión
          </h1>

          {/* ROLE SELECTOR */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {["cliente", "freelancer", "empresa"].map((item) => (
              <button
                key={item}
                onClick={() => setRole(item)}
                className={`flex-1 py-2 text-sm rounded-lg transition ${
                  role === item
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-background"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* LINKS */}
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Iniciar sesión
            </button>

            {/* BIOMETRIC */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-border py-2 rounded-lg hover:bg-muted transition"
            >
              <span>🔒</span>
              Usar autenticación biométrica
            </button>

          </form>

          {/* REGISTER */}
          <p className="text-center text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}