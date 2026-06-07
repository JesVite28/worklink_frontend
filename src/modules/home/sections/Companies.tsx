import {
  BuildingOffice2Icon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

import { companies } from "../data/Companies";

export default function Companies() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold">
            Empresas
          </span>

          <h2 className="text-4xl font-bold mt-2">
            Empresas destacadas
          </h2>

          <p className="text-slate-500 mt-3">
            Organizaciones que buscan talento local para sus proyectos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {companies.map((company) => (
            <div
              key={company.id}
              className="
                bg-white
                rounded-2xl
                border
                border-slate-200
                p-6
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
              "
            >
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
              </div>

              <h3 className="font-semibold text-lg mt-5">
                {company.name}
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                {company.description}
              </p>

              <div className="flex items-center gap-2 mt-5">
                <BriefcaseIcon className="h-5 w-5 text-slate-500" />

                <span className="text-sm text-slate-600">
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
                  border-blue-600
                  text-blue-600
                  font-medium
                  hover:bg-blue-600
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