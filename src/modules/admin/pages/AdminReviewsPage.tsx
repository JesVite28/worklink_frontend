import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import SectionTitle from "../components/SectionTitle";
import StatusChip from "../components/StatusChip";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { getAdminReviews } from "../services/adminMockService";
import type { AdminReviewItem } from "../models/adminEntities";

export default function AdminReviewsPage() {
  const { items, isLoading } = useAdminCollection(getAdminReviews);

  return (
    <div className="space-y-6">
      <SectionTitle title="Reseñas" description="Opiniones simuladas listas para moderación." action={<Badge variant="info">{items.length} reseñas</Badge>} />

      {isLoading ? (
        <EmptyState title="Cargando reseñas" description="Preparando el módulo de reseñas." />
      ) : (
        <DataTable
          title="Reseñas publicadas"
          subtitle="Contenido mock para moderación y análisis"
          columns={[
            {
              key: "author",
              header: "Autor",
              render: (row: AdminReviewItem) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.author} size="sm" />
                  <div>
                    <p className="font-medium text-text">{row.author}</p>
                    <p className="text-xs text-text-muted">Sobre {row.subject}</p>
                  </div>
                </div>
              ),
            },
            { key: "rating", header: "Rating", render: (row: AdminReviewItem) => row.rating.toFixed(1) },
            { key: "comment", header: "Comentario", render: (row: AdminReviewItem) => row.comment },
            { key: "status", header: "Estado", render: (row: AdminReviewItem) => <StatusChip status={row.status} /> },
          ]}
          rows={items}
        />
      )}
    </div>
  );
}