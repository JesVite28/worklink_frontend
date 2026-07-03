import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminFreelancers } from "../services/adminMockService";
import type { AdminFreelancer } from "../models/adminEntities";

export default function AdminFreelancersPage() {
  const { items, isLoading } = useAdminCollection(getAdminFreelancers);

  return (
    <div className="space-y-6">
      <SectionTitle title="Freelancers" description="Perfiles y actividad simulada para revisión administrativa." action={<Badge variant="info">{items.length} perfiles</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando freelancers" description="Preparando datos de prueba para el módulo." />
      ) : (
        <DataTable
          title="Freelancers activos"
          subtitle="Datos simulados para futuras aprobaciones y revisiones"
          columns={[
            {
              key: "freelancer",
              header: "Freelancer",
              render: (row: AdminFreelancer) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} size="sm" />
                  <div>
                    <p className="font-medium text-text">{row.name}</p>
                    <p className="text-xs text-text-muted">{row.specialty}</p>
                  </div>
                </div>
              ),
            },
            { key: "rating", header: "Rating", render: (row: AdminFreelancer) => row.rating.toFixed(1) },
            { key: "jobs", header: "Trabajos", render: (row: AdminFreelancer) => row.completedJobs },
            { key: "status", header: "Estado", render: (row: AdminFreelancer) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}