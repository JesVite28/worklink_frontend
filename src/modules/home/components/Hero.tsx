import Container from "../../../shared/components/layout/Container";

export default function Hero() {
  return (
    <section className="py-20 bg-background">
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
                bg-primary/10
                text-primary
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
                text-text
              "
            >
              Conecta con el talento local que necesitas
            </h1>

            <p
              className="
                text-text-muted
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
                  bg-primary
                  hover:opacity-90
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
                  border-border
                  hover:border-primary
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  text-text
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
                from-primary
                to-secondary
                rounded-3xl
                p-8
                shadow-card
                w-full
                max-w-2xl
              "
            >
              <img
                src="/freelancer.png"
                alt="Freelancer WorkLink"
                className="w-full h-auto object-contain"
              />
            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}