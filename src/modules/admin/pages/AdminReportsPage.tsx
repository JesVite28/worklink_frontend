import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminReports } from "../services/adminMockService";
import type { AdminReportItem } from "../models/adminEntities";

export default function AdminReportsPage() {
  const { items, isLoading } = useAdminCollection(getAdminReports);

  return (
    <div className="space-y-6">
      <SectionTitle title="Reportes" description="Indicadores preparados para exportación y análisis." action={<Badge variant="info">{items.length} reportes</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando reportes" description="Preparando métricas simuladas del panel." />
      ) : (
        <DataTable
          title="Reportes del sistema"
          subtitle="Vista de análisis mock para operaciones"
          columns={[
            { key: "title", header: "Reporte", render: (row: AdminReportItem) => row.title },
            { key: "category", header: "Categoría", render: (row: AdminReportItem) => row.category },
            { key: "value", header: "Valor", render: (row: AdminReportItem) => row.value },
            { key: "status", header: "Estado", render: (row: AdminReportItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}