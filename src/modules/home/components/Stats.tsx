const stats = [
  {
    value: "500+",
    label: "Freelancers"
  },
  {
    value: "200+",
    label: "Empresas"
  },
  {
    value: "1000+",
    label: "Proyectos"
  },
  {
    value: "95%",
    label: "Satisfacción"
  }
];

export default function Stats() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                bg-surface
                rounded-2xl
                p-6
                text-center
                border
                border-border
                shadow-sm
              "
            >
              <h3 className="text-3xl font-bold text-primary">
                {stat.value}
              </h3>

              <p className="text-text-muted mt-2">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}