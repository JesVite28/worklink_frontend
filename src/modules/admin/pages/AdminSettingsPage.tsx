import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminSettings } from "../services/adminMockService";
import type { AdminSettingItem } from "../models/adminEntities";

export default function AdminSettingsPage() {
  const { items, isLoading } = useAdminCollection(getAdminSettings);

  return (
    <div className="space-y-6">
      <SectionTitle title="Configuración" description="Ajustes globales del panel administrativo." action={<Badge variant="info">{items.length} ajustes</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando configuración" description="Preparando parámetros del panel." />
      ) : (
        <DataTable
          title="Parámetros del sistema"
          subtitle="Configuración mock para futuras preferencias del admin"
          columns={[
            { key: "name", header: "Nombre", render: (row: AdminSettingItem) => row.name },
            { key: "description", header: "Descripción", render: (row: AdminSettingItem) => row.description },
            { key: "value", header: "Valor", render: (row: AdminSettingItem) => row.value },
            { key: "status", header: "Estado", render: (row: AdminSettingItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}