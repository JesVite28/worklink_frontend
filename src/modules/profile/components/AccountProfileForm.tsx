import {
  CameraIcon,
  CheckIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
  LockClosedIcon,
  PhoneIcon,
  TrashIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAccountProfileForm } from "../hooks/useAccountProfileForm";

export default function AccountProfileForm() {
  const {
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

    hasStoredPhoto,

    isSaving,
    isUpdatingPhoto,
    isDeletingPhoto,
  } = useAccountProfileForm();

  const isPhotoActionLoading =
    isUpdatingPhoto || isDeletingPhoto;

  return (
    <div className="space-y-6">
      {/* Fotografía de perfil */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text">
            Fotografía de perfil
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            Esta imagen se mostrará en tu cuenta y en el menú de usuario.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary/10 bg-background text-text-muted shadow-sm">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Vista previa de la fotografía de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-24 w-24" />
              )}
            </div>

            <label
              htmlFor="profile-photo"
              className="absolute bottom-1 right-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:opacity-90"
              aria-label="Seleccionar fotografía"
            >
              <CameraIcon className="h-5 w-5" />
            </label>

            <input
              id="profile-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={isPhotoActionLoading}
              className="sr-only"
            />
          </div>

          <div className="w-full flex-1">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-text">
                Formatos permitidos
              </p>

              <p className="mt-1 text-sm leading-6 text-text-muted">
                Puedes seleccionar una imagen JPG, PNG o WEBP con un
                tamaño máximo de 2 MB.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <label
                htmlFor="profile-photo"
                className={[
                  "inline-flex cursor-pointer items-center justify-center gap-2",
                  "rounded-xl border border-border bg-background",
                  "px-4 py-2.5 text-sm font-medium text-text",
                  "transition hover:border-primary hover:text-primary",
                  isPhotoActionLoading
                    ? "pointer-events-none opacity-60"
                    : "",
                ].join(" ")}
              >
                <CameraIcon className="h-5 w-5" />

                {photoPreview
                  ? "Cambiar fotografía"
                  : "Seleccionar fotografía"}
              </label>

              {selectedPhoto && (
                <>
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={isPhotoActionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckIcon className="h-5 w-5" />

                    {isUpdatingPhoto
                      ? "Guardando..."
                      : "Guardar fotografía"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelSelectedPhoto}
                    disabled={isPhotoActionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-text transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Cancelar
                  </button>
                </>
              )}

              {hasStoredPhoto && !selectedPhoto && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  disabled={isPhotoActionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger transition hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <TrashIcon className="h-5 w-5" />

                  {isDeletingPhoto
                    ? "Eliminando..."
                    : "Eliminar fotografía"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Información personal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <IdentificationIcon className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">
                Información personal
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Actualiza los datos generales asociados con tu cuenta.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-text"
              >
                Nombre
              </label>

              <div className="relative">
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="mb-2 block text-sm font-medium text-text"
              >
                Apellido paterno
              </label>

              <div className="relative">
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu apellido paterno"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maternal_last_name"
                className="mb-2 block text-sm font-medium text-text"
              >
                Apellido materno
              </label>

              <div className="relative">
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="maternal_last_name"
                  name="maternal_last_name"
                  type="text"
                  value={form.maternal_last_name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Tu apellido materno"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-text"
              >
                Teléfono
              </label>

              <div className="relative">
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-text"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Seguridad */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockClosedIcon className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text">
                Seguridad
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Completa estos campos únicamente cuando quieras cambiar
                tu contraseña.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <label
                htmlFor="current_password"
                className="mb-2 block text-sm font-medium text-text"
              >
                Contraseña actual
              </label>

              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="current_password"
                  name="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={form.current_password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Contraseña actual"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) => !previous,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-primary"
                  aria-label={
                    showCurrentPassword
                      ? "Ocultar contraseña actual"
                      : "Mostrar contraseña actual"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-text"
              >
                Nueva contraseña
              </label>

              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Mínimo 8 caracteres"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-primary"
                  aria-label={
                    showPassword
                      ? "Ocultar nueva contraseña"
                      : "Mostrar nueva contraseña"
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

            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-medium text-text"
              >
                Confirmar contraseña
              </label>

              <div className="relative">
                <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={
                    showPasswordConfirmation
                      ? "text"
                      : "password"
                  }
                  value={form.password_confirmation}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-11 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Repite la nueva contraseña"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordConfirmation(
                      (previous) => !previous,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-primary"
                  aria-label={
                    showPasswordConfirmation
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <CheckIcon className="h-5 w-5" />

            {isSaving
              ? "Guardando cambios..."
              : "Guardar información"}
          </button>
        </div>
      </form>
    </div>
  );
}