import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Crea tu perfil",
    description:
      "Regístrate como freelancer o empresa y completa tu información.",
    icon: UserPlusIcon,
  },
  {
    title: "Encuentra oportunidades",
    description: "Explora servicios, proyectos y profesionales disponibles.",
    icon: MagnifyingGlassIcon,
  },
  {
    title: "Comienza a trabajar",
    description: "Conecta con clientes o talento local y desarrolla proyectos.",
    icon: BriefcaseIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14 lg:mb-16">
          <span className="text-sm font-semibold text-primary sm:text-base">
            ¿Cómo funciona?
          </span>

          <h2 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
            Empieza en pocos pasos
          </h2>

          <p className="mt-4 text-sm leading-6 text-text-muted sm:text-base">
            WorkLink conecta empresas y profesionales de forma rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:shadow-card sm:p-8"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 sm:mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-text sm:text-xl">
                  {index + 1}. {step.title}
                </h3>

                <p className="text-sm leading-6 text-text-muted sm:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}