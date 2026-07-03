import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

import ProfileImagePicker from "../components/ProfileImagePicker";
import { useRegisterForm } from "../hooks/useRegisterForm";

const accountOptions = [
  {
    type: "Cliente",
    title: "Cliente",
    description: "Contrata talento para tus proyectos.",
    icon: UserGroupIcon,
  },
  {
    type: "Freelancer",
    title: "Freelancer",
    description: "Ofrece servicios y crea tu portafolio.",
    icon: BriefcaseIcon,
  },
  {
    type: "Empresa",
    title: "Empresa",
    description: "Publica vacantes y oportunidades.",
    icon: BuildingOffice2Icon,
  },
] as const;

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
    setProfilePhotoFile,
    isLoading,
  } = useRegisterForm();

  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 lg:grid-cols-[0.72fr_1.28fr] xl:gap-8">
          {/* Panel izquierdo desktop */}
          <aside className="relative hidden h-fit overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-2xl lg:sticky lg:top-28 lg:block xl:p-10">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center rounded-full bg-white/15 px-5 py-2 text-sm font-semibold backdrop-blur">
                WorkLink
              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                Crea tu cuenta y empieza a conectar.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/80 xl:text-base">
                Una plataforma para clientes, freelancers y empresas que buscan
                trabajar de forma más simple, segura y profesional.
              </p>
            </div>

            <div className="relative z-10 mt-10 rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold">
                  WL
                </div>

                <div>
                  <p className="font-semibold">Tu perfil WorkLink</p>
                  <p className="text-sm text-white/70">
                    Listo para conectar con oportunidades.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Perfil profesional</span>
                  <span className="text-white/75">80%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-4/5 rounded-full bg-white" />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">3</p>
                  <p className="mt-1 text-xs text-white/70">
                    Tipos de cuenta
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="mt-1 text-xs text-white/70">
                    Acceso disponible
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <CheckCircleIcon className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">Registro rápido</p>
                    <p className="text-xs text-white/70">
                      Completa tus datos y comienza en minutos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 text-center text-xs text-white/80">
              <div className="rounded-2xl bg-white/10 p-3">Clientes</div>
              <div className="rounded-2xl bg-white/10 p-3">Freelancers</div>
              <div className="rounded-2xl bg-white/10 p-3">Empresas</div>
            </div>
          </aside>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="min-w-0 rounded-[2rem] border border-border bg-surface p-4 shadow-2xl sm:p-6 md:p-8 xl:p-10"
          >
            {/* Header móvil */}
            <div className="mb-6 rounded-3xl bg-primary p-6 text-white lg:hidden">
              <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                WorkLink
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Crea tu cuenta y empieza a conectar.
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/80">
                Regístrate como cliente, freelancer o empresa.
              </p>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <SparklesIcon className="h-4 w-4" />
                Registro de usuario
              </div>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Crear cuenta
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                Completa tus datos para comenzar en WorkLink.
              </p>
            </div>

            {/* Foto */}
            <div className="mb-6 rounded-3xl border border-border bg-background/70 p-4 shadow-sm sm:mb-8 sm:p-5">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                <div className="shrink-0">
                  <ProfileImagePicker
                    image={profileImage}
                    setImage={setProfileImage}
                    setProfilePhotoFile={setProfilePhotoFile}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-base font-semibold">Foto de perfil</p>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">
                    Agrega una imagen para personalizar tu cuenta. Este campo es
                    opcional y después lo conectamos con el almacenamiento del
                    backend.
                  </p>

                  <p className="mt-2 text-xs text-text-muted">
                    Recomendado: JPG, PNG o WEBP.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Información personal */}
              <section className="rounded-3xl border border-border bg-background/40 p-4 sm:p-5">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                    1
                  </span>

                  <div>
                    <h3 className="font-semibold">Información personal</h3>
                    <p className="text-sm text-text-muted">
                      Datos básicos de tu cuenta.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Nombre(s)
                    </label>
                    <input
                      name="nombres"
                      value={form.nombres}
                      placeholder="Ej. Adrian"
                      className="input border rounded-2xl"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Apellido paterno
                    </label>
                    <input
                      name="apellidoPaterno"
                      value={form.apellidoPaterno}
                      placeholder="Ej. Vite"
                      className="input border rounded-2xl"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Apellido materno
                    </label>
                    <input
                      name="apellidoMaterno"
                      value={form.apellidoMaterno}
                      placeholder="Ej. Espinosa"
                      className="input border rounded-2xl"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Teléfono
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      placeholder="Ej. 7712345678"
                      className="input border rounded-2xl"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="min-w-0 md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Correo electrónico
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      placeholder="correo@ejemplo.com"
                      className="input border rounded-2xl"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              {/* Seguridad */}
              <section className="rounded-3xl border border-border bg-background/40 p-4 sm:p-5">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                    2
                  </span>

                  <div>
                    <h3 className="font-semibold">Seguridad</h3>
                    <p className="text-sm text-text-muted">
                      Crea una contraseña segura para tu cuenta.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Contraseña
                    </label>

                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        placeholder="Mínimo 8 caracteres"
                        className="input border rounded-2xl pr-12"
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-primary"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-sm font-medium">
                      Confirmar contraseña
                    </label>

                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        placeholder="Repite tu contraseña"
                        className="input border rounded-2xl pr-12"
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-primary"
                        aria-label={
                          showConfirm
                            ? "Ocultar confirmación"
                            : "Mostrar confirmación"
                        }
                      >
                        {showConfirm ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tipo de cuenta */}
              <section className="rounded-3xl border border-border bg-background/40 p-4 sm:p-5">
                <div className="mb-5 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                    3
                  </span>

                  <div>
                    <h3 className="font-semibold">Tipo de cuenta</h3>
                    <p className="text-sm text-text-muted">
                      Selecciona el rol con el que usarás la plataforma.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {accountOptions.map(
                    ({ type, title, description, icon: Icon }) => {
                      const isSelected = form.accountType === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAccountType(type)}
                          className={`group rounded-3xl border p-4 text-left transition sm:p-5 ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                              : "border-border bg-surface hover:border-primary hover:bg-background"
                          }`}
                        >
                          <div
                            className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>

                          <p className="font-semibold">{title}</p>

                          <p
                            className={`mt-2 text-xs leading-5 ${
                              isSelected ? "text-white/80" : "text-text-muted"
                            }`}
                          >
                            {description}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              <label className="flex items-start gap-3 rounded-3xl border border-border bg-background/70 p-4 text-sm">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-1 shrink-0"
                />

                <span className="leading-6 text-text-muted">
                  Acepto los{" "}
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    términos y condiciones
                  </button>{" "}
                  de WorkLink.
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-primary py-4 font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Registrando..." : "Crear cuenta"}
              </button>

              <p className="text-center text-sm text-text-muted">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-primary hover:underline"
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}