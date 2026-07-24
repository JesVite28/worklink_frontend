import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  ArrowPathIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import VacancyPublicCard from "../components/VacancyPublicCard";

import {
  getPublicVacancies,
} from "../services/vacancyService";

import type {
  Vacancy,
  VacancyPagination,
} from "../models/vacancy";

interface VacancyFilterForm {
  search: string;
  category: string;
  location: string;
}

const EMPTY_PAGINATION: VacancyPagination = {
  current_page: 1,
  last_page: 1,
  per_page: 8,
  total: 0,
  from: null,
  to: null,
};

function getPositivePage(
  value: string | null,
): number {
  const page = Number(value);

  return Number.isInteger(page) && page > 0
    ? page
    : 1;
}

export default function PublicVacanciesPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    vacancies,
    setVacancies,
  ] = useState<Vacancy[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<VacancyPagination>(
    EMPTY_PAGINATION,
  );

  const [
    filters,
    setFilters,
  ] = useState<VacancyFilterForm>({
    search:
      searchParams.get("search") ?? "",

    category:
      searchParams.get("category") ?? "",

    location:
      searchParams.get("location") ?? "",
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const currentPage = getPositivePage(
    searchParams.get("page"),
  );

  const appliedSearch =
    searchParams.get("search")?.trim() ?? "";

  const appliedCategory =
    searchParams.get("category")?.trim() ?? "";

  const appliedLocation =
    searchParams.get("location")?.trim() ?? "";

  const hasActiveFilters =
    appliedSearch !== "" ||
    appliedCategory !== "" ||
    appliedLocation !== "";

  const loadVacancies = useCallback(
    async (
      showInitialLoading = true,
    ): Promise<void> => {
      try {
        if (showInitialLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const response =
          await getPublicVacancies({
            search:
              appliedSearch || undefined,

            category:
              appliedCategory || undefined,

            location:
              appliedLocation || undefined,

            page: currentPage,
            per_page: 8,
          });

        setVacancies(
          response.data.vacancies,
        );

        setPagination(
          response.data.pagination,
        );
      } catch (requestError) {
        console.error(
          "Error al cargar vacantes públicas:",
          requestError,
        );

        setVacancies([]);
        setPagination(
          EMPTY_PAGINATION,
        );

        setError(
          "No se pudieron cargar las vacantes.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      appliedCategory,
      appliedLocation,
      appliedSearch,
      currentPage,
    ],
  );

  useEffect(() => {
    setFilters({
      search: appliedSearch,
      category: appliedCategory,
      location: appliedLocation,
    });
  }, [
    appliedCategory,
    appliedLocation,
    appliedSearch,
  ]);

  useEffect(() => {
    void loadVacancies();
  }, [loadVacancies]);

  function handleFilterChange(
    field: keyof VacancyFilterForm,
    value: string,
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextParams =
      new URLSearchParams();

    const normalizedSearch =
      filters.search.trim();

    const normalizedCategory =
      filters.category.trim();

    const normalizedLocation =
      filters.location.trim();

    if (normalizedSearch) {
      nextParams.set(
        "search",
        normalizedSearch,
      );
    }

    if (normalizedCategory) {
      nextParams.set(
        "category",
        normalizedCategory,
      );
    }

    if (normalizedLocation) {
      nextParams.set(
        "location",
        normalizedLocation,
      );
    }

    nextParams.set("page", "1");

    setSearchParams(nextParams);
  }

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      location: "",
    });

    setSearchParams({
      page: "1",
    });
  }

  function changePage(page: number) {
    if (
      page < 1 ||
      page > pagination.last_page ||
      page === pagination.current_page
    ) {
      return;
    }

    const nextParams =
      new URLSearchParams(
        searchParams,
      );

    nextParams.set(
      "page",
      String(page),
    );

    setSearchParams(nextParams);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const visiblePages = useMemo(() => {
    const pages: number[] = [];

    const start = Math.max(
      1,
      pagination.current_page - 2,
    );

    const end = Math.min(
      pagination.last_page,
      pagination.current_page + 2,
    );

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      pages.push(page);
    }

    return pages;
  }, [
    pagination.current_page,
    pagination.last_page,
  ]);

  return (
    <main className="min-h-screen bg-background py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <section className="rounded-3xl bg-gradient-to-r from-primary to-secondary px-6 py-10 text-white shadow-card sm:px-10 lg:px-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              Oportunidades laborales
            </span>

            <h1 className="mt-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Encuentra vacantes para impulsar tu carrera
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Explora oportunidades publicadas por empresas de WorkLink y encuentra proyectos relacionados con tu experiencia.
            </p>
          </div>
        </section>

        {/* Filtros */}
        <section className="relative z-10 mx-auto -mt-5 max-w-6xl rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr_auto]"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={filters.search}
                onChange={(event) => {
                  handleFilterChange(
                    "search",
                    event.target.value,
                  );
                }}
                placeholder="Puesto, empresa o palabra clave"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="relative">
              <BriefcaseIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={filters.category}
                onChange={(event) => {
                  handleFilterChange(
                    "category",
                    event.target.value,
                  );
                }}
                placeholder="Categoría"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="relative">
              <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="search"
                value={filters.location}
                onChange={(event) => {
                  handleFilterChange(
                    "location",
                    event.target.value,
                  );
                }}
                placeholder="Ubicación"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Buscar
            </button>
          </form>
        </section>

        {/* Cabecera de resultados */}
        <section className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">
              Vacantes disponibles
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-text-muted">
                {pagination.total === 1
                  ? "1 oportunidad encontrada"
                  : `${pagination.total} oportunidades encontradas`}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:border-primary/40 hover:text-primary"
              >
                <XMarkIcon className="h-5 w-5" />
                Limpiar filtros
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                void loadVacancies(false);
              }}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowPathIcon
                className={[
                  "h-5 w-5",
                  refreshing
                    ? "animate-spin"
                    : "",
                ].join(" ")}
              />

              {refreshing
                ? "Actualizando..."
                : "Actualizar"}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-danger/20 bg-danger/5 px-5 py-4 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        {/* Resultados */}
        {loading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <article
                key={index}
                className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
              >
                <div className="flex gap-4">
                  <div className="h-14 w-14 rounded-xl bg-border" />

                  <div className="flex-1">
                    <div className="h-5 w-2/3 rounded bg-border" />
                    <div className="mt-3 h-4 w-1/3 rounded bg-border" />
                  </div>
                </div>

                <div className="mt-6 h-3 w-full rounded bg-border" />
                <div className="mt-3 h-3 w-5/6 rounded bg-border" />
                <div className="mt-3 h-3 w-2/3 rounded bg-border" />

                <div className="mt-6 flex justify-between">
                  <div className="h-8 w-32 rounded bg-border" />
                  <div className="h-10 w-28 rounded-xl bg-border" />
                </div>
              </article>
            ))}
          </div>
        ) : vacancies.length > 0 ? (
          <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2">
            {vacancies.map((vacancy) => (
              <VacancyPublicCard
                key={vacancy.id}
                vacancy={vacancy}
              />
            ))}
          </div>
        ) : (
          <section className="mt-6 rounded-2xl border border-border bg-surface px-5 py-16 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseIcon className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-text">
              No encontramos vacantes
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
              Prueba con otra palabra clave, categoría o ubicación.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Mostrar todas
              </button>
            )}
          </section>
        )}

        {/* Paginación */}
        {!loading &&
          pagination.last_page > 1 && (
            <nav
              aria-label="Paginación de vacantes"
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  changePage(
                    pagination.current_page - 1,
                  );
                }}
                disabled={
                  pagination.current_page === 1
                }
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    changePage(page);
                  }}
                  className={[
                    "h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition",
                    page ===
                    pagination.current_page
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-text hover:border-primary hover:text-primary",
                  ].join(" ")}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  changePage(
                    pagination.current_page + 1,
                  );
                }}
                disabled={
                  pagination.current_page ===
                  pagination.last_page
                }
                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </nav>
          )}
      </div>
    </main>
  );
}