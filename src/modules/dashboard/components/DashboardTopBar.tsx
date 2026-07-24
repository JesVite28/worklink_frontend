import { Link } from "react-router-dom";

import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import ThemeToggle from "../../../shared/components/ui/ThemeToggle";
import { useAuth } from "../../../context/useAuth";

interface Props {
  onToggleMenu: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const roleLabels = {
  admin: "Administrador",
  cliente: "Cliente",
  freelancer: "Freelancer",
  empresa: "Empresa",
} as const;

export default function DashboardTopBar({
  onToggleMenu,
  onLogout,
  isLoggingOut = false,
}: Props) {
  const { user, primaryRole } = useAuth();

  const fullName =
    [
      user?.name,
      user?.last_name,
      user?.maternal_last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Usuario";

  const roleLabel = primaryRole
    ? roleLabels[primaryRole]
    : "Sin rol";

  const profilePhoto =
    user?.profile_photo_url ||
    user?.profile_photo ||
    null;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:bg-primary/10 lg:hidden"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-sm text-text-muted">
              Panel de {roleLabel}
            </p>

            <h1 className="truncate text-base font-semibold text-text sm:text-lg">
              Bienvenido, {fullName}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard/notificaciones"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:bg-primary/10"
            aria-label="Notificaciones"
          >
            <BellIcon className="h-5 w-5" />
          </Link>

          <ThemeToggle />

          <Link
            to="/dashboard/perfil"
            className="hidden items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 transition hover:bg-primary/10 md:flex"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={`Perfil de ${fullName}`}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-9 w-9 text-text-muted" />
            )}

            <div className="max-w-40 text-left">
              <p className="truncate text-sm font-medium text-text">
                {fullName}
              </p>

              <p className="truncate text-xs text-text-muted">
                {roleLabel}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />

            <span className="hidden sm:inline">
              {isLoggingOut
                ? "Cerrando..."
                : "Cerrar sesión"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}