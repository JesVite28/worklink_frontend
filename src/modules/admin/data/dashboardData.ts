import type {
  AdminMetric,
  AdminPeriod,
  ChartPoint,
  DistributionItem,
  RecentActivityItem,
  StatisticRow,
} from "../models/adminDashboard";

export const metrics: AdminMetric[] = [
  {
    id: "users",
    label: "Usuarios registrados",
    value: "12,480",
    growth: "+8.4%",
    icon: "users",
  },
  {
    id: "companies",
    label: "Empresas registradas",
    value: "1,240",
    growth: "+5.1%",
    icon: "company",
  },
  {
    id: "freelancers",
    label: "Freelancers activos",
    value: "8,960",
    growth: "+4.7%",
    icon: "freelancer",
  },
  {
    id: "jobs",
    label: "Vacantes publicadas",
    value: "2,315",
    growth: "+9.2%",
    icon: "jobs",
  },
];

export const chartSeries: Record<AdminPeriod, ChartPoint[]> = {
  day: [
    { label: "00", value: 24 },
    { label: "04", value: 18 },
    { label: "08", value: 42 },
    { label: "12", value: 56 },
    { label: "16", value: 48 },
    { label: "20", value: 68 },
    { label: "24", value: 52 },
  ],
  week: [
    { label: "Lun", value: 48 },
    { label: "Mar", value: 58 },
    { label: "Mié", value: 42 },
    { label: "Jue", value: 68 },
    { label: "Vie", value: 74 },
    { label: "Sáb", value: 65 },
    { label: "Dom", value: 52 },
  ],
  month: [
    { label: "Ene", value: 55 },
    { label: "Feb", value: 61 },
    { label: "Mar", value: 58 },
    { label: "Abr", value: 72 },
    { label: "May", value: 76 },
    { label: "Jun", value: 82 },
    { label: "Jul", value: 79 },
    { label: "Ago", value: 88 },
    { label: "Sep", value: 84 },
    { label: "Oct", value: 91 },
    { label: "Nov", value: 94 },
    { label: "Dic", value: 98 },
  ],
  year: [
    { label: "2021", value: 44 },
    { label: "2022", value: 52 },
    { label: "2023", value: 61 },
    { label: "2024", value: 70 },
    { label: "2025", value: 84 },
    { label: "2026", value: 96 },
  ],
};

export const distribution: DistributionItem[] = [
  { label: "Clientes", value: 42, colorClass: "bg-secondary" },
  { label: "Freelancers", value: 38, colorClass: "bg-primary" },
  { label: "Empresas", value: 20, colorClass: "bg-success" },
];

export const recentActivity: RecentActivityItem[] = [
  {
    id: "act-1",
    action: "Nuevo usuario registrado",
    subject: "María González",
    date: "Hace 5 min",
    status: "success",
  },
  {
    id: "act-2",
    action: "Nueva empresa registrada",
    subject: "Tech Solutions",
    date: "Hace 18 min",
    status: "info",
  },
  {
    id: "act-3",
    action: "Vacante publicada",
    subject: "Frontend Senior",
    date: "Hace 40 min",
    status: "warning",
  },
  {
    id: "act-4",
    action: "Servicio creado",
    subject: "Diseño de marca",
    date: "Hace 1 h",
    status: "success",
  },
];

export const statisticRows: StatisticRow[] = [
  {
    id: "stat-1",
    label: "Servicios más solicitados",
    category: "Diseño y desarrollo",
    value: "1,284 solicitudes",
    trend: "+12.4%",
  },
  {
    id: "stat-2",
    label: "Categorías más utilizadas",
    category: "Desarrollo Web",
    value: "342 publicaciones",
    trend: "+7.1%",
  },
  {
    id: "stat-3",
    label: "Vacantes con más postulaciones",
    category: "Full Stack React",
    value: "194 postulaciones",
    trend: "+15.8%",
  },
];