import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import PriorityChip from "../components/PriorityChip";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminRequests } from "../services/adminMockService";
import type { AdminRequestItem } from "../models/adminEntities";

export default function AdminRequestsPage() {
  const { items, isLoading } = useAdminCollection(getAdminRequests);

  return (
    <div className="space-y-6">
      <SectionTitle title="Solicitudes" description="Tickets y solicitudes listas para gestión futura." action={<Badge variant="info">{items.length} solicitudes</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando solicitudes" description="Preparando registros de solicitudes simuladas." />
      ) : (
        <DataTable
          title="Solicitudes recientes"
          subtitle="Datos mock para soporte y moderación"
          columns={[
            { key: "subject", header: "Asunto", render: (row: AdminRequestItem) => row.subject },
            { key: "requester", header: "Solicitante", render: (row: AdminRequestItem) => row.requester },
            { key: "priority", header: "Prioridad", render: (row: AdminRequestItem) => <PriorityChip priority={row.priority} /> },
            { key: "status", header: "Estado", render: (row: AdminRequestItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}