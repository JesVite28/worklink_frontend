import {
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <section className="-mt-10 relative z-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="bg-surface rounded-2xl shadow-card border border-border p-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search input */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                className="
                  w-full
                  pl-10 pr-4 py-3
                  border border-border
                  rounded-xl
                  text-text
                  placeholder:text-text-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
              />
            </div>

            {/* Category select */}
            <div className="relative">
              <Squares2X2Icon className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />

              <select
                className="
                  w-full
                  pl-10 pr-4 py-3
                  border border-border
                  rounded-xl
                  text-text
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
              >
                <option>Todas las categorías</option>
                <option>Diseño</option>
                <option>Desarrollo</option>
                <option>Marketing</option>
                <option>Fotografía</option>
              </select>
            </div>

            {/* Location input */}
            <div className="relative">
              <MapPinIcon className="h-5 w-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Ubicación"
                className="
                  w-full
                  pl-10 pr-4 py-3
                  border border-border
                  rounded-xl
                  text-text
                  placeholder:text-text-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary
                "
              />
            </div>

            {/* Button */}
            <button className="
              bg-primary
              hover:opacity-90
              text-white
              font-semibold
              rounded-xl
              py-3
              transition
            ">
              Buscar
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}