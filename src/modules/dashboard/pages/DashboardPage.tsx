import { useNavigate } from "react-router-dom";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import type { UserData } from "../../auth/models/authResponse";

type UserRole = NonNullable<UserData["roles"]>[number];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthSession();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="WorkLink" className="h-10 w-auto" />

            <h1 className="text-xl font-bold text-text">WorkLink</h1>
          </div>

          <button
            onClick={handleLogout}
            className="
              px-4 py-2
              rounded-lg
              bg-danger
              text-white
              hover:opacity-90
              transition
            "
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-8">
          <h2 className="text-3xl font-bold text-text">
            Bienvenido {user?.nombre ?? "Usuario"}
          </h2>

          <p className="text-text-muted mt-2">
            Has iniciado sesión correctamente.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-info/10 border border-info/20 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-text">Correo</h3>

              <p className="text-text-muted">{user?.email ?? "-"}</p>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-text">Tipo de cuenta</h3>

              <p className="text-text-muted">{user?.tipo_cuenta ?? "-"}</p>
            </div>

            <div className="bg-success/10 border border-success/20 rounded-xl p-5">
              <h3 className="font-semibold mb-2 text-text">Roles</h3>

              <p className="text-text-muted">
                {user?.rol?.nombre ?? user?.roles?.map((rol: UserRole) => rol.nombre).join(", ") ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}