import {
  Bars3Icon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  CubeIcon,
  GlobeAltIcon,
  StarIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import SidebarItem from "./SidebarItem";

type Props = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

const items = [
  { to: "/admin", label: "Dashboard", icon: <ChartBarIcon className="h-5 w-5" /> },
  { to: "/admin/usuarios", label: "Usuarios", icon: <UsersIcon className="h-5 w-5" /> },
  { to: "/admin/empresas", label: "Empresas", icon: <BuildingOffice2Icon className="h-5 w-5" /> },
  { to: "/admin/freelancers", label: "Freelancers", icon: <UserGroupIcon className="h-5 w-5" /> },
  { to: "/admin/vacantes", label: "Vacantes", icon: <BriefcaseIcon className="h-5 w-5" /> },
  { to: "/admin/servicios", label: "Servicios", icon: <CubeIcon className="h-5 w-5" /> },
  { to: "/admin/solicitudes", label: "Solicitudes", icon: <ClipboardDocumentListIcon className="h-5 w-5" /> },
  { to: "/admin/chats", label: "Chats", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
  { to: "/admin/resenas", label: "Reseñas", icon: <StarIcon className="h-5 w-5" /> },
  { to: "/admin/reportes", label: "Reportes", icon: <GlobeAltIcon className="h-5 w-5" /> },
  { to: "/admin/configuracion", label: "Configuración", icon: <Cog6ToothIcon className="h-5 w-5" /> },
];

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: Props) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-primary-strong to-secondary-strong text-white transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${collapsed ? "lg:w-24" : "lg:w-72"}`}
      >
        <div className="flex h-20 items-center justify-between px-5 border-b border-white/10">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <img
                src="/logob.png"
                alt="WorkLink"
                className="h-10 w-auto shrink-0 sm:h-20"
              />
              <h1 className="text-lg font-semibold">
                Panel Admin
              </h1>
            </div>
          ) : (
            <span className="font-semibold"><img src="/logob.png" alt="WorkLink" className="h-10 w-auto shrink-0 sm:h-10"/>
            </span>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition lg:hidden"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex h-[calc(100%-5rem)] flex-col gap-2 p-4 overflow-y-auto">
          {items.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Cerrar menú"
        />
      ) : null}
    </>
  );
}