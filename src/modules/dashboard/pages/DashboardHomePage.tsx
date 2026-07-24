import { Link } from "react-router-dom";

import {
  ArrowPathIcon,
  BellIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  StarIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import FreelancerCard from "../../freelancers/components/FreelancerCard";
import ServiceFeedCard from "../../services/components/ServiceFeedCard";
import VacancyPublicCard from "../../vacancies/components/VacancyPublicCard";

import { useDashboardFeed } from "../hooks/useDashboardFeed";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

export default function DashboardHomePage() {
  const {
    feedItems,
    freelancers,
    services,
    vacancies,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,
    categories,

    loading,
    refreshing,
    error,

    hasActiveFilters,
    clearFilters,
    reloadFeed,
  } = useDashboardFeed();

  const suggestedFreelancers =
    freelancers.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Encabezado del feed */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">
              Inicio
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Descubre profesionales, servicios y vacantes publicadas en WorkLink.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void reloadFeed();
            }}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
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
              : "Actualizar feed"}
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mt-5">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Buscar servicios, freelancers, vacantes, empresas o ubicaciones..."
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-12 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Categorías */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={[
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-background text-text-muted hover:border-primary/40 hover:text-primary",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* Advertencia */}
      {error && (
        <section className="mt-5 rounded-2xl border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-medium text-warning">
            {error}
          </p>
        </section>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Feed principal */}
        <main className="min-w-0">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text">
                Para ti
              </h2>

              {!loading && (
                <p className="mt-1 text-sm text-text-muted">
                  {feedItems.length === 1
                    ? "1 publicación encontrada"
                    : `${feedItems.length} publicaciones encontradas`}
                </p>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-80"
              >
                <XMarkIcon className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-5">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <article
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="flex gap-4 border-b border-border p-5">
                    <div className="h-12 w-12 rounded-full bg-border" />

                    <div className="flex-1">
                      <div className="h-4 w-40 rounded bg-border" />
                      <div className="mt-3 h-3 w-28 rounded bg-border" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="h-5 w-2/3 rounded bg-border" />
                    <div className="mt-4 h-3 w-full rounded bg-border" />
                    <div className="mt-2 h-3 w-5/6 rounded bg-border" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-border" />

                    <div className="mt-6 flex justify-between">
                      <div className="h-8 w-28 rounded bg-border" />
                      <div className="h-10 w-28 rounded-xl bg-border" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : feedItems.length > 0 ? (
            <div className="space-y-5">
              {feedItems.map((item) => {
                if (item.type === "freelancer") {
                  return (
                    <FreelancerCard
                      key={item.id}
                      freelancer={item.data}
                      variant="feed"
                    />
                  );
                }

                if (item.type === "vacancy") {
                  return (
                    <VacancyPublicCard
                      key={item.id}
                      vacancy={item.data}
                    />
                  );
                }

                return (
                  <ServiceFeedCard
                    key={item.id}
                    service={item.data}
                  />
                );
              })}
            </div>
          ) : (
            <section className="rounded-2xl border border-border bg-surface px-5 py-14 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MagnifyingGlassIcon className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-text">
                No encontramos publicaciones
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                Prueba utilizando otra búsqueda o seleccionando una categoría diferente.
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
        </main>

        {/* Panel lateral */}
        <aside className="space-y-5">
          {/* Resumen del contenido */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h2 className="font-semibold text-text">
              Explorar WorkLink
            </h2>

            <div
              className={[
                "mt-4 grid gap-3",
                vacancies.length > 0
                  ? "grid-cols-1"
                  : "grid-cols-2",
              ].join(" ")}
            >
              <Link
                to="/freelancers"
                className="rounded-xl bg-primary/10 p-4 transition hover:bg-primary/15"
              >
                <UserGroupIcon className="h-6 w-6 text-primary" />

                <p className="mt-3 text-xl font-bold text-text">
                  {freelancers.length}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Freelancers
                </p>
              </Link>

              <div className="rounded-xl bg-primary/10 p-4">
                <StarIcon className="h-6 w-6 text-primary" />

                <p className="mt-3 text-xl font-bold text-text">
                  {services.length}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Servicios
                </p>
              </div>

              {vacancies.length > 0 && (
                <Link
                  to="/vacantes"
                  className="rounded-xl bg-primary/10 p-4 transition hover:bg-primary/15"
                >
                  <BriefcaseIcon className="h-6 w-6 text-primary" />

                  <p className="mt-3 text-xl font-bold text-text">
                    {vacancies.length}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Vacantes
                  </p>
                </Link>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Link
                to="/dashboard/mensajes"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-text transition hover:bg-background hover:text-primary"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Mis mensajes
              </Link>

              <Link
                to="/dashboard/notificaciones"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-text transition hover:bg-background hover:text-primary"
              >
                <BellIcon className="h-5 w-5" />
                Notificaciones
              </Link>

              <Link
                to="/dashboard/resenas"
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-text transition hover:bg-background hover:text-primary"
              >
                <StarIcon className="h-5 w-5" />
                Mis reseñas
              </Link>
            </div>
          </section>

          {/* Profesionales sugeridos */}
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-text">
                Profesionales sugeridos
              </h2>

              <Link
                to="/freelancers"
                className="shrink-0 text-xs font-semibold text-primary hover:underline"
              >
                Ver todos
              </Link>
            </div>

            {suggestedFreelancers.length > 0 ? (
              <div className="mt-4 divide-y divide-border">
                {suggestedFreelancers.map(
                  (freelancer) => (
                    <Link
                      key={freelancer.id}
                      to={`/freelancers/${freelancer.id}`}
                      className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <img
                        src={freelancer.image}
                        alt={`Perfil de ${freelancer.name}`}
                        className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            DEFAULT_IMAGE;
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">
                          {freelancer.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-text-muted">
                          {freelancer.profession}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
                        <StarIcon className="h-4 w-4 text-yellow-400" />

                        {freelancer.rating.toFixed(1)}
                      </div>
                    </Link>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">
                No hay profesionales disponibles.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}