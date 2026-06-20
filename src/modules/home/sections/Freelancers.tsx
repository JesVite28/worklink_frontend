import { StarIcon } from "@heroicons/react/24/solid";
import { freelancers } from "../data/Freelancers";

export default function Freelancers() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {freelancers.map((freelancer) => (
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

                  <button
                    className="
                      bg-primary
                      hover:opacity-90
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