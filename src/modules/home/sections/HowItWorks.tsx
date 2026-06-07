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
    description:
      "Explora servicios, proyectos y profesionales disponibles.",
    icon: MagnifyingGlassIcon,
  },
  {
    title: "Comienza a trabajar",
    description:
      "Conecta con clientes o talento local y desarrolla proyectos.",
    icon: BriefcaseIcon,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-violet-600 font-semibold">
            ¿Cómo funciona?
          </span>

          <h2 className="text-4xl font-bold mt-2">
            Empieza en pocos pasos
          </h2>

          <p className="text-slate-500 mt-4">
            WorkLink conecta empresas y profesionales de forma rápida.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-2xl
                  p-8
                  text-center
                "
              >
                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-violet-100
                    flex
                    items-center
                    justify-center
                    mb-6
                  "
                >
                  <Icon className="h-8 w-8 text-violet-600" />
                </div>

                <h3 className="font-semibold text-xl mb-3">
                  {index + 1}. {step.title}
                </h3>

                <p className="text-slate-500">
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