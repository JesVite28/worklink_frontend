import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminUsers } from "../services/adminMockService";
import type { AdminUser } from "../models/adminEntities";

export default function AdminUsersPage() {
  const { items, isLoading } = useAdminCollection(getAdminUsers);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Usuarios"
        description="Listado simulado de usuarios registrados en WorkLink."
        action={<Badge variant="info">{items.length} registros</Badge>}
      />

      {isLoading ? (
        <EmptyState title="Cargando usuarios" description="Preparando datos de prueba para administración." />
      ) : (
        <DataTable
          title="Listado de usuarios"
          subtitle="Datos mock listos para conectar con la API real"
          columns={[
            {
              key: "user",
              header: "Usuario",
              render: (row: AdminUser) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} size="sm" />
                  <div>
                    <p className="font-medium text-text">{row.name}</p>
                    <p className="text-xs text-text-muted">{row.email}</p>
                  </div>
                </div>
              ),
            },
            { key: "role", header: "Rol", render: (row: AdminUser) => row.role },
            { key: "type", header: "Tipo", render: (row: AdminUser) => row.accountType },
            { key: "status", header: "Estado", render: (row: AdminUser) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}