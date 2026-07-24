import { Link } from "react-router-dom";

import {
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

interface Props {
  title: string;
  description: string;
}

export default function DashboardSectionPage({
  title,
  description,
}: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface px-6 py-16 text-center shadow-card sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <WrenchScrewdriverIcon className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-text sm:text-3xl">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
        {description}
      </p>

      <Link
        to="/dashboard"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Volver al inicio
      </Link>
    </section>
  );
}