type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function ChartCard({ title, subtitle, action, children }: Props) {
  return (
    <section className="card-soft p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          {subtitle ? <p className="text-sm text-text-muted mt-1">{subtitle}</p> : null}
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}