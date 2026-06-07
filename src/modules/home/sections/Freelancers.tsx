import { StarIcon } from "@heroicons/react/24/solid";
import { freelancers } from "../data/Freelancers";

export default function Freelancers() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="text-violet-600 font-semibold">
            Talento destacado
          </span>

          <h2 className="text-4xl font-bold mt-2">
            Freelancers recomendados
          </h2>

          <p className="text-slate-500 mt-3">
            Profesionales verificados con excelentes valoraciones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {freelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                border
                border-slate-200
                hover:shadow-xl
                transition-all
              "
            >
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">

                <h3 className="font-semibold text-lg">
                  {freelancer.name}
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  {freelancer.profession}
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">
                    {freelancer.rating}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">

                  <span className="font-bold text-violet-600">
                    {freelancer.price}
                  </span>

                  <button
                    className="
                      bg-violet-600
                      hover:bg-violet-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Ver perfil
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}