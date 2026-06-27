import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminVacancies } from "../services/adminMockService";
import type { AdminVacancy } from "../models/adminEntities";

export default function AdminVacanciesPage() {
  const { items, isLoading } = useAdminCollection(getAdminVacancies);

  return (
    <div className="space-y-6">
      <SectionTitle title="Vacantes" description="Publicaciones activas, borradores y candidaturas simuladas." action={<Badge variant="info">{items.length} vacantes</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando vacantes" description="Preparando la información de publicaciones." />
      ) : (
        <DataTable
          title="Vacantes publicadas"
          subtitle="Vista preparada para control de publicaciones"
          columns={[
            { key: "title", header: "Vacante", render: (row: AdminVacancy) => row.title },
            { key: "company", header: "Empresa", render: (row: AdminVacancy) => row.company },
            { key: "apps", header: "Postulaciones", render: (row: AdminVacancy) => row.applications },
            { key: "status", header: "Estado", render: (row: AdminVacancy) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}