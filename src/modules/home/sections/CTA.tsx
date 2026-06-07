export default function CTA() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            bg-gradient-to-r
            from-violet-600
            to-blue-600
            rounded-3xl
            p-12
            text-center
            text-white
          "
        >
          <h2 className="text-4xl font-bold">
            Comienza hoy con WorkLink
          </h2>

          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Conecta con profesionales, encuentra nuevas oportunidades
            laborales y haz crecer tu red de contactos locales.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

            <button
              className="
                bg-white
                text-violet-600
                px-8
                py-4
                rounded-xl
                font-semibold
                hover:scale-105
                transition
              "
            >
              Explorar servicios
            </button>

            <button
              className="
                border
                border-white
                px-8
                py-4
                rounded-xl
                font-semibold
                hover:bg-white
                hover:text-violet-600
                transition
              "
            >
              Crear cuenta
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}