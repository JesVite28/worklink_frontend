import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import FreelancerFilters from "../components/FreelancerFilters";
import FreelancerCard from "../components/FreelancerCard";

import { useFreelancers } from "../hooks/userFreelancer";

type SortOption =
  | "relevant"
  | "rating"
  | "recent";

export default function FreelancersPage() {
  const {
    filteredFreelancers,

    search,
    setSearch,

    filter,
    setFilter,
    categories,

    workMode,
    setWorkMode,

    rateType,
    setRateType,

    availability,
    setAvailability,

    minimumRating,
    setMinimumRating,

    maximumRate,
    setMaximumRate,
    maximumAvailableRate,

    hasActiveFilters,
    clearFilters,

    loading,
    error,
    reloadFreelancers,
  } = useFreelancers();

  const [
    sortBy,
    setSortBy,
  ] =
    useState<SortOption>(
      "relevant",
    );

  const sortedFreelancers =
    useMemo(() => {
      const freelancers = [
        ...filteredFreelancers,
      ];

      if (sortBy === "rating") {
        return freelancers.sort(
          (
            freelancerA,
            freelancerB,
          ) =>
            freelancerB.rating -
            freelancerA.rating,
        );
      }

      if (sortBy === "recent") {
        return freelancers.sort(
          (
            freelancerA,
            freelancerB,
          ) => {
            const dateA =
              freelancerA.createdAt
                ? new Date(
                    freelancerA.createdAt,
                  ).getTime()
                : 0;

            const dateB =
              freelancerB.createdAt
                ? new Date(
                    freelancerB.createdAt,
                  ).getTime()
                : 0;

            return dateB - dateA;
          },
        );
      }

      return freelancers;
    }, [
      filteredFreelancers,
      sortBy,
    ]);

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Encabezado */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold sm:text-5xl">
            Marketplace de Freelancers
          </h1>

          <p className="mb-8 text-base opacity-90 sm:text-lg">
            Encuentra el talento perfecto para tu proyecto.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row"
          >
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Busca por nombre, especialidad, ubicación o experiencia"
              className="flex-1 rounded-xl px-4 py-4 text-gray-700 outline-none sm:px-6"
            />

            <button
              type="submit"
              className="rounded-xl bg-primary px-8 py-3 text-white transition hover:opacity-90 sm:py-0"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row">
        {/* Filtros */}
        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-xl font-semibold text-text">
              Filtros
            </h2>

            <FreelancerFilters
              filter={filter}
              setFilter={setFilter}
              categories={categories}
              workMode={workMode}
              setWorkMode={setWorkMode}
              rateType={rateType}
              setRateType={setRateType}
              availability={
                availability
              }
              setAvailability={
                setAvailability
              }
              minimumRating={
                minimumRating
              }
              setMinimumRating={
                setMinimumRating
              }
              maximumRate={
                maximumRate
              }
              setMaximumRate={
                setMaximumRate
              }
              maximumAvailableRate={
                maximumAvailableRate
              }
              hasActiveFilters={
                hasActiveFilters
              }
              clearFilters={
                clearFilters
              }
            />
          </div>
        </aside>

        {/* Lista */}
        <main className="min-w-0 flex-1">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text">
                {sortedFreelancers.length ===
                1
                  ? "1 freelancer encontrado"
                  : `${sortedFreelancers.length} freelancers encontrados`}
              </p>

              {hasActiveFilters && (
                <p className="mt-1 text-sm text-text-muted">
                  Resultados filtrados según tus preferencias.
                </p>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target
                    .value as SortOption,
                )
              }
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 sm:w-auto"
            >
              <option value="relevant">
                Más relevantes
              </option>

              <option value="rating">
                Mejor calificados
              </option>

              <option value="recent">
                Más recientes
              </option>
            </select>
          </div>

          {/* Cargando */}
          {loading && (
            <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

              <p className="text-text-muted">
                Cargando freelancers...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
              <p className="mb-5 text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void reloadFreelancers();
                }}
                className="rounded-xl bg-primary px-6 py-3 text-white transition hover:opacity-90"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Resultados */}
          {!loading &&
            !error &&
            sortedFreelancers.length >
              0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
                {sortedFreelancers.map(
                  (freelancer) => (
                    <FreelancerCard
                      key={
                        freelancer.id
                      }
                      freelancer={
                        freelancer
                      }
                    />
                  ),
                )}
              </div>
            )}

          {/* Sin resultados */}
          {!loading &&
            !error &&
            sortedFreelancers.length ===
              0 && (
              <div className="rounded-2xl border border-border bg-surface px-6 py-20 text-center">
                <h3 className="mb-2 text-xl font-semibold text-text">
                  No encontramos freelancers
                </h3>

                <p className="mb-6 text-text-muted">
                  Prueba cambiando la búsqueda o eliminando algunos filtros.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="rounded-xl bg-primary px-6 py-3 text-white transition hover:opacity-90"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
        </main>
      </section>
    </div>
  );
}