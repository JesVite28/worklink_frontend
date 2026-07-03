import { ArrowDownTrayIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import ThemeToggle from "../../../shared/components/ui/ThemeToggle";

type Props = {
  onToggleMenu: () => void;
  onLogout: () => void;
};

export default function TopBar({ onToggleMenu, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text lg:hidden"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex flex-1 max-w-md items-center gap-3 rounded-2xl border border-border bg-background px-4 py-2">
            <MagnifyingGlassIcon className="h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar en el panel..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:opacity-90 transition"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Exportar
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:opacity-90 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}