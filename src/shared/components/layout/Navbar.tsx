import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useLoginModal } from "../../../context/LoginModalContext";

import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  FolderOpenIcon,
  HomeIcon,
  Squares2X2Icon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Container from "./Container";
import ThemeToggle from "../ui/ThemeToggle";

import NotificationDropdown from "../../../modules/notifications/components/NotificationDropdown";

import {
  getUnreadNotificationCount,
} from "../../../modules/notifications/services/notificationService";

import { useAuth } from "../../../context/useAuth";

interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
}

/*
|--------------------------------------------------------------------------
| Navegación pública
|--------------------------------------------------------------------------
*/

const publicItems: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "Explorar servicios",
    path: "/freelancers",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    label: "Vacantes",
    path: "/vacantes",
    icon: (
      <BuildingOffice2Icon className="h-5 w-5" />
    ),
  },
];

/*
|--------------------------------------------------------------------------
| Navegación de cliente
|--------------------------------------------------------------------------
*/

const clientItems: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "Explorar freelancers",
    path: "/freelancers",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
  {
    label: "Mis solicitudes",
    path: "/dashboard/solicitudes",
    icon: (
      <ClipboardDocumentListIcon className="h-5 w-5" />
    ),
  },
  {
    label: "Contratos",
    path: "/dashboard/contratos",
    icon: (
      <DocumentCheckIcon className="h-5 w-5" />
    ),
  },
];

/*
|--------------------------------------------------------------------------
| Navegación de freelancer
|--------------------------------------------------------------------------
*/

const freelancerItems: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "Explorar vacantes",
    path: "/vacantes",
    icon: (
      <BuildingOffice2Icon className="h-5 w-5" />
    ),
  },
  {
    label: "Mis servicios",
    path: "/dashboard/servicios",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    label: "Portafolio",
    path: "/dashboard/portafolio",
    icon: <FolderOpenIcon className="h-5 w-5" />,
  },
  {
    label: "Disponibilidad",
    path: "/dashboard/disponibilidad",
    icon: (
      <CalendarDaysIcon className="h-5 w-5" />
    ),
  },
  {
    label: "Postulaciones",
    path: "/dashboard/postulaciones",
    icon: (
      <ClipboardDocumentListIcon className="h-5 w-5" />
    ),
  },
  {
    label: "Solicitudes",
    path: "/dashboard/solicitudes",
    icon: (
      <DocumentCheckIcon className="h-5 w-5" />
    ),
  },
  {
    label: "Contratos",
    path: "/dashboard/contratos",
    icon: (
      <DocumentCheckIcon className="h-5 w-5" />
    ),
  },
];

/*
|--------------------------------------------------------------------------
| Navegación de empresa
|--------------------------------------------------------------------------
*/

const companyItems: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    label: "Mis vacantes",
    path: "/dashboard/vacantes",
    icon: <BriefcaseIcon className="h-5 w-5" />,
  },
  {
    label: "Postulaciones",
    path: "/dashboard/postulaciones",
    icon: <UserGroupIcon className="h-5 w-5" />,
  },
  {
    label: "Solicitudes",
    path: "/dashboard/solicitudes",
    icon: (
      <ClipboardDocumentListIcon className="h-5 w-5" />
    ),
  },
  {
    label: "Contratos",
    path: "/dashboard/contratos",
    icon: (
      <DocumentCheckIcon className="h-5 w-5" />
    ),
  },
];

/*
|--------------------------------------------------------------------------
| Navegación de administrador
|--------------------------------------------------------------------------
*/

const adminItems: NavigationItem[] = [
  {
    label: "Panel administrativo",
    path: "/admin",
    icon: (
      <Squares2X2Icon className="h-5 w-5" />
    ),
  },
];

const roleLabels = {
  admin: "Administrador",
  cliente: "Cliente",
  freelancer: "Freelancer",
  empresa: "Empresa",
} as const;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    primaryRole,
    isAuthenticated,
    isInitializing,
    logout,
  } = useAuth();

  const profileMenuRef =
    useRef<HTMLDivElement>(null);

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(0);

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const fullName =
    [
      user?.name,
      user?.last_name,
      user?.maternal_last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Usuario";

  const initials = [
    user?.name?.charAt(0),
    user?.last_name?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const profilePhoto =
    user?.profile_photo_url ||
    user?.profile_photo ||
    null;

  const roleLabel = primaryRole
    ? roleLabels[primaryRole]
    : "Usuario";

  /*
  |--------------------------------------------------------------------------
  | Navegación según el rol
  |--------------------------------------------------------------------------
  */

  const navigationItems = useMemo(() => {
    if (!isAuthenticated) {
      return publicItems;
    }

    switch (primaryRole) {
      case "cliente":
        return clientItems;

      case "freelancer":
        return freelancerItems;

      case "empresa":
        return companyItems;

      case "admin":
        return adminItems;

      default:
        return publicItems;
    }
  }, [
    isAuthenticated,
    primaryRole,
  ]);

  const mobileNavigationItems =
    useMemo(() => {
      if (
        !isAuthenticated ||
        primaryRole === "admin"
      ) {
        return navigationItems;
      }

      return [
        ...navigationItems,
        {
          label: "Mensajes",
          path: "/dashboard/mensajes",
          icon: (
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          ),
        },
      ];
    }, [
      isAuthenticated,
      navigationItems,
      primaryRole,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Cerrar menús
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Navegación
  |--------------------------------------------------------------------------
  */

  const goTo = (
    path: string,
  ) => {
    navigate(path);

    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  };

  const { openLoginModal } = useLoginModal();

  const handleLoginClick = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);

    openLoginModal(location.pathname);
  };

  /*
  |--------------------------------------------------------------------------
  | Ruta activa
  |--------------------------------------------------------------------------
  */

  const isActivePath = (
    path: string,
  ) => {
    if (
      path === "/" ||
      path === "/dashboard" ||
      path === "/admin"
    ) {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  /*
  |--------------------------------------------------------------------------
  | Cerrar sesión
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    async () => {
      if (isLoggingOut) {
        return;
      }

      try {
        setIsLoggingOut(true);

        // Navigate home first to avoid PrivateRoute redirecting to /login
        goTo("/");

        await logout();
      } finally {
        setIsLoggingOut(false);
      }
    };

  const canUseMessages =
    isAuthenticated &&
    primaryRole !== "admin";

  const canUseNotifications =
    isAuthenticated &&
    primaryRole !== "admin";

  const isMessagesActive =
    location.pathname.startsWith(
      "/dashboard/mensajes",
    );

  const isNotificationsActive =
    location.pathname.startsWith(
      "/dashboard/notificaciones",
    );

  /*
  |--------------------------------------------------------------------------
  | Contador de notificaciones
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!canUseNotifications) {
      setUnreadNotificationCount(0);

      return;
    }

    let isMounted = true;

    const loadUnreadCount =
      async (): Promise<void> => {
        try {
          const count =
            await getUnreadNotificationCount();

          if (isMounted) {
            setUnreadNotificationCount(
              count,
            );
          }
        } catch {
          // Actualización silenciosa.
        }
      };

    void loadUnreadCount();

    const intervalId =
      window.setInterval(() => {
        void loadUnreadCount();
      }, 30000);

    return () => {
      isMounted = false;

      window.clearInterval(
        intervalId,
      );
    };
  }, [canUseNotifications]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between gap-3">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              goTo(
                isAuthenticated
                  ? primaryRole === "admin"
                    ? "/admin"
                    : "/dashboard"
                  : "/",
              );
            }}
            className="flex min-w-0 shrink-0 items-center"
            aria-label="Ir al inicio"
          >
            <img
              src="/logo.png"
              alt="WorkLink"
              className="h-16 w-auto shrink-0 sm:h-20"
            />
          </button>

          {/* Navegación de escritorio */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex">
            {navigationItems.map(
              (item) => {
                const isActive =
                  isActivePath(
                    item.path,
                  );

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() =>
                      goTo(item.path)
                    }
                    className={[
                      "relative whitespace-nowrap py-2 text-sm font-medium transition",
                      isActive
                        ? "text-primary"
                        : "text-text-muted hover:text-primary",
                    ].join(" ")}
                  >
                    {item.label}

                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
                    )}
                  </button>
                );
              },
            )}
          </nav>

          {/* Acciones de escritorio */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ThemeToggle />

            {canUseNotifications && (
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(
                    (previous) =>
                      !previous,
                  );

                  setIsProfileOpen(false);
                  setIsOpen(false);
                }}
                className={[
                  "relative flex h-11 w-11 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface",
                  isNotificationsOpen ||
                  isNotificationsActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-text-muted hover:border-primary hover:bg-primary/10 hover:text-primary",
                ].join(" ")}
                aria-label="Abrir notificaciones"
                title="Notificaciones"
                aria-expanded={
                  isNotificationsOpen
                }
              >
                <BellIcon className="h-6 w-6" />

                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-surface bg-danger px-1 text-[10px] font-bold leading-none text-white">
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {canUseMessages && (
              <button
                type="button"
                onClick={() =>
                  goTo(
                    "/dashboard/mensajes",
                  )
                }
                className={[
                  "relative flex h-11 w-11 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface",
                  isMessagesActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-text-muted hover:border-primary hover:bg-primary/10 hover:text-primary",
                ].join(" ")}
                aria-label="Abrir mensajes"
                title="Mensajes"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </button>
            )}

            {isInitializing ? (
              <div className="h-11 w-11 animate-pulse rounded-full bg-border" />
            ) : isAuthenticated ? (
              <div
                ref={profileMenuRef}
                className="relative"
              >
                {/* Perfil */}
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(
                      (previous) =>
                        !previous,
                    )
                  }
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface"
                  aria-label="Abrir menú de perfil"
                  aria-expanded={
                    isProfileOpen
                  }
                >
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary/10 text-sm font-semibold text-primary shadow-sm transition hover:scale-105">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={`Perfil de ${fullName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : initials ? (
                      initials
                    ) : (
                      <UserCircleIcon className="h-8 w-8" />
                    )}
                  </span>

                  <ChevronDownIcon
                    className={[
                      "h-4 w-4 text-text-muted transition-transform",
                      isProfileOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>

                {/* Menú desplegable */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
                    <div className="border-b border-border p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                          {profilePhoto ? (
                            <img
                              src={profilePhoto}
                              alt={`Perfil de ${fullName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : initials ? (
                            initials
                          ) : (
                            <UserCircleIcon className="h-9 w-9" />
                          )}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text">
                            {fullName}
                          </p>

                          <p className="truncate text-sm text-text-muted">
                            {user?.email}
                          </p>

                          <p className="mt-1 text-xs font-medium text-primary">
                            {roleLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 p-2">
                      <button
                        type="button"
                        onClick={() =>
                          goTo(
                            primaryRole ===
                              "admin"
                              ? "/admin"
                              : "/dashboard",
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text transition hover:bg-primary/10"
                      >
                        <Squares2X2Icon className="h-5 w-5 text-text-muted" />

                        Panel principal
                      </button>

                      {primaryRole !==
                        "admin" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              goTo(
                                "/dashboard/perfil",
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text transition hover:bg-primary/10"
                          >
                            {primaryRole ===
                            "empresa" ? (
                              <BuildingOffice2Icon className="h-5 w-5 text-text-muted" />
                            ) : (
                              <UserCircleIcon className="h-5 w-5 text-text-muted" />
                            )}

                            {primaryRole ===
                            "empresa"
                              ? "Perfil de empresa"
                              : primaryRole ===
                                  "freelancer"
                                ? "Perfil profesional"
                                : "Mi perfil"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              goTo(
                                "/dashboard/resenas",
                              )
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-text transition hover:bg-primary/10"
                          >
                            <StarIcon className="h-5 w-5 text-text-muted" />

                            Reseñas
                          </button>
                        </>
                      )}
                    </div>

                    <div className="border-t border-border p-2">
                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        disabled={
                          isLoggingOut
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />

                        {isLoggingOut
                          ? "Cerrando sesión..."
                          : "Cerrar sesión"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="rounded-lg border border-border px-5 py-2 text-text transition hover:border-primary hover:text-primary"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goTo("/register")
                  }
                  className="rounded-lg bg-primary px-5 py-2 text-white transition hover:opacity-90"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Acciones móviles */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            {canUseNotifications && (
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(
                    (previous) =>
                      !previous,
                  );

                  setIsProfileOpen(false);
                  setIsOpen(false);
                }}
                className={[
                  "relative flex h-11 w-11 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-surface",
                  isNotificationsOpen ||
                  isNotificationsActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-text-muted hover:border-primary hover:bg-primary/10 hover:text-primary",
                ].join(" ")}
                aria-label="Abrir notificaciones"
                title="Notificaciones"
                aria-expanded={
                  isNotificationsOpen
                }
              >
                <BellIcon className="h-6 w-6" />

                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-surface bg-danger px-1 text-[10px] font-bold leading-none text-white">
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {canUseMessages && (
              <button
                type="button"
                onClick={() =>
                  goTo(
                    "/dashboard/mensajes",
                  )
                }
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border transition",
                  isMessagesActive
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary",
                ].join(" ")}
                aria-label="Abrir mensajes"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() =>
                  goTo(
                    "/dashboard/perfil",
                  )
                }
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary/10 text-xs font-semibold text-primary"
                aria-label="Ir al perfil"
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={`Perfil de ${fullName}`}
                    className="h-full w-full object-cover"
                  />
                ) : initials ? (
                  initials
                ) : (
                  <UserCircleIcon className="h-7 w-7" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (previous) =>
                    !previous,
                )
              }
              className="rounded-lg border border-border p-2 text-text transition hover:border-primary hover:text-primary"
              aria-label={
                isOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil y tablet */}
        {isOpen && (
          <div className="border-t border-border pb-5 pt-4 xl:hidden">
            {isAuthenticated && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-background p-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={`Perfil de ${fullName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : initials ? (
                    initials
                  ) : (
                    <UserCircleIcon className="h-8 w-8" />
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-medium text-text">
                    {fullName}
                  </p>

                  <p className="text-sm text-text-muted">
                    {roleLabel}
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              {mobileNavigationItems.map(
                (item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() =>
                      goTo(
                        item.path,
                      )
                    }
                    className={[
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
                      isActivePath(
                        item.path,
                      )
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-primary/10 hover:text-primary",
                    ].join(" ")}
                  >
                    {item.icon}

                    {item.label}
                  </button>
                ),
              )}
            </div>

            {!isAuthenticated ? (
              <div className="mt-4 grid gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="w-full rounded-lg border border-border px-5 py-3 text-text transition hover:border-primary hover:text-primary"
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={() =>
                    goTo(
                      "/register",
                    )
                  }
                  className="w-full rounded-lg bg-primary px-5 py-3 text-white transition hover:opacity-90"
                >
                  Registrarse
                </button>
              </div>
            ) : (
              <div className="mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    isLoggingOut
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />

                  {isLoggingOut
                    ? "Cerrando sesión..."
                    : "Cerrar sesión"}
                </button>
              </div>
            )}
          </div>
        )}
      </Container>

      <NotificationDropdown
        isOpen={
          isNotificationsOpen
        }
        onClose={() =>
          setIsNotificationsOpen(false)
        }
        onUnreadCountChange={
          setUnreadNotificationCount
        }
      />
      
    </header>
  );
}