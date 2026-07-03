import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminCompanies } from "../services/adminMockService";
import type { AdminCompany } from "../models/adminEntities";

export default function AdminCompaniesPage() {
  const { items, isLoading } = useAdminCollection(getAdminCompanies);

  return (
    <div className="space-y-6">
      <SectionTitle title="Empresas" description="Empresas registradas y activas en la plataforma." action={<Badge variant="info">{items.length} empresas</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando empresas" description="Preparando catálogo de compañías para el panel." />
      ) : (
        <DataTable
          title="Empresas registradas"
          subtitle="Información simulada para futuras operaciones CRUD"
          columns={[
            {
              key: "company",
              header: "Empresa",
              render: (row: AdminCompany) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} size="sm" />
                  <div>
                    <p className="font-medium text-text">{row.name}</p>
                    <p className="text-xs text-text-muted">{row.sector}</p>
                  </div>
                </div>
              ),
            },
            { key: "location", header: "Ubicación", render: (row: AdminCompany) => row.location },
            { key: "jobs", header: "Vacantes", render: (row: AdminCompany) => row.jobsOpen },
            { key: "status", header: "Estado", render: (row: AdminCompany) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}