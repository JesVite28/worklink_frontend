export default function DashboardPage() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="WorkLink"
              className="h-10 w-auto"
            />

            <h1 className="text-xl font-bold">
              WorkLink
            </h1>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>

        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto p-8">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

          <h2 className="text-3xl font-bold text-slate-900">
            Bienvenido {user.nombre}
          </h2>

          <p className="text-slate-500 mt-2">
            Has iniciado sesión correctamente.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
              <h3 className="font-semibold mb-2">
                Correo
              </h3>

              <p className="text-slate-600">
                {user.email}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold mb-2">
                Tipo de cuenta
              </h3>

              <p className="text-slate-600">
                {user.tipo_cuenta}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-semibold mb-2">
                Roles
              </h3>

              <p className="text-slate-600">
                {user.roles
                  ?.map((rol: any) => rol.nombre)
                  .join(", ")}
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}