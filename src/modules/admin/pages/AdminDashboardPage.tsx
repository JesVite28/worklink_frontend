import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";

import Badge from "../components/Badge";
import ChartCard from "../components/ChartCard";
import DashboardCard from "../components/DashboardCard";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import FilterButton from "../components/FilterButton";
import SectionTitle from "../components/SectionTitle";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import type {
  AdminPeriod,
  ChartPoint,
  DistributionItem,
  RecentActivityItem,
} from "../models/adminDashboard";

const periodLabels: Array<{ key: AdminPeriod; label: string }> = [
  { key: "day", label: "Día" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
];

const metricIcons: Record<"users" | "company" | "freelancer" | "jobs", React.ReactNode> = {
  users: <UsersIcon className="h-5 w-5" />,
  company: <BuildingOffice2Icon className="h-5 w-5" />,
  freelancer: <UserGroupIcon className="h-5 w-5" />,
  jobs: <BriefcaseIcon className="h-5 w-5" />,
};

const metricTones: Record<"users" | "company" | "freelancer" | "jobs", string> = {
  users: "bg-primary",
  company: "bg-secondary",
  freelancer: "bg-success",
  jobs: "bg-info",
};

function linePath(points: ChartPoint[]) {
  if (points.length === 0) return "";

  const max = Math.max(...points.map((point) => point.value), 1);
  const step = points.length > 1 ? 100 / (points.length - 1) : 0;

  return points
    .map((point, index) => {
      const x = index * step;
      const y = 100 - (point.value / max) * 100;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function DoughnutChart({ items }: { items: DistributionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = items.map((item, index) => {
    const previousValues = items.slice(0, index).reduce((sum, current) => sum + current.value, 0);
    const dashLength = circumference * (item.value / total);
    const dashOffset = circumference - circumference * (previousValues / total);

    return {
      ...item,
      dashLength,
      dashOffset,
    };
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-52 w-52">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className="stroke-border"
            strokeWidth={strokeWidth}
          />

          {segments.map((item) => {
            return (
              <circle
                key={item.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                className={item.colorClass.replace("bg-", "stroke-")}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${item.dashLength} ${circumference - item.dashLength}`}
                strokeDashoffset={item.dashOffset}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-text-muted">Total</p>
          <p className="text-3xl font-semibold text-text">1024</p>
        </div>
      </div>

      <div className="w-full space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.colorClass}`} />
              <span className="text-text-muted">{item.label}</span>
            </div>
            <span className="font-medium text-text">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityBadge({ status }: { status: RecentActivityItem["status"] }) {
  const map: Record<RecentActivityItem["status"], { label: string; variant: "success" | "warning" | "info" }> = {
    success: { label: "Activo", variant: "success" },
    warning: { label: "Pendiente", variant: "warning" },
    info: { label: "Nuevo", variant: "info" },
  };

  return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
}

export default function AdminDashboardPage() {
  const { period, setPeriod, metrics, currentSeries, distribution, recentActivity, statisticRows } = useAdminDashboard();

  const chartPath = useMemo(() => linePath(currentSeries), [currentSeries]);
  const maxValue = Math.max(...currentSeries.map((point) => point.value), 1);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <DashboardCard
            key={metric.id}
            title={metric.label}
            value={metric.value}
            growth={metric.growth}
            icon={metricIcons[metric.icon]}
            toneClass={metricTones[metric.icon]}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <ChartCard
          title="Actividad general"
          subtitle="Estadísticas simuladas listas para conectarse con la API"
          action={
            <div className="flex flex-wrap gap-2">
              {periodLabels.map((item) => (
                <FilterButton
                  key={item.key}
                  active={period === item.key}
                  onClick={() => setPeriod(item.key)}
                >
                  {item.label}
                </FilterButton>
              ))}
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Usuarios y crecimiento</p>
                  <p className="text-2xl font-semibold text-text">12,480</p>
                </div>

                <Badge variant="success">+8.4%</Badge>
              </div>

              <svg viewBox="0 0 100 100" className="h-72 w-full">
                <defs>
                  <linearGradient id="adminLineFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 20, 40, 60, 80, 100].map((value) => (
                  <line
                    key={value}
                    x1="0"
                    x2="100"
                    y1={value}
                    y2={value}
                    className="stroke-border"
                    strokeDasharray="2 2"
                  />
                ))}

                <path d={`${chartPath} L 100,100 L 0,100 Z`} fill="url(#adminLineFill)" />

                <path
                  d={chartPath}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {currentSeries.map((point, index) => {
                  const step = currentSeries.length > 1 ? 100 / (currentSeries.length - 1) : 0;
                  const x = index * step;
                  const y = 100 - (point.value / maxValue) * 100;

                  return <circle key={point.label} cx={x} cy={y} r="1.8" className="fill-primary" />;
                })}

                {currentSeries.map((point, index) => {
                  const step = currentSeries.length > 1 ? 100 / (currentSeries.length - 1) : 0;
                  const x = index * step;

                  return (
                    <text
                      key={point.label}
                      x={x}
                      y="96"
                      textAnchor="middle"
                      className="fill-text-muted text-[4px]"
                    >
                      {point.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="card-soft p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">Distribución de usuarios</h3>
                  <p className="text-sm text-text-muted mt-1">Clientes, freelancers y empresas</p>
                </div>

                <FilterButton active>Mes</FilterButton>
              </div>

              <DoughnutChart items={distribution} />
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataTable
          title="Actividad reciente"
          subtitle="Registros simulados listos para integrarse con backend"
          columns={[
            {
              key: "action",
              header: "Actividad",
              render: (row: RecentActivityItem) => (
                <div>
                  <p className="font-medium text-text">{row.action}</p>
                  <p className="text-xs text-text-muted mt-1">{row.subject}</p>
                </div>
              ),
            },
            {
              key: "date",
              header: "Fecha",
              render: (row: RecentActivityItem) => <span className="text-text-muted">{row.date}</span>,
            },
            {
              key: "status",
              header: "Estado",
              render: (row: RecentActivityItem) => <ActivityBadge status={row.status} />,
            },
          ]}
          rows={recentActivity}
        />

        <section className="card-soft p-5 space-y-4">
          <SectionTitle
            title="Estadísticas principales"
            description="Métricas simuladas preparadas para la integración con API"
          />

          {statisticRows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text">{row.label}</p>
                  <p className="text-xs text-text-muted mt-1">{row.category}</p>
                </div>

                <Badge variant="info">{row.trend}</Badge>
              </div>

              <p className="mt-3 text-lg font-semibold text-text">{row.value}</p>
            </div>
          ))}

          {statisticRows.length === 0 ? (
            <EmptyState
              title="Sin estadísticas disponibles"
              description="Cuando la API esté lista, este espacio mostrará las métricas operativas del panel."
            />
          ) : null}
        </section>
      </section>
    </div>
  );
}