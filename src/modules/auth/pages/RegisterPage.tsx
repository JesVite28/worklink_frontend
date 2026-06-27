import { useNavigate } from "react-router-dom";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

import ProfileImagePicker from "../components/ProfileImagePicker";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
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
  } = useRegisterForm();

  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <Navbar />

      <div className="flex-1 flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-surface border border-border rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Crear cuenta</h1>
            <p className="text-sm text-text-muted">Regístrate para comenzar</p>
          </div>

          <div className="flex justify-center mb-6">
            <ProfileImagePicker image={profileImage} setImage={setProfileImage} />
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-muted mb-3">
              Información personal
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="nombres"
                placeholder="Nombre(s)"
                className="input border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                className="input border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                className="input border rounded-lg"
                onChange={handleChange}
              />

              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                className="input border rounded-lg col-span-2"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-muted mb-3">
              Seguridad
            </h2>

            <div className="space-y-3">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input border rounded-lg pr-20"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-sm text-primary"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  className="input border rounded-lg pr-20"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2 text-sm text-primary"
                >
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text-muted mb-3">
              Tipo de cuenta
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {(["Cliente", "Freelancer", "Empresa"] as const).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`
              p-3 rounded-lg border text-sm transition
              ${
                form.accountType === type
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent border-border hover:border-primary"
              }
            `}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm mb-5">
            <input type="checkbox" name="terms" onChange={handleChange} />
            Acepto términos y condiciones
          </label>

          <button
            type="submit"
            className="
    w-full
    py-3
    rounded-lg
    font-semibold
    text-white
    bg-primary
    shadow-md
    hover:opacity-90
    hover:shadow-lg
    transition
    active:scale-[0.99]
  "
          >
            Registrarse
          </button>

          <p className="text-sm text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary"
            >
              Inicia sesión
            </button>
          </p>
        </form>
      </div>

      <Footer />
    </div>
  );
}