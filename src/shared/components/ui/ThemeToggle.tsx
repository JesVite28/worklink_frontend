import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../../context/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        border border-border
        bg-surface
        text-text
        hover:border-primary
        transition
      "
      title="Cambiar tema"
    >
      {theme === "light" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}