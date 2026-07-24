import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import authApi from "../../../api/axios";

import {
  useAuth,
} from "../../../context/useAuth";

/*
|--------------------------------------------------------------------------
| Tipos
|--------------------------------------------------------------------------
*/

export type DashboardActivityType =
  | "contract"
  | "request"
  | "application"
  | "vacancy"
  | "service";

export interface DashboardActivityItem {
  id: string;
  type: DashboardActivityType;

  title: string;
  description: string;

  status:
    | string
    | null;

  createdAt: string;
  to: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;

  totalRequests: number;
  pendingRequests: number;

  totalConversations: number;
  unreadMessages: number;
  unreadNotifications: number;

  totalServices: number;
  activeServices: number;

  totalApplications: number;
  pendingApplications: number;

  totalVacancies: number;
  openVacancies: number;

  totalReviews: number;

  averageRating:
    | number
    | null;
}

interface DashboardServiceItem {
  id: number;
  title: string;

  is_active: boolean;

  created_at: string;
}

interface DashboardContractItem {
  id: number;
  status: string;

  created_at: string;

  contract_request?: {
    service?: {
      title?: string;
    } | null;
  } | null;
}

interface DashboardRequestItem {
  id: number;
  status: string;

  created_at: string;

  service?: {
    title?: string;
  } | null;
}

interface DashboardConversationItem {
  unread_count: number;
}

interface DashboardApplicationItem {
  id: number;
  status: string;

  created_at: string;

  vacancy?: {
    title?: string;
  } | null;
}

interface DashboardVacancyItem {
  id: number;
  title: string;
  status: string;

  created_at: string;
}

interface ContractsResponse {
  data: {
    contracts: DashboardContractItem[];
  };
}

interface ContractRequestsResponse {
  data: {
    contract_requests:
      DashboardRequestItem[];
  };
}

interface ConversationsResponse {
  data: {
    conversations:
      DashboardConversationItem[];
  };
}

interface UnreadNotificationsResponse {
  data: {
    unread_count: number;
  };
}

interface PublicReviewsResponse {
  data: {
    average_rating:
      | number
      | null;

    reviews_count: number;
  };
}

interface FreelancerProfileResponse {
  data: {
    profile: {
      id: number;

      average_rate:
        | string
        | number
        | null;

      services?:
        DashboardServiceItem[];
    };
  };
}

interface ApplicationsResponse {
  data: {
    applications:
      DashboardApplicationItem[];

    pagination?: {
      total: number;
    };
  };
}

interface VacanciesResponse {
  data: {
    vacancies:
      DashboardVacancyItem[];
  };
}

/*
|--------------------------------------------------------------------------
| Valores iniciales
|--------------------------------------------------------------------------
*/

const initialStats: DashboardStats = {
  totalContracts: 0,
  activeContracts: 0,
  completedContracts: 0,

  totalRequests: 0,
  pendingRequests: 0,

  totalConversations: 0,
  unreadMessages: 0,
  unreadNotifications: 0,

  totalServices: 0,
  activeServices: 0,

  totalApplications: 0,
  pendingApplications: 0,

  totalVacancies: 0,
  openVacancies: 0,

  totalReviews: 0,
  averageRating: null,
};

const roleLabels = {
  admin: "Administrador",
  cliente: "Cliente",
  freelancer: "Freelancer",
  empresa: "Empresa",
} as const;

/*
|--------------------------------------------------------------------------
| Ayudantes
|--------------------------------------------------------------------------
*/

function getDateTimestamp(
  value: string,
): number {
  const timestamp =
    new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function getFulfilledValue<T>(
  result: PromiseSettledResult<T>,
): T | null {
  return result.status ===
    "fulfilled"
    ? result.value
    : null;
}

/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
*/

export function useDashboardPage() {
  const navigate = useNavigate();

  const {
    user,
    primaryRole,
    logout,

    isClient,
    isFreelancer,
    isCompany,
  } = useAuth();

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const [
    stats,
    setStats,
  ] =
    useState<DashboardStats>(
      initialStats,
    );

  const [
    recentActivity,
    setRecentActivity,
  ] = useState<
    DashboardActivityItem[]
  >([]);

  const [
    isDashboardLoading,
    setIsDashboardLoading,
  ] = useState(true);

  const [
    isDashboardRefreshing,
    setIsDashboardRefreshing,
  ] = useState(false);

  const [
    dashboardError,
    setDashboardError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Información del usuario
  |--------------------------------------------------------------------------
  */

  const fullName =
    [
      user?.name,
      user?.last_name,
      user?.maternal_last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Usuario";

  const email =
    user?.email ??
    "Correo no disponible";

  const roleLabel =
    primaryRole
      ? roleLabels[primaryRole]
      : "Sin rol asignado";

  const profilePhoto =
    user?.profile_photo_url ||
    user?.profile_photo ||
    null;

  /*
  |--------------------------------------------------------------------------
  | Cargar información del dashboard
  |--------------------------------------------------------------------------
  */

  const loadDashboardData =
    useCallback(
      async (
        showInitialLoading = true,
      ): Promise<void> => {
        if (
          !user?.id ||
          !primaryRole ||
          primaryRole === "admin"
        ) {
          setStats(initialStats);
          setRecentActivity([]);
          setIsDashboardLoading(
            false,
          );

          return;
        }

        try {
          if (showInitialLoading) {
            setIsDashboardLoading(
              true,
            );
          } else {
            setIsDashboardRefreshing(
              true,
            );
          }

          setDashboardError(null);

          /*
          |--------------------------------------------------------------------------
          | Peticiones comunes
          |--------------------------------------------------------------------------
          */

          const [
            contractsResult,
            requestsResult,
            conversationsResult,
            notificationsResult,
            reviewsResult,
          ] = await Promise.allSettled([
            authApi.get<ContractsResponse>(
              "/contracts",
            ),

            authApi.get<ContractRequestsResponse>(
              "/contract-requests",
            ),

            authApi.get<ConversationsResponse>(
              "/messages/conversations",
            ),

            authApi.get<UnreadNotificationsResponse>(
              "/notifications/unread-count",
            ),

            authApi.get<PublicReviewsResponse>(
              `/public/reviews/user/${user.id}`,
              {
                params: {
                  page: 1,
                  per_page: 1,
                },
              },
            ),
          ]);

          const contractsResponse =
            getFulfilledValue(
              contractsResult,
            );

          const requestsResponse =
            getFulfilledValue(
              requestsResult,
            );

          const conversationsResponse =
            getFulfilledValue(
              conversationsResult,
            );

          const notificationsResponse =
            getFulfilledValue(
              notificationsResult,
            );

          const reviewsResponse =
            getFulfilledValue(
              reviewsResult,
            );

          const contracts =
            contractsResponse?.data
              .data.contracts ?? [];

          const contractRequests =
            requestsResponse?.data
              .data
              .contract_requests ??
            [];

          const conversations =
            conversationsResponse
              ?.data.data
              .conversations ?? [];

          const unreadMessages =
            conversations.reduce(
              (
                total,
                conversation,
              ) =>
                total +
                Number(
                  conversation.unread_count ??
                    0,
                ),
              0,
            );

          /*
          |--------------------------------------------------------------------------
          | Datos específicos por rol
          |--------------------------------------------------------------------------
          */

          let services:
            DashboardServiceItem[] =
            [];

          let applications:
            DashboardApplicationItem[] =
            [];

          let totalApplications = 0;

          let vacancies:
            DashboardVacancyItem[] =
            [];

          let profileAverage:
            | number
            | null = null;

          if (primaryRole === "freelancer") {
            const [
              profileResult,
              applicationsResult,
            ] =
              await Promise.allSettled([
                authApi.get<FreelancerProfileResponse>(
                  `/profiles/user/${user.id}`,
                ),

                authApi.get<ApplicationsResponse>(
                  "/applications/me",
                  {
                    params: {
                      page: 1,
                      per_page: 100,
                    },
                  },
                ),
              ]);

            const profileResponse =
              getFulfilledValue(
                profileResult,
              );

            const applicationsResponse =
              getFulfilledValue(
                applicationsResult,
              );

            services =
              profileResponse?.data
                .data.profile
                .services ?? [];

            applications =
              applicationsResponse
                ?.data.data
                .applications ?? [];

            totalApplications =
              applicationsResponse
                ?.data.data
                .pagination
                ?.total ??
              applications.length;

            const rawAverage =
              profileResponse?.data
                .data.profile
                .average_rate;

            if (
              rawAverage !== null &&
              rawAverage !== undefined
            ) {
              const numericAverage =
                Number(rawAverage);

              profileAverage =
                Number.isFinite(
                  numericAverage,
                )
                  ? numericAverage
                  : null;
            }
          }

          if (primaryRole === "empresa") {
            const [
              vacanciesResult,
              applicationsResult,
            ] =
              await Promise.allSettled([
                authApi.get<VacanciesResponse>(
                  "/vacancies/me",
                ),

                authApi.get<ApplicationsResponse>(
                  "/applications",
                  {
                    params: {
                      page: 1,
                      per_page: 100,
                    },
                  },
                ),
              ]);

            const vacanciesResponse =
              getFulfilledValue(
                vacanciesResult,
              );

            const applicationsResponse =
              getFulfilledValue(
                applicationsResult,
              );

            vacancies =
              vacanciesResponse?.data
                .data.vacancies ?? [];

            applications =
              applicationsResponse
                ?.data.data
                .applications ?? [];

            totalApplications =
              applicationsResponse
                ?.data.data
                .pagination
                ?.total ??
              applications.length;
          }

          /*
          |--------------------------------------------------------------------------
          | Estadísticas
          |--------------------------------------------------------------------------
          */

          const averageRating =
            reviewsResponse?.data
              .data.average_rating ??
            profileAverage;

          setStats({
            totalContracts:
              contracts.length,

            activeContracts:
              contracts.filter(
                (contract) =>
                  contract.status ===
                  "in_process",
              ).length,

            completedContracts:
              contracts.filter(
                (contract) =>
                  contract.status ===
                  "completed",
              ).length,

            totalRequests:
              contractRequests.length,

            pendingRequests:
              contractRequests.filter(
                (request) =>
                  request.status ===
                  "pending",
              ).length,

            totalConversations:
              conversations.length,

            unreadMessages,

            unreadNotifications:
              notificationsResponse
                ?.data.data
                .unread_count ?? 0,

            totalServices:
              services.length,

            activeServices:
              services.filter(
                (service) =>
                  service.is_active,
              ).length,

            totalApplications,

            pendingApplications:
              applications.filter(
                (application) =>
                  application.status ===
                  "pending",
              ).length,

            totalVacancies:
              vacancies.length,

            openVacancies:
              vacancies.filter(
                (vacancy) =>
                  vacancy.status ===
                  "open",
              ).length,

            totalReviews:
              reviewsResponse?.data
                .data.reviews_count ??
              0,

            averageRating:
              averageRating !== null &&
              averageRating !==
                undefined
                ? Number(
                    averageRating,
                  )
                : null,
          });

          /*
          |--------------------------------------------------------------------------
          | Actividad reciente
          |--------------------------------------------------------------------------
          */

          const contractActivity:
            DashboardActivityItem[] =
            contracts.map(
              (contract) => ({
                id: `contract-${contract.id}`,
                type: "contract",

                title: `Contrato #${contract.id}`,

                description:
                  contract
                    .contract_request
                    ?.service?.title ||
                  "Contrato formalizado",

                status:
                  contract.status,

                createdAt:
                  contract.created_at,

                to: "/dashboard/contratos",
              }),
            );

          const requestActivity:
            DashboardActivityItem[] =
            contractRequests.map(
              (request) => ({
                id: `request-${request.id}`,
                type: "request",

                title: `Solicitud #${request.id}`,

                description:
                  request.service
                    ?.title ||
                  "Solicitud de contratación",

                status:
                  request.status,

                createdAt:
                  request.created_at,

                to: "/dashboard/solicitudes",
              }),
            );

          const applicationActivity:
            DashboardActivityItem[] =
            applications.map(
              (application) => ({
                id: `application-${application.id}`,
                type:
                  "application",

                title: `Postulación #${application.id}`,

                description:
                  application
                    .vacancy
                    ?.title ||
                  "Postulación a vacante",

                status:
                  application.status,

                createdAt:
                  application.created_at,

                to: "/dashboard/postulaciones",
              }),
            );

          const vacancyActivity:
            DashboardActivityItem[] =
            vacancies.map(
              (vacancy) => ({
                id: `vacancy-${vacancy.id}`,
                type: "vacancy",

                title:
                  vacancy.title,

                description:
                  "Vacante publicada",

                status:
                  vacancy.status,

                createdAt:
                  vacancy.created_at,

                to: "/dashboard/vacantes",
              }),
            );

          const serviceActivity:
            DashboardActivityItem[] =
            services.map(
              (service) => ({
                id: `service-${service.id}`,
                type: "service",

                title:
                  service.title,

                description:
                  "Servicio profesional",

                status:
                  service.is_active
                    ? "active"
                    : "inactive",

                createdAt:
                  service.created_at,

                to: "/dashboard/servicios",
              }),
            );

          const combinedActivity = [
            ...contractActivity,
            ...requestActivity,
            ...applicationActivity,
            ...vacancyActivity,
            ...serviceActivity,
          ]
            .sort(
              (
                firstItem,
                secondItem,
              ) =>
                getDateTimestamp(
                  secondItem.createdAt,
                ) -
                getDateTimestamp(
                  firstItem.createdAt,
                ),
            )
            .slice(0, 6);

          setRecentActivity(
            combinedActivity,
          );

          const commonResults = [
            contractsResult,
            requestsResult,
            conversationsResult,
            notificationsResult,
          ];

          const failedCommonRequests =
            commonResults.filter(
              (result) =>
                result.status ===
                "rejected",
            ).length;

          if (
            failedCommonRequests ===
            commonResults.length
          ) {
            setDashboardError(
              "No se pudo cargar la información del dashboard.",
            );
          } else if (
            failedCommonRequests > 0
          ) {
            setDashboardError(
              "Algunos datos del dashboard no pudieron cargarse.",
            );
          }
        } catch (requestError) {
          console.error(
            "Error al cargar el dashboard:",
            requestError,
          );

          setDashboardError(
            "No se pudo cargar la información del dashboard.",
          );
        } finally {
          setIsDashboardLoading(
            false,
          );

          setIsDashboardRefreshing(
            false,
          );
        }
      },
      [
        primaryRole,
        user?.id,
      ],
    );

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  /*
  |--------------------------------------------------------------------------
  | Recargar información
  |--------------------------------------------------------------------------
  */

  const reloadDashboard =
    useCallback(
      async (): Promise<void> => {
        await loadDashboardData(
          false,
        );
      },
      [loadDashboardData],
    );

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const hasRecentActivity =
    useMemo(
      () =>
        recentActivity.length >
        0,
      [recentActivity],
    );

  /*
  |--------------------------------------------------------------------------
  | Cerrar sesión
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    async (): Promise<void> => {
      if (isLoggingOut) {
        return;
      }

      try {
        setIsLoggingOut(true);

        // Navigate to home first to avoid PrivateRoute redirecting to /login
        navigate("/", { replace: true });

        await logout();
      } finally {
        setIsLoggingOut(false);
      }
    };

  return {
    user,

    fullName,
    email,
    profilePhoto,

    primaryRole,
    roleLabel,

    isClient,
    isFreelancer,
    isCompany,

    stats,
    recentActivity,
    hasRecentActivity,

    isDashboardLoading,
    isDashboardRefreshing,
    dashboardError,

    reloadDashboard,

    handleLogout,
    isLoggingOut,
  };
}