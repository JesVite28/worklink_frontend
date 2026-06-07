import {
  MagnifyingGlassIcon,
  MapPinIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export default function Search() {
  return (
    <section className="-mt-10 relative z-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="¿Qué servicio buscas?"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="relative">
              <Squares2X2Icon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <select className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option>Todas las categorías</option>
                <option>Diseño</option>
                <option>Desarrollo</option>
                <option>Marketing</option>
                <option>Fotografía</option>
              </select>
            </div>

            <div className="relative">
              <MapPinIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Ubicación"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-3 transition">
              Buscar
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}