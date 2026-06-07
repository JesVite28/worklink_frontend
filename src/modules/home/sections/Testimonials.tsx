import { StarIcon } from "@heroicons/react/24/solid";
import { testimonials } from "../data/Testimonials";

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold">
            Testimonios
          </span>

          <h2 className="text-4xl font-bold mt-2">
            Lo que dicen nuestros usuarios
          </h2>

          <p className="text-slate-500 mt-4">
            Profesionales y empresas que ya utilizan WorkLink.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                p-8
                shadow-sm
              "
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className="h-5 w-5 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-slate-600 mb-6">
                "{testimonial.comment}"
              </p>

              <div>
                <h4 className="font-semibold">
                  {testimonial.name}
                </h4>

                <span className="text-sm text-slate-500">
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}