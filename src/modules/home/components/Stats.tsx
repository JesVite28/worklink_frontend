const stats = [
  {
    value: "500+",
    label: "Freelancers",
  },
  {
    value: "200+",
    label: "Empresas",
  },
  {
    value: "1000+",
    label: "Proyectos",
  },
  {
    value: "95%",
    label: "Satisfacción",
  },
];

export default function Stats() {
  return (
    <section className="bg-background py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-4 text-center shadow-sm sm:p-6"
            >
              <h3 className="text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-text-muted sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}