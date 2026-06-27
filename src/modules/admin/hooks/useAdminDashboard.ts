import { useMemo, useState } from "react";

import { chartSeries, distribution, metrics, recentActivity, statisticRows } from "../data/dashboardData";
import type { AdminPeriod } from "../models/adminDashboard";

export function useAdminDashboard() {
  const [period, setPeriod] = useState<AdminPeriod>("month");

  const currentSeries = useMemo(() => chartSeries[period], [period]);

  return {
    period,
    setPeriod,
    metrics,
    currentSeries,
    distribution,
    recentActivity,
    statisticRows,
  };
}