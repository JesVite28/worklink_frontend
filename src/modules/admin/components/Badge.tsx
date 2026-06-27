type BadgeVariant = "success" | "warning" | "info" | "neutral";

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
  neutral: "bg-surface text-text border-border",
};

export default function Badge({ children, variant = "neutral" }: Props) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}