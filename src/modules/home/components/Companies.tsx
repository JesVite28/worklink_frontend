import {
  BriefcaseIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

import { companies } from "../data/Companies";
import { useProtectedNavigation } from "../hooks/useProtectedNavigation";

export default function Companies() {
  const { goToProtectedRoute } =
    useProtectedNavigation();

  function handleViewCompany() {
    goToProtectedRoute("/dashboard");
  }

  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="text-sm font-semibold text-primary sm:text-base">
            Empresas
          </span>

          <h2 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
            Empresas destacadas
          </h2>

          <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
            Organizaciones que buscan talento local para sus proyectos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {companies.map((company) => (
            <article
              key={company.id}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-card sm:p-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                <BuildingOffice2Icon className="h-8 w-8 text-primary" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-text">
                {company.name}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-text-muted">
                {company.description}
              </p>

              <div className="mt-5 flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5 shrink-0 text-text-muted" />

                <span className="text-sm text-text-muted">
                  {company.jobs} vacantes abiertas
                </span>
              </div>

              <button
                type="button"
                onClick={handleViewCompany}
                className="mt-5 w-full rounded-xl border border-primary py-2.5 font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                Ver empresa
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}