import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  to: string;
  label: string;
  icon: ReactNode;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function DashboardSidebarItem({
  to,
  label,
  icon,
  collapsed = false,
  onClick,
}: Props) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-3 py-2.5",
          "text-sm font-medium transition",
          isActive
            ? "bg-white/15 text-white shadow-sm"
            : "text-white/80 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <span className="shrink-0">{icon}</span>

      {!collapsed && (
        <span className="min-w-0 truncate">
          {label}
        </span>
      )}
    </NavLink>
  );
}