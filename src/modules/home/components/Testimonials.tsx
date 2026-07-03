import { StarIcon } from "@heroicons/react/24/solid";
import { testimonials } from "../data/Testimonials";

export default function Testimonials() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14 lg:mb-16">
          <span className="text-sm font-semibold text-primary sm:text-base">
            Testimonios
          </span>

          <h2 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
            Lo que dicen nuestros usuarios
          </h2>

          <p className="mt-4 text-sm leading-6 text-text-muted sm:text-base">
            Profesionales y empresas que ya utilizan WorkLink.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} className="h-5 w-5 text-warning" />
                ))}
              </div>

              <p className="mb-6 flex-1 text-sm leading-7 text-text-muted sm:text-base">
                “{testimonial.comment}”
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