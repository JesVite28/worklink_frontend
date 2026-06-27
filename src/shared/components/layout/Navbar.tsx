import { useNavigate } from "react-router-dom";
import Container from "./Container";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <Container>
        <div className="h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="WorkLink"
              className="h-10 w-auto"
            />

            <span className="font-bold text-xl">
              WorkLink
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:text-violet-600">
              Explorar Servicios
            </a>

            <a href="#" className="hover:text-violet-600">
              Publicar Empleo
            </a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg border border-slate-300 hover:border-violet-600 hover:text-violet-600 transition"
            >
              Iniciar sesión
            </button>

            <button className="px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition">
              Registrarse
            </button>
          </div>

        </div>
      </Container>
    </header>
  );
}