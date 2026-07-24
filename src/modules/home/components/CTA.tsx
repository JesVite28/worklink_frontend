import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary px-6 py-12 text-center text-white shadow-card sm:px-10 lg:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Comienza hoy con WorkLink
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            Conecta con profesionales, encuentra nuevas oportunidades
            laborales y haz crecer tu red de contactos locales.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/freelancers"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-4 font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
            >
              Explorar servicios
            </Link>

            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-primary sm:w-auto"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}