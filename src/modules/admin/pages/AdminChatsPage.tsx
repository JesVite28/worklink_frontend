import Badge from "../components/Badge";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminChats } from "../services/adminMockService";
import type { AdminChatItem } from "../models/adminEntities";

export default function AdminChatsPage() {
  const { items, isLoading } = useAdminCollection(getAdminChats);

  return (
    <div className="space-y-6">
      <SectionTitle title="Chats" description="Conversaciones listas para soporte y seguimiento." action={<Badge variant="info">{items.length} chats</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando chats" description="Preparando lista de conversaciones de prueba." />
      ) : (
        <DataTable
          title="Conversaciones recientes"
          subtitle="Vista mock de soporte y comunicación"
          columns={[
            { key: "participants", header: "Participantes", render: (row: AdminChatItem) => row.participants },
            { key: "preview", header: "Vista previa", render: (row: AdminChatItem) => row.preview },
            { key: "unread", header: "No leídos", render: (row: AdminChatItem) => row.unreadMessages },
            { key: "status", header: "Estado", render: (row: AdminChatItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}