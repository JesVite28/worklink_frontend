import Container from "../../../components/layout/Container";

export default function Hero() {
  return (
    <section className="py-20">
      <Container>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Contenido Izquierdo */}
          <div>

            <span
              className="
                inline-block
                px-4
                py-2
                rounded-full
                bg-violet-100
                text-violet-700
                font-medium
                mb-6
              "
            >
              Plataforma Local de Servicios
            </span>

            <h1
              className="
                text-4xl
                md:text-5xl
                lg:text-6xl
                font-bold
                leading-tight
                text-slate-900
              "
            >
              Conecta con el talento local que necesitas
            </h1>

            <p
              className="
                text-slate-600
                text-lg
                mt-6
                max-w-xl
              "
            >
              Encuentra freelancers, profesionales y oportunidades
              laborales cerca de ti. Publica proyectos, explora
              servicios y crea conexiones profesionales de manera rápida
              y sencilla.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                className="
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Explorar Servicios
              </button>

              <button
                className="
                  border
                  border-slate-300
                  hover:border-slate-400
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Publicar Empleo
              </button>

            </div>

          </div>

          {/* Imagen Derecha */}
          <div className="flex justify-center">

            <div
              className="
                bg-gradient-to-br
                from-violet-600
                to-blue-600
                rounded-3xl
                p-8
                shadow-2xl
                w-full
                max-w-2xl
              "
            >
              <img
                src="/freelancer.png"
                alt="Freelancer WorkLink"
                className="
                  w-full
                  h-auto
                  object-contain
                "
              />
            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}