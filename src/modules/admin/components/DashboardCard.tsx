import Badge from "./Badge";

type Props = {
  title: string;
  value: string;
  growth: string;
  icon: React.ReactNode;
  toneClass: string;
};

export default function DashboardCard({ title, value, growth, icon, toneClass }: Props) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-muted">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-text">{value}</h3>
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${toneClass}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <Badge variant="success">{growth}</Badge>
      </div>
    </div>
  );
}