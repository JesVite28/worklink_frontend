import { useNavigate } from "react-router-dom";
import Container from "./Container";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <Container>
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.png" alt="WorkLink" className="h-10 w-auto" />

            <span className="font-bold text-xl text-text">
              WorkLink
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-text-muted">

            <button
              onClick={() => navigate("/freelancers")}
              className="hover:text-primary transition"
            >
              Explorar Servicios
            </button>

            <a
              href="#"
              className="hover:text-primary transition"
            >
              Publicar Empleo
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <ThemeToggle />

            <button
              onClick={() => navigate("/login")}
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

        </div>
      </Container>
    </header>
  );
}