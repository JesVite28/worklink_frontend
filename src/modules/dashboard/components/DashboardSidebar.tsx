import {
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  DocumentCheckIcon,
  FolderOpenIcon,
  PaperAirplaneIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../context/useAuth";
import type { UserRole } from "../../../context/AuthContext";

import DashboardSidebarItem from "./DashboardSidebarItem";

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

interface SidebarItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const clientItems: SidebarItem[] = [
  {
    to: "/dashboard/solicitudes",
    label: "Mis solicitudes",
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
  },
];

const freelancerItems: SidebarItem[] = [
  {
    to: "/dashboard/servicios",
    label: "Mis servicios",
    icon: <CubeIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/portafolio",
    label: "Mi portafolio",
    icon: <FolderOpenIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/disponibilidad",
    label: "Disponibilidad",
    icon: <CalendarDaysIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/postulaciones",
    label: "Mis postulaciones",
    icon: <PaperAirplaneIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/solicitudes",
    label: "Solicitudes recibidas",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5" />,
  },
];

const companyItems: SidebarItem[] = [
  {
    to: "/dashboard/vacantes",
    label: "Mis vacantes",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/postulaciones",
    label: "Postulaciones",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
];

const commonFinalItems: SidebarItem[] = [
  {
    to: "/dashboard/contratos",
    label: "Contratos",
    icon: <DocumentCheckIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/mensajes",
    label: "Mensajes",
    icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
  },
  {
    to: "/dashboard/notificaciones",
    label: "Notificaciones",
    icon: <BellIcon className="h-5 w-5" />,
  },
];

function getProfileLabel(role: UserRole | null): string {
  switch (role) {
    case "freelancer":
      return "Perfil profesional";

    case "empresa":
      return "Perfil de empresa";

    default:
      return "Mi perfil";
  }
}

function getRoleLabel(role: UserRole | null): string {
  switch (role) {
    case "cliente":
      return "Panel de cliente";

    case "freelancer":
      return "Panel freelancer";

    case "empresa":
      return "Panel de empresa";

    default:
      return "Panel de usuario";
  }
}

function getRoleIcon(role: UserRole | null) {
  switch (role) {
    case "empresa":
      return <BuildingOffice2Icon className="h-5 w-5" />;

    case "freelancer":
      return <BriefcaseIcon className="h-5 w-5" />;

    default:
      return <UserCircleIcon className="h-5 w-5" />;
  }
}

function getRoleItems(role: UserRole | null): SidebarItem[] {
  switch (role) {
    case "cliente":
      return clientItems;

    case "freelancer":
      return freelancerItems;

    case "empresa":
      return companyItems;

    default:
      return [];
  }
}

export default function DashboardSidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: Props) {
  const { primaryRole } = useAuth();

  const visuallyCollapsed = collapsed && !mobileOpen;

  const items: SidebarItem[] = [
    {
      to: "/dashboard",
      label: "Inicio",
      icon: <Squares2X2Icon className="h-5 w-5" />,
    },
    {
      to: "/dashboard/perfil",
      label: getProfileLabel(primaryRole),
      icon: getRoleIcon(primaryRole),
    },
    ...getRoleItems(primaryRole),
    ...commonFinalItems,
  ];

  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40",
          "flex w-72 flex-col",
          "bg-gradient-to-b from-primary-strong to-secondary-strong",
          "text-white transition-all duration-300",
          "lg:static lg:translate-x-0",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          visuallyCollapsed ? "lg:w-24" : "lg:w-72",
        ].join(" ")}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-4">
          {!visuallyCollapsed ? (
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/logob.png"
                alt="WorkLink"
                className="h-12 w-auto shrink-0"
              />

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold">
                  WorkLink
                </h1>

                <p className="truncate text-xs text-white/70">
                  {getRoleLabel(primaryRole)}
                </p>
              </div>
            </div>
          ) : (
            <img
              src="/logob.png"
              alt="WorkLink"
              className="mx-auto h-10 w-auto"
            />
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20 lg:inline-flex"
            aria-label={
              collapsed ? "Expandir menú" : "Contraer menú"
            }
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 transition hover:bg-white/20 lg:hidden"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {items.map((item) => (
            <DashboardSidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              collapsed={visuallyCollapsed}
              onClick={onCloseMobile}
            />
          ))}
        </nav>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          aria-label="Cerrar menú lateral"
        />
      )}
    </>
  );
}