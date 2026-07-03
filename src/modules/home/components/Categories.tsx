import {
  CodeBracketIcon,
  PaintBrushIcon,
  ChartBarIcon,
  CameraIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  FilmIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import { categories } from "../data/Categories";

const icons = [
  CodeBracketIcon,
  PaintBrushIcon,
  ChartBarIcon,
  CameraIcon,
  PencilSquareIcon,
  BriefcaseIcon,
  FilmIcon,
  WrenchScrewdriverIcon,
];

export default function Categories() {
  return (
    <section className="bg-background py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="text-sm font-semibold text-primary sm:text-base">
            Categorías
          </span>

          <h2 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
            Explora servicios populares
          </h2>

          <p className="mt-3 text-sm leading-6 text-text-muted sm:text-base">
            Encuentra profesionales especializados.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = icons[index];

            return (
              <div
                key={category.id}
                className="h-full cursor-pointer rounded-2xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:shadow-card sm:p-6"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-text">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-text-muted sm:text-base">
                  {category.jobs} servicios
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}