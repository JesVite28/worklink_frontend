import Badge from "./Badge";

type Props = {
  status: "active" | "pending" | "inactive" | "draft";
};

const labelMap: Record<Props["status"], { label: string; variant: "success" | "warning" | "info" | "neutral" }> = {
  active: { label: "Activo", variant: "success" },
  pending: { label: "Pendiente", variant: "warning" },
  inactive: { label: "Inactivo", variant: "neutral" },
  draft: { label: "Borrador", variant: "info" },
};

export default function StatusChip({ status }: Props) {
  const config = labelMap[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}