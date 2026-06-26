import {
  BuildingOffice2Icon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

import { companies } from "../data/Companies";

export default function Companies() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="text-primary font-semibold">
            Empresas
          </span>

          <h2 className="text-4xl font-bold mt-2 text-text">
            Empresas destacadas
          </h2>

          <p className="text-text-muted mt-3">
            Organizaciones que buscan talento local para sus proyectos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {companies.map((company) => (
            <div
              key={company.id}
              className="
                bg-surface
                rounded-2xl
                border
                border-border
                p-6
                hover:shadow-card
                hover:-translate-y-1
                transition-all
              "
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <BuildingOffice2Icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="font-semibold text-lg mt-5 text-text">
                {company.name}
              </h3>

              <p className="text-text-muted text-sm mt-2">
                {company.description}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <BriefcaseIcon className="h-5 w-5 text-text-muted" />

                <span className="text-sm text-text-muted">
                  {company.jobs} vacantes abiertas
                </span>
              </div>

              <button
                className="
                  mt-5
                  w-full
                  py-2.5
                  rounded-xl
                  border
                  border-primary
                  text-primary
                  font-medium
                  hover:bg-primary
                  hover:text-white
                  transition
                "
              >
                Ver empresa
              </button>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}