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
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="text-primary font-semibold">
            Categorías
          </span>

          <h2 className="text-4xl font-bold mt-2 text-text">
            Explora servicios populares
          </h2>

          <p className="text-text-muted mt-3">
            Encuentra profesionales especializados.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {categories.map((category, index) => {
            const Icon = icons[index];

            return (
              <div
                key={category.id}
                className="
                  bg-surface
                  rounded-2xl
                  border
                  border-border
                  p-6
                  hover:shadow-card
                  hover:-translate-y-1
                  transition-all
                  cursor-pointer
                "
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="font-semibold text-lg text-text">
                  {category.name}
                </h3>

                <p className="text-text-muted mt-2">
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