import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminServices } from "../services/adminMockService";
import type { AdminServiceItem } from "../models/adminEntities";

export default function AdminServicesPage() {
  const { items, isLoading } = useAdminCollection(getAdminServices);

  return (
    <div className="space-y-6">
      <SectionTitle title="Servicios" description="Servicios simulados disponibles para administración." action={<Badge variant="info">{items.length} servicios</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando servicios" description="Preparando catálogo de servicios para el panel." />
      ) : (
        <DataTable
          title="Servicios creados"
          subtitle="Listado mock para futuras acciones de moderación"
          columns={[
            { key: "title", header: "Servicio", render: (row: AdminServiceItem) => row.title },
            { key: "provider", header: "Proveedor", render: (row: AdminServiceItem) => row.provider },
            { key: "price", header: "Precio", render: (row: AdminServiceItem) => row.price },
            { key: "status", header: "Estado", render: (row: AdminServiceItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}