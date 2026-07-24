import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../../context/useAuth";

import type { Freelancer } from "../../freelancers/models/freelancer";
import { getFreelancers } from "../../freelancers/services/freelancerService";

import type { FreelancerService } from "../../services/models/service";
import { getPublicServices } from "../../services/services/serviceService";

import type { Vacancy } from "../../vacancies/models/vacancy";
import { getPublicVacancies } from "../../vacancies/services/vacancyService";

export type DashboardFeedItem =
  | {
      id: string;
      type: "freelancer";
      createdAt: string;
      data: Freelancer;
    }
  | {
      id: string;
      type: "service";
      createdAt: string;
      data: FreelancerService;
    }
  | {
      id: string;
      type: "vacancy";
      createdAt: string;
      data: Vacancy;
    };

export function useDashboardFeed() {
  const {
    user,
    isFreelancer,
  } = useAuth();

  const [
    freelancers,
    setFreelancers,
  ] = useState<Freelancer[]>([]);

  const [
    services,
    setServices,
  ] = useState<FreelancerService[]>([]);

  const [
    vacancies,
    setVacancies,
  ] = useState<Vacancy[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("Todos");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadFeed = useCallback(
    async (
      showInitialLoading = true,
    ): Promise<void> => {
      try {
        if (showInitialLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const [
          freelancersResult,
          servicesResult,
          vacanciesResult,
        ] = await Promise.allSettled([
          getFreelancers(),
          getPublicServices(),

          isFreelancer
            ? getPublicVacancies({
                page: 1,
                per_page: 20,
              })
            : Promise.resolve(null),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Freelancers
        |--------------------------------------------------------------------------
        */

        if (
          freelancersResult.status ===
          "fulfilled"
        ) {
          setFreelancers(
            freelancersResult.value.filter(
              (freelancer) =>
                freelancer.userId !==
                user?.id,
            ),
          );
        } else {
          setFreelancers([]);
        }

        /*
        |--------------------------------------------------------------------------
        | Servicios
        |--------------------------------------------------------------------------
        */

        if (
          servicesResult.status ===
          "fulfilled"
        ) {
          setServices(
            servicesResult.value.filter(
              (service) => {
                if (!service.is_active) {
                  return false;
                }

                if (!isFreelancer) {
                  return true;
                }

                return (
                  service
                    .freelancer_profile
                    ?.user_id !== user?.id
                );
              },
            ),
          );
        } else {
          setServices([]);
        }

        /*
        |--------------------------------------------------------------------------
        | Vacantes
        |--------------------------------------------------------------------------
        */

        if (!isFreelancer) {
          setVacancies([]);
        } else if (
          vacanciesResult.status ===
            "fulfilled" &&
          vacanciesResult.value
        ) {
          setVacancies(
            vacanciesResult.value.data.vacancies.filter(
              (vacancy) =>
                vacancy.status === "open",
            ),
          );
        } else {
          setVacancies([]);
        }

        /*
        |--------------------------------------------------------------------------
        | Errores parciales
        |--------------------------------------------------------------------------
        */

        const failedRequests = [
          freelancersResult.status ===
            "rejected",

          servicesResult.status ===
            "rejected",

          isFreelancer &&
            vacanciesResult.status ===
              "rejected",
        ].filter(Boolean).length;

        const totalRequests =
          isFreelancer ? 3 : 2;

        if (
          failedRequests ===
          totalRequests
        ) {
          setError(
            "No se pudo cargar el contenido del inicio.",
          );
        } else if (
          failedRequests > 0
        ) {
          setError(
            "Parte del contenido no pudo cargarse.",
          );
        }
      } catch (requestError) {
        console.error(
          "Error al cargar el feed:",
          requestError,
        );

        setFreelancers([]);
        setServices([]);
        setVacancies([]);

        setError(
          "No se pudo cargar el contenido del inicio.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      isFreelancer,
      user?.id,
    ],
  );

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  /*
  |--------------------------------------------------------------------------
  | Categorías disponibles
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const serviceCategories =
      services
        .map((service) =>
          service.category.trim(),
        )
        .filter(Boolean);

    const freelancerSpecialties =
      freelancers
        .map((freelancer) =>
          freelancer.profession.trim(),
        )
        .filter(Boolean);

    const vacancyCategories =
      vacancies
        .map((vacancy) =>
          vacancy.category.trim(),
        )
        .filter(Boolean);

    return [
      "Todos",

      ...Array.from(
        new Set([
          ...serviceCategories,
          ...freelancerSpecialties,
          ...vacancyCategories,
        ]),
      ).sort((first, second) =>
        first.localeCompare(
          second,
          "es",
        ),
      ),
    ];
  }, [
    freelancers,
    services,
    vacancies,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Contenido filtrado
  |--------------------------------------------------------------------------
  */

  const feedItems =
    useMemo<DashboardFeedItem[]>(
      () => {
        const normalizedSearch =
          search
            .trim()
            .toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | Filtrar freelancers
        |--------------------------------------------------------------------------
        */

        const filteredFreelancers =
          freelancers.filter(
            (freelancer) => {
              const searchableContent =
                [
                  freelancer.name,
                  freelancer.profession,
                  freelancer.description,
                  freelancer.location,
                  freelancer.serviceArea,
                  ...(
                    freelancer.languages ??
                    []
                  ),
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();

              const matchesSearch =
                normalizedSearch ===
                  "" ||
                searchableContent.includes(
                  normalizedSearch,
                );

              const matchesCategory =
                selectedCategory ===
                  "Todos" ||
                freelancer.profession ===
                  selectedCategory;

              return (
                matchesSearch &&
                matchesCategory
              );
            },
          );

        /*
        |--------------------------------------------------------------------------
        | Filtrar servicios
        |--------------------------------------------------------------------------
        */

        const filteredServices =
          services.filter((service) => {
            const freelancerName =
              [
                service
                  .freelancer_profile
                  ?.user?.name,

                service
                  .freelancer_profile
                  ?.user?.last_name,

                service
                  .freelancer_profile
                  ?.user
                  ?.maternal_last_name,
              ]
                .filter(Boolean)
                .join(" ");

            const searchableContent =
              [
                service.title,
                service.description,
                service.category,
                service.location,
                freelancerName,

                service
                  .freelancer_profile
                  ?.specialty,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
              normalizedSearch ===
                "" ||
              searchableContent.includes(
                normalizedSearch,
              );

            const matchesCategory =
              selectedCategory ===
                "Todos" ||
              service.category ===
                selectedCategory;

            return (
              matchesSearch &&
              matchesCategory
            );
          });

        /*
        |--------------------------------------------------------------------------
        | Filtrar vacantes
        |--------------------------------------------------------------------------
        */

        const filteredVacancies =
          vacancies.filter((vacancy) => {
            const companyName =
              vacancy.company_profile
                ?.company_name ?? "";

            const companyIndustry =
              vacancy.company_profile
                ?.industry ?? "";

            const searchableContent =
              [
                vacancy.title,
                vacancy.description,
                vacancy.category,
                vacancy.location,
                companyName,
                companyIndustry,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
              normalizedSearch ===
                "" ||
              searchableContent.includes(
                normalizedSearch,
              );

            const matchesCategory =
              selectedCategory ===
                "Todos" ||
              vacancy.category ===
                selectedCategory;

            return (
              matchesSearch &&
              matchesCategory
            );
          });

        /*
        |--------------------------------------------------------------------------
        | Adaptar publicaciones
        |--------------------------------------------------------------------------
        */

        const freelancerItems:
          DashboardFeedItem[] =
          filteredFreelancers.map(
            (freelancer) => ({
              id:
                `freelancer-${freelancer.id}`,

              type: "freelancer",

              createdAt:
                freelancer.createdAt ??
                new Date(
                  0,
                ).toISOString(),

              data: freelancer,
            }),
          );

        const serviceItems:
          DashboardFeedItem[] =
          filteredServices.map(
            (service) => ({
              id:
                `service-${service.id}`,

              type: "service",

              createdAt:
                service.created_at,

              data: service,
            }),
          );

        const vacancyItems:
          DashboardFeedItem[] =
          filteredVacancies.map(
            (vacancy) => ({
              id:
                `vacancy-${vacancy.id}`,

              type: "vacancy",

              createdAt:
                vacancy.created_at,

              data: vacancy,
            }),
          );

        return [
          ...freelancerItems,
          ...serviceItems,
          ...vacancyItems,
        ].sort(
          (
            firstItem,
            secondItem,
          ) =>
            new Date(
              secondItem.createdAt,
            ).getTime() -
            new Date(
              firstItem.createdAt,
            ).getTime(),
        );
      },
      [
        freelancers,
        services,
        vacancies,
        search,
        selectedCategory,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Acciones
  |--------------------------------------------------------------------------
  */

  const clearFilters =
    useCallback(() => {
      setSearch("");
      setSelectedCategory(
        "Todos",
      );
    }, []);

  const reloadFeed =
    useCallback(async () => {
      await loadFeed(false);
    }, [loadFeed]);

  return {
    feedItems,

    freelancers,
    services,
    vacancies,

    search,
    setSearch,

    selectedCategory,
    setSelectedCategory,
    categories,

    loading,
    refreshing,
    error,

    hasActiveFilters:
      search.trim() !== "" ||
      selectedCategory !==
        "Todos",

    clearFilters,
    reloadFeed,
  };
}