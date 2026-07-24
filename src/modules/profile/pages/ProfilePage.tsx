import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import AccountProfileForm from "../components/AccountProfileForm";
import FreelancerProfileForm from "../components/FreelancerProfileForm";
import CompanyProfileForm from "../components/CompanyProfileForm";

import { useProfilePage } from "../hooks/useProfilePage";

const roleLabels = {
  cliente: "Cliente",
  freelancer: "Freelancer",
  empresa: "Empresa",
  admin: "Administrador",
} as const;

export default function ProfilePage() {
  const {
    primaryRole,
    fullName,

    isClient,
    isFreelancer,
    isCompany,

    freelancerProfile,
    setFreelancerProfile,

    companyProfile,
    setCompanyProfile,

    hasRoleProfile,

    isLoadingProfile,
    profileError,
    reloadProfile,
  } = useProfilePage();

  const roleLabel = primaryRole
    ? roleLabels[primaryRole]
    : "Usuario";

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              Administración de cuenta
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Perfil de {fullName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Actualiza tu información personal y administra los datos
              correspondientes a tu tipo de cuenta.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            {isCompany ? (
              <BuildingOffice2Icon className="h-7 w-7" />
            ) : isFreelancer ? (
              <IdentificationIcon className="h-7 w-7" />
            ) : (
              <UserCircleIcon className="h-7 w-7" />
            )}

            <div>
              <p className="text-xs text-white/70">
                Tipo de cuenta
              </p>

              <p className="font-semibold">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estado del perfil profesional o empresarial */}
      {!isClient && (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
          {isLoadingProfile ? (
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

              <div>
                <h2 className="font-semibold text-text">
                  Cargando perfil
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Estamos consultando la información de tu cuenta.
                </p>
              </div>
            </div>
          ) : profileError ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 shrink-0 text-danger" />

                <div>
                  <h2 className="font-semibold text-text">
                    No se pudo cargar el perfil
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    {profileError}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={reloadProfile}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              {hasRoleProfile ? (
                <CheckCircleIcon className="h-7 w-7 shrink-0 text-success" />
              ) : (
                <ExclamationTriangleIcon className="h-7 w-7 shrink-0 text-warning" />
              )}

              <div>
                <h2 className="font-semibold text-text">
                  {isFreelancer
                    ? "Perfil profesional"
                    : "Perfil empresarial"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-text-muted">
                  {hasRoleProfile
                    ? `Tu ${
                        isFreelancer
                          ? "perfil profesional"
                          : "perfil empresarial"
                      } ya está registrado. Puedes actualizarlo desde esta página.`
                    : `Todavía no has creado tu ${
                        isFreelancer
                          ? "perfil profesional"
                          : "perfil empresarial"
                      }. Completa la información para comenzar a utilizar todas las funciones de WorkLink.`}
                </p>

                {isFreelancer && freelancerProfile && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    Especialidad:{" "}
                    {freelancerProfile.specialty ||
                      "No especificada"}
                  </p>
                )}

                {isCompany && companyProfile && (
                  <p className="mt-2 text-sm font-medium text-primary">
                    Empresa:{" "}
                    {companyProfile.company_name ||
                      "No especificada"}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Información general */}
      <AccountProfileForm />

      {/* Perfil profesional del freelancer */}
      {!isLoadingProfile &&
        !profileError &&
        isFreelancer && (
          <FreelancerProfileForm
            profile={freelancerProfile}
            onSaved={setFreelancerProfile}
          />
        )}

      {/* Perfil empresarial */}
      {!isLoadingProfile &&
        !profileError &&
        isCompany && (
          <CompanyProfileForm
            profile={companyProfile}
            onSaved={setCompanyProfile}
          />
        )}
    </div>
  );
}