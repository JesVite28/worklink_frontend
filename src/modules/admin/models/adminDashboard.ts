export type AdminPeriod = "day" | "week" | "month" | "year";

export interface AdminMetric {
  id: string;
  label: string;
  value: string;
  growth: string;
  icon: "users" | "company" | "freelancer" | "jobs";
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DistributionItem {
  label: string;
  value: number;
  colorClass: string;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  subject: string;
  date: string;
  status: "success" | "warning" | "info";
}

export interface StatisticRow {
  id: string;
  label: string;
  category: string;
  value: string;
  trend: string;
}