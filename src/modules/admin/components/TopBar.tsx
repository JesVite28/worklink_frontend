import {
  ArrowDownTrayIcon,
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import ThemeToggle from "../../../shared/components/ui/ThemeToggle";

type Props = {
  onToggleMenu: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

export default function TopBar({
  onToggleMenu,
  onLogout,
  isLoggingOut = false,
}: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex flex-1 min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text lg:hidden"
            aria-label="Abrir menú"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="hidden flex-1 max-w-md items-center gap-3 rounded-2xl border border-border bg-background px-4 py-2 sm:flex">
            <MagnifyingGlassIcon className="h-4 w-4 text-text-muted" />

            <input
              type="text"
              placeholder="Buscar en el panel..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text"
            aria-label="Notificaciones"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          <ThemeToggle />

          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:opacity-90 sm:inline-flex"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Exportar
          </button>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </header>
  );
}