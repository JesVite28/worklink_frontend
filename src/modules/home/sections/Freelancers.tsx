import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { freelancers as data } from "../data/Freelancers";

export default function Freelancers() {
  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  // 🎯 FILTER
  const [filter, setFilter] = useState("Todos");

  // 📌 FILTRADO REAL
  const filteredFreelancers = data.filter((f) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      f.name.toLowerCase().includes(searchText) ||
      f.profession.toLowerCase().includes(searchText);

    const matchFilter =
      filter === "Todos"
        ? true
        : f.profession.toLowerCase().includes(filter.toLowerCase());

    return matchSearch && matchFilter;
  });

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-8">
          <span className="text-primary font-semibold">
            Talento destacado
          </span>

          <h2 className="text-4xl font-bold mt-2 text-text">
            Freelancers recomendados
          </h2>

          <p className="text-text-muted mt-3">
            Profesionales verificados con excelentes valoraciones.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Buscar freelancers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-border rounded-lg bg-surface text-text"
          />
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["Todos", "Frontend", "Backend", "UI/UX"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-1 rounded-full border transition ${
                filter === item
                  ? "bg-primary text-white"
                  : "bg-surface text-text border-border"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="
                bg-surface
                rounded-2xl
                overflow-hidden
                border
                border-border
                hover:shadow-card
                transition-all
              "
            >
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h3 className="font-semibold text-lg text-text">
                  {freelancer.name}
                </h3>

                <p className="text-text-muted text-sm mt-1">
                  {freelancer.profession}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <StarIcon className="h-5 w-5 text-warning" />
                  <span className="font-medium text-text">
                    {freelancer.rating}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">

                  <span className="font-bold text-primary">
                    {freelancer.price}
                  </span>

                  <button className="bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg">
                    Ver perfil
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* EMPTY STATE */}
        {filteredFreelancers.length === 0 && (
          <div className="text-center py-10 text-text-muted">
            No se encontraron freelancers 😢
          </div>
        )}

      </div>
    </section>
  );
}