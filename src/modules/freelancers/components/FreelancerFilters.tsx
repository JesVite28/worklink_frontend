interface Props {
  filter: string;
  setFilter: (value: string) => void;
}

export default function FreelancerFilters({ filter, setFilter }: Props) {
  return (
    <aside className="w-full bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg font-semibold text-text">Filtros</span>
      </div>

      {/* CATEGORY */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text mb-2">Categoría</p>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-border rounded-lg p-2 bg-surface text-text text-sm sm:text-base"
        >
          <option value="Todos">Todas las categorías</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="UI/UX">UI/UX</option>
        </select>
      </div>

      {/* PRICE RANGE (UI solamente por ahora) */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text mb-2">
          Rango de Precio: $0 - $200
        </p>

        <input
          type="range"
          className="w-full accent-primary"
        />
      </div>

      {/* DELIVERY */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text mb-2">
          Tiempo de Entrega
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-sm text-text">
          {["24 horas", "3 días", "7 días", "Más de 7 días"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* RATING */}
      <div className="mb-6">
        <p className="text-sm font-medium text-text mb-2">
          Calificación
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-sm text-text">
          {["5+ estrellas", "4+ estrellas", "3+ estrellas"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              ⭐ {item}
            </label>
          ))}
        </div>
      </div>

      {/* RESET BUTTON */}
      <button
        onClick={() => setFilter("Todos")}
        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Limpiar filtros
      </button>

    </aside>
  );
}