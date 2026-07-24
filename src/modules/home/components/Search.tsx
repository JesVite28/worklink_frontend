import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Search() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [location, setLocation] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const params = new URLSearchParams();

    const normalizedSearch = search.trim();
    const normalizedLocation = location.trim();

    if (normalizedSearch) {
      params.set("search", normalizedSearch);
    }

    if (category !== "Todas") {
      params.set("category", category);
    }

    if (normalizedLocation) {
      params.set("location", normalizedLocation);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/freelancers?${queryString}`
        : "/freelancers",
    );
  }

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr_1fr_auto]"
          >
            {/* Servicio */}
            <div className="relative min-w-0">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                placeholder="¿Qué servicio buscas?"
                aria-label="Servicio que buscas"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Categoría */}
            <div className="relative min-w-0">
              <Squares2X2Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
                aria-label="Categoría"
                className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-11 pr-10 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              >
                <option value="Todas">
                  Todas las categorías
                </option>

                <option value="Diseño">
                  Diseño
                </option>

                <option value="Desarrollo">
                  Desarrollo
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Fotografía">
                  Fotografía
                </option>
              </select>
            </div>

            {/* Ubicación */}
            <div className="relative min-w-0">
              <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
                placeholder="Ubicación"
                aria-label="Ubicación"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Buscar */}
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-semibold text-white transition hover:opacity-90 lg:w-auto"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Buscar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}