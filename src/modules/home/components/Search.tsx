import {
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_1fr_1fr_auto]">
            <div className="relative min-w-0">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative min-w-0">
              <Squares2X2Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <select className="h-12 w-full appearance-none rounded-xl border border-border bg-background pl-11 pr-4 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30">
                <option>Todas las categorías</option>
                <option>Diseño</option>
                <option>Desarrollo</option>
                <option>Marketing</option>
                <option>Fotografía</option>
              </select>
            </div>

            <div className="relative min-w-0">
              <MapPinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

              <input
                type="text"
                placeholder="Ubicación"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button className="h-12 rounded-xl bg-primary px-7 font-semibold text-white transition hover:opacity-90 lg:w-auto">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}