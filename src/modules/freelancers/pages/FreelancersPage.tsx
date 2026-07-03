import { useState } from "react";
import { freelancers as data } from "../data/Freelancers";

import FreelancerFilters from "../components/FreelancerFilters";
import FreelancerCard from "../components/FreelancerCard";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

export default function FreelancersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const filtered = data.filter((f) => {
    const s = search.toLowerCase();

    const matchSearch =
      f.name.toLowerCase().includes(s) ||
      f.profession.toLowerCase().includes(s);

    const matchFilter =
      filter === "Todos"
        ? true
        : f.profession.toLowerCase().includes(filter.toLowerCase());

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Marketplace de Freelancers
          </h1>

          <p className="text-base sm:text-lg opacity-90 mb-8">
            Encuentra el talento perfecto para tu proyecto.
          </p>

          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 sm:gap-0 shadow-xl">

            <input
              className="w-full min-w-0 flex-1 px-4 sm:px-6 py-4 rounded-2xl outline-none text-gray-700"
              placeholder="¿Qué freelancer estás buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="w-full sm:w-auto bg-primary text-white px-8 py-3 sm:py-0 rounded-xl hover:opacity-90 transition">
              Buscar
            </button>

          </div>

        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-8">

        {/* FILTROS */}
        <aside className="w-full lg:w-80 lg:shrink-0">

          <div className="bg-surface rounded-2xl border border-border shadow-card p-4 sm:p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-semibold text-text mb-6">
              Filtros
            </h2>

            <FreelancerFilters
              filter={filter}
              setFilter={setFilter}
            />

          </div>

        </aside>

        {/* GRID */}
        <main className="flex-1 min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <p className="text-text-muted">
              Mostrando {filtered.length} freelancers
            </p>

            <select className="w-full sm:w-auto border border-border rounded-lg px-4 py-2 bg-surface text-text">
              <option>Más relevantes</option>
              <option>Mejor calificados</option>
              <option>Más recientes</option>
            </select>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">

            {filtered.map((f) => (
              <FreelancerCard
                key={f.id}
                freelancer={f}
              />
            ))}

          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-text-muted">
              No se encontraron freelancers.
            </div>
          )}

        </main>

      </section>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}