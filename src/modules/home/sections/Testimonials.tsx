import { StarIcon } from "@heroicons/react/24/solid";
import { testimonials } from "../data/Testimonials";

export default function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-primary font-semibold">
            Testimonios
          </span>

          <h2 className="text-4xl font-bold mt-2 text-text">
            Lo que dicen nuestros usuarios
          </h2>

          <p className="text-text-muted mt-4">
            Profesionales y empresas que ya utilizan WorkLink.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="
                bg-surface
                rounded-2xl
                border
                border-border
                p-8
                shadow-sm
              "
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className="h-5 w-5 text-warning"
                  />
                ))}
              </div>

              <p className="text-text-muted mb-6">
                "{testimonial.comment}"
              </p>

              <div>
                <h4 className="font-semibold text-text">
                  {testimonial.name}
                </h4>

                <span className="text-sm text-text-muted">
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