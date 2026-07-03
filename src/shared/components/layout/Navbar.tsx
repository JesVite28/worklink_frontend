import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Container from "./Container";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <Container>
        <div className="h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo("/")}
            className="flex items-center gap-3 min-w-0"
          >
            <img
              src="/logo.png"
              alt="WorkLink"
              className="h-20 w-auto shrink-0"
            />

          </button>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-text-muted">
            <button
              type="button"
              onClick={() => goTo("/freelancers")}
              className="hover:text-primary transition"
            >
              Explorar Servicios
            </button>

            <button
              type="button"
              onClick={() => goTo("/publicar-empleo")}
              className="hover:text-primary transition"
            >
              Publicar Empleo
            </button>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => goTo("/login")}
              className="
                px-5 py-2
                rounded-lg
                border border-border
                text-text
                hover:border-primary
                hover:text-primary
                transition
              "
            >
              Iniciar sesión
            </button>

            <button
              type="button"
              onClick={() => goTo("/register")}
              className="
                px-5 py-2
                rounded-lg
                bg-primary
                text-white
                hover:opacity-90
                transition
              "
            >
              Registrarse
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="
                p-2
                rounded-lg
                border border-border
                text-text
                hover:border-primary
                hover:text-primary
                transition
              "
              aria-label="Abrir menú"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-5 border-t border-border pt-4">
            <div className="grid gap-3 text-text-muted">
              <button
                type="button"
                onClick={() => goTo("/freelancers")}
                className="
                  text-left
                  px-3 py-2
                  rounded-lg
                  hover:bg-primary/10
                  hover:text-primary
                  transition
                "
              >
                Explorar Servicios
              </button>

              <button
                type="button"
                onClick={() => goTo("/publicar-empleo")}
                className="
                  text-left
                  px-3 py-2
                  rounded-lg
                  hover:bg-primary/10
                  hover:text-primary
                  transition
                "
              >
                Publicar Empleo
              </button>

              <div className="grid gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => goTo("/login")}
                  className="
                    w-full
                    px-5 py-3
                    rounded-lg
                    border border-border
                    text-text
                    hover:border-primary
                    hover:text-primary
                    transition
                  "
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={() => goTo("/register")}
                  className="
                    w-full
                    px-5 py-3
                    rounded-lg
                    bg-primary
                    text-white
                    hover:opacity-90
                    transition
                  "
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}