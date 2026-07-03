import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
};

export default function SidebarItem({ to, label, icon, collapsed = false }: Props) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
          isActive ? "bg-white/12 text-white shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed ? <span>{label}</span> : null}
    </NavLink>
  );
}