import Badge from "./Badge";

type Priority = "high" | "medium" | "low";

type Props = {
  priority: Priority;
};

const labelMap: Record<Priority, { label: string; variant: "success" | "warning" | "info" }> = {
  high: { label: "Alta", variant: "warning" },
  medium: { label: "Media", variant: "info" },
  low: { label: "Baja", variant: "success" },
};

export default function PriorityChip({ priority }: Props) {
  const config = labelMap[priority];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}