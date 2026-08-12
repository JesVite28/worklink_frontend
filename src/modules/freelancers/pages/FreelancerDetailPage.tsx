import {
    ArrowLeftIcon,
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    FolderOpenIcon,
    GlobeAltIcon,
    LanguageIcon,
    LinkIcon,
    MapPinIcon,
    UserCircleIcon,
    WrenchScrewdriverIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

import { StarIcon } from "@heroicons/react/24/solid";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { useAuth } from "../../../context/useAuth";
import { useLoginModal } from "../../../context/LoginModalContext";

import PublicBriefcaseCard from "../components/PublicBriefcaseCard";
import PublicBriefcaseDetail from "../components/PublicBriefcaseDetail";
import PublicServiceCard from "../components/PublicServiceCard";

import useFreelancerDetail from "../hooks/useFreelancerDetail";

import ReviewStars from "../../reviews/components/ReviewStars";

import {
    getPublicReviewsByFreelancer,
} from "../../reviews/services/reviewService";

import type {
    Review,
    ReviewPagination,
} from "../../reviews/models/review";

import type {
    ProfessionalLinks,
    WorkMode,
} from "../models/freelancer";

interface ProfessionalLinkItem {
    label: string;
    url: string;
}

const workModeLabels: Record<
    WorkMode,
    string
> = {
    remote: "Trabajo remoto",
    on_site: "Trabajo presencial",
    hybrid: "Trabajo híbrido",
    home_service: "Servicio a domicilio",
};

function normalizeUrl(
    value: string,
): string {
    const normalizedValue =
        value.trim();

    if (
        normalizedValue.startsWith(
            "http://",
        ) ||
        normalizedValue.startsWith(
            "https://",
        )
    ) {
        return normalizedValue;
    }

    return `https://${normalizedValue}`;
}

function formatDate(
    value?: string,
): string {
    if (!value) {
        return "Fecha no disponible";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        },
    ).format(date);
}

function getProfessionalLinks(
    links?: ProfessionalLinks | null,
): ProfessionalLinkItem[] {
    if (!links) {
        return [];
    }

    const possibleLinks = [
        {
            label: "Sitio web",
            url: links.website,
        },
        {
            label: "Portafolio externo",
            url: links.portfolio_url,
        },
        {
            label: "LinkedIn",
            url: links.linkedin,
        },
        {
            label: "GitHub",
            url: links.github,
        },
        {
            label: "Facebook",
            url: links.facebook,
        },
        {
            label: "Instagram",
            url: links.instagram,
        },
    ];

    return possibleLinks.filter(
        (
            item,
        ): item is ProfessionalLinkItem =>
            typeof item.url ===
                "string" &&
            item.url.trim().length >
                0,
    );
}

export default function FreelancerDetailPage() {
    const navigate =
        useNavigate();

    const {
        profileId,
    } = useParams();

    /*
    |--------------------------------------------------------------------------
    | Sesión y autenticación
    |--------------------------------------------------------------------------
    */

    const {
        user,
        isAuthenticated,
    } = useAuth();

    const {
        openLoginModal,
    } = useLoginModal();

    /*
    |--------------------------------------------------------------------------
    | Reseñas públicas
    |--------------------------------------------------------------------------
    */

    const [
        publicReviews,
        setPublicReviews,
    ] = useState<Review[]>([]);

    const [
        reviewsPagination,
        setReviewsPagination,
    ] =
        useState<ReviewPagination | null>(
            null,
        );

    const [
        averageRating,
        setAverageRating,
    ] = useState<number | null>(
        null,
    );

    const [
        reviewsCount,
        setReviewsCount,
    ] = useState(0);

    const [
        reviewsPage,
        setReviewsPage,
    ] = useState(1);

    const [
        isReviewsLoading,
        setIsReviewsLoading,
    ] = useState(false);

    const [
        reviewsError,
        setReviewsError,
    ] = useState<string | null>(
        null,
    );

    /*
    |--------------------------------------------------------------------------
    | Freelancer
    |--------------------------------------------------------------------------
    */

    const {
        freelancer,
        services,
        briefcases,

        hasServices,
        servicesCount,

        hasBriefcases,
        briefcasesCount,

        isAvailable,

        languages:
            displayedLanguages,

        links:
            professionalLinks,

        isLoading,

        notFound:
            isNotFound,

        error,

        selectedBriefcase,
        isBriefcaseDetailLoading,
        briefcaseDetailError,

        openBriefcaseDetail,
        closeBriefcaseDetail,

        reload:
            reloadFreelancerDetail,
    } = useFreelancerDetail();

    /*
    |--------------------------------------------------------------------------
    | Cargar reseñas
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const parsedProfileId =
            Number(profileId);

        if (
            !Number.isInteger(
                parsedProfileId,
            ) ||
            parsedProfileId <= 0
        ) {
            return;
        }

        let isMounted = true;

        const loadReviews =
            async (): Promise<void> => {
                try {
                    setIsReviewsLoading(
                        true,
                    );

                    setReviewsError(
                        null,
                    );

                    const response =
                        await getPublicReviewsByFreelancer(
                            parsedProfileId,
                            reviewsPage,
                            6,
                        );

                    if (!isMounted) {
                        return;
                    }

                    setPublicReviews(
                        response.data
                            .reviews,
                    );

                    setReviewsPagination(
                        response.data
                            .pagination,
                    );

                    setAverageRating(
                        response.data
                            .average_rating,
                    );

                    setReviewsCount(
                        response.data
                            .reviews_count,
                    );
                } catch {
                    if (
                        isMounted
                    ) {
                        setReviewsError(
                            "No se pudieron cargar las reseñas del freelancer.",
                        );
                    }
                } finally {
                    if (
                        isMounted
                    ) {
                        setIsReviewsLoading(
                            false,
                        );
                    }
                }
            };

        void loadReviews();

        return () => {
            isMounted = false;
        };
    }, [
        profileId,
        reviewsPage,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Carga
    |--------------------------------------------------------------------------
    */

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div className="h-10 w-40 animate-pulse rounded-xl bg-border" />

                        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
                            <div className="h-40 animate-pulse bg-border sm:h-52" />

                            <div className="relative px-5 pb-8 sm:px-8">
                                <div className="-mt-16 h-32 w-32 animate-pulse rounded-2xl border-4 border-surface bg-border" />

                                <div className="mt-6 h-9 w-72 max-w-full animate-pulse rounded bg-border" />

                                <div className="mt-4 h-5 w-48 animate-pulse rounded bg-border" />

                                <div className="mt-6 h-20 max-w-3xl animate-pulse rounded-xl bg-border" />
                            </div>
                        </section>

                        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({
                                length: 4,
                            }).map(
                                (
                                    _,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="h-28 animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
                                    >
                                        <div className="h-5 w-24 rounded bg-border" />

                                        <div className="mt-4 h-6 w-36 rounded bg-border" />
                                    </article>
                                ),
                            )}
                        </section>

                        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({
                                length: 3,
                            }).map(
                                (
                                    _,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="h-[460px] animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-border" />

                                        <div className="mt-5 h-6 w-3/4 rounded bg-border" />

                                        <div className="mt-5 h-20 rounded-xl bg-border" />

                                        <div className="mt-5 h-32 rounded-xl bg-border" />

                                        <div className="mt-6 h-12 rounded-xl bg-border" />
                                    </article>
                                ),
                            )}
                        </section>
                    </div>
                </div>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Perfil no encontrado
    |--------------------------------------------------------------------------
    */

    if (
        isNotFound ||
        !freelancer
    ) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
                <section className="w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 text-center shadow-card sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                        <UserCircleIcon className="h-8 w-8" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-text">
                        Perfil no disponible
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-muted">
                        {error ||
                            "El perfil solicitado no existe o dejó de estar disponible públicamente."}
                    </p>

                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            to="/freelancers"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />

                            Explorar freelancers
                        </Link>

                        {!isNotFound && (
                            <button
                                type="button"
                                onClick={() =>
                                    void reloadFreelancerDetail()
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 font-semibold text-text transition hover:border-primary/40 hover:text-primary"
                            >
                                <ArrowPathIcon className="h-5 w-5" />

                                Intentar de nuevo
                            </button>
                        )}
                    </div>
                </section>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
                <section className="w-full max-w-2xl rounded-3xl border border-danger/30 bg-danger/5 p-6 text-center shadow-card sm:p-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                        <ExclamationTriangleIcon className="h-8 w-8" />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-text">
                        No se pudo cargar
                        el perfil
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-text-muted">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            void reloadFreelancerDetail()
                        }
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                    >
                        <ArrowPathIcon className="h-5 w-5" />

                        Intentar de nuevo
                    </button>
                </section>
            </main>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Información calculada
    |--------------------------------------------------------------------------
    */

    const professionalLinkItems =
        getProfessionalLinks(
            professionalLinks,
        );

    const formattedWorkMode =
        freelancer.workMode
            ? workModeLabels[
                  freelancer.workMode
              ]
            : "Modalidad no especificada";

    /*
    |--------------------------------------------------------------------------
    | Mensajería
    |--------------------------------------------------------------------------
    */

    const isOwnProfile =
        user?.id ===
        freelancer.userId;

    const handleSendMessage =
        (): void => {
            const messagesPath =
                `/dashboard/mensajes?user=${freelancer.userId}`;

            /*
             * Si no hay sesión, abrimos el
             * login indicando el destino.
             */
            if (
                !isAuthenticated
            ) {
                openLoginModal(
                    messagesPath,
                );

                return;
            }

            /*
             * No permitimos iniciar un chat
             * con la misma cuenta.
             */
            if (isOwnProfile) {
                return;
            }

            navigate(
                messagesPath,
            );
        };

    return (
        <>
            <main className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Regresar */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />

                        Regresar
                    </button>

                    {/* Encabezado */}
                    <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-card">
                        {/* Área morada */}
                        <div className="relative bg-gradient-to-r from-primary to-secondary px-5 pb-8 pt-10 text-white sm:px-8 sm:pb-10 sm:pt-14">
                            <div className="absolute inset-0 bg-black/10" />

                            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end">
                                {/* Fotografía */}
                                <img
                                    src={
                                        freelancer.image
                                    }
                                    alt={`Perfil de ${freelancer.name}`}
                                    className="h-32 w-32 shrink-0 rounded-2xl border-4 border-white/90 bg-background object-cover shadow-xl sm:h-40 sm:w-40"
                                />

                                {/* Información principal */}
                                <div className="min-w-0 flex-1 pb-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="break-words text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                                            {
                                                freelancer.name
                                            }
                                        </h1>

                                        <span
                                            className={[
                                                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm",

                                                isAvailable
                                                    ? "border-white/20 bg-success/90 text-white"
                                                    : "border-white/20 bg-black/20 text-white/80",
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {isAvailable ? (
                                                <CheckCircleIcon className="h-4 w-4" />
                                            ) : (
                                                <XCircleIcon className="h-4 w-4" />
                                            )}

                                            {isAvailable
                                                ? "Disponible"
                                                : "No disponible"}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-lg font-semibold text-white/90">
                                        {
                                            freelancer.profession
                                        }
                                    </p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPinIcon className="h-4 w-4" />

                                            {
                                                freelancer.location
                                            }
                                        </span>

                                        <span className="inline-flex items-center gap-1.5">
                                            <StarIcon className="h-4 w-4 text-yellow-300" />

                                            {freelancer.rating.toFixed(
                                                1,
                                            )}{" "}
                                            de
                                            calificación
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Área blanca */}
                        <div className="px-5 py-7 sm:px-8 sm:py-8">
                            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                                {/* Descripción */}
                                <div className="min-w-0">
                                    <h2 className="text-lg font-semibold text-text">
                                        Acerca del
                                        freelancer
                                    </h2>

                                    <p className="mt-3 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-text-muted">
                                        {freelancer.description ||
                                            "El freelancer no agregó una descripción profesional."}
                                    </p>
                                </div>

                                {/* Tarifa y mensaje */}
                                <div className="w-full space-y-3 lg:w-auto lg:min-w-[280px]">
                                    {/* Tarifa */}
                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 lg:text-right">
                                        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                            Tarifa
                                            profesional
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                                            {
                                                freelancer.price
                                            }
                                        </p>
                                    </div>

                                    {/* Enviar mensaje */}
                                    {!isOwnProfile && (
                                        <button
                                            type="button"
                                            onClick={
                                                handleSendMessage
                                            }
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
                                        >
                                            <ChatBubbleLeftRightIcon className="h-5 w-5" />

                                            Enviar
                                            mensaje
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Información profesional */}
                    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <BriefcaseIcon className="h-6 w-6" />
                            </div>

                            <p className="mt-4 text-sm font-medium text-text-muted">
                                Modalidad
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {
                                    formattedWorkMode
                                }
                            </p>
                        </article>

                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <WrenchScrewdriverIcon className="h-6 w-6" />
                            </div>

                            <p className="mt-4 text-sm font-medium text-text-muted">
                                Experiencia
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {freelancer.experience ||
                                    "No especificada"}
                            </p>
                        </article>

                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <GlobeAltIcon className="h-6 w-6" />
                            </div>

                            <p className="mt-4 text-sm font-medium text-text-muted">
                                Área de servicio
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {freelancer.serviceArea ||
                                    "No especificada"}
                            </p>
                        </article>

                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CalendarDaysIcon className="h-6 w-6" />
                            </div>

                            <p className="mt-4 text-sm font-medium text-text-muted">
                                Miembro desde
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {formatDate(
                                    freelancer.createdAt,
                                )}
                            </p>
                        </article>
                    </section>

                    {/* Idiomas y enlaces */}
                    <section className="mt-8 grid gap-6 lg:grid-cols-2">
                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <LanguageIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-text">
                                        Idiomas
                                    </h2>

                                    <p className="mt-1 text-sm text-text-muted">
                                        Idiomas
                                        indicados
                                        por el
                                        freelancer.
                                    </p>
                                </div>
                            </div>

                            {displayedLanguages.length >
                            0 ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {displayedLanguages.map(
                                        (
                                            language,
                                        ) => (
                                            <span
                                                key={
                                                    language
                                                }
                                                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
                                            >
                                                {
                                                    language
                                                }
                                            </span>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="mt-5 text-sm text-text-muted">
                                    No se
                                    especificaron
                                    idiomas.
                                </p>
                            )}
                        </article>

                        <article className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <LinkIcon className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-text">
                                        Enlaces
                                        profesionales
                                    </h2>

                                    <p className="mt-1 text-sm text-text-muted">
                                        Sitios y redes
                                        profesionales.
                                    </p>
                                </div>
                            </div>

                            {professionalLinkItems.length >
                            0 ? (
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {professionalLinkItems.map(
                                        (
                                            link,
                                        ) => (
                                            <a
                                                key={`${link.label}-${link.url}`}
                                                href={normalizeUrl(
                                                    link.url,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-text transition hover:border-primary/40 hover:text-primary"
                                            >
                                                <span className="truncate">
                                                    {
                                                        link.label
                                                    }
                                                </span>

                                                <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0" />
                                            </a>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="mt-5 text-sm text-text-muted">
                                    No se
                                    agregaron
                                    enlaces
                                    profesionales.
                                </p>
                            )}
                        </article>
                    </section>

                    {/* Servicios */}
                    <section className="mt-10">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    Servicios
                                    profesionales
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-text">
                                    Servicios
                                    publicados
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                                    Consulta los
                                    servicios
                                    disponibles y
                                    envía una
                                    solicitud de
                                    contratación
                                    con los
                                    detalles de tu
                                    proyecto.
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-muted">
                                <BriefcaseIcon className="h-4 w-4" />

                                {
                                    servicesCount
                                }{" "}
                                {servicesCount ===
                                1
                                    ? "servicio"
                                    : "servicios"}
                            </span>
                        </div>

                        {hasServices ? (
                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {services.map(
                                    (
                                        service,
                                    ) => (
                                        <PublicServiceCard
                                            key={
                                                service.id
                                            }
                                            service={
                                                service
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-card">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <BriefcaseIcon className="h-8 w-8" />
                                </div>

                                <h3 className="mt-5 text-xl font-semibold text-text">
                                    Sin servicios
                                    disponibles
                                </h3>

                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                                    Este
                                    freelancer
                                    todavía no
                                    tiene
                                    servicios
                                    activos
                                    disponibles
                                    para
                                    contratación.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Portafolio */}
                    <section className="mt-12">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    Trabajo
                                    realizado
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-text">
                                    Portafolio
                                    profesional
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                                    Explora los
                                    proyectos y
                                    trabajos
                                    publicados por
                                    este
                                    freelancer.
                                </p>
                            </div>

                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-muted">
                                <FolderOpenIcon className="h-4 w-4" />

                                {
                                    briefcasesCount
                                }{" "}
                                {briefcasesCount ===
                                1
                                    ? "proyecto"
                                    : "proyectos"}
                            </span>
                        </div>

                        {hasBriefcases ? (
                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {briefcases.map(
                                    (
                                        briefcase,
                                    ) => (
                                        <PublicBriefcaseCard
                                            key={
                                                briefcase.id
                                            }
                                            briefcase={
                                                briefcase
                                            }
                                            onView={
                                                openBriefcaseDetail
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-card">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <FolderOpenIcon className="h-8 w-8" />
                                </div>

                                <h3 className="mt-5 text-xl font-semibold text-text">
                                    Sin proyectos
                                    publicados
                                </h3>

                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                                    Este
                                    freelancer
                                    todavía no ha
                                    agregado
                                    proyectos a
                                    su portafolio
                                    público.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Calificaciones y reseñas */}
                    <section className="mt-12">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    Experiencias
                                    verificadas
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-text">
                                    Calificaciones
                                    y reseñas
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                                    Opiniones
                                    publicadas por
                                    clientes y
                                    empresas
                                    después de
                                    completar un
                                    contrato.
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-3 rounded-2xl border border-warning/20 bg-warning/5 px-4 py-3">
                                <StarIcon className="h-7 w-7 text-warning" />

                                <div>
                                    <p className="text-xl font-bold text-text">
                                        {(averageRating ??
                                            freelancer.rating
                                        ).toFixed(
                                            1,
                                        )}
                                        /5
                                    </p>

                                    <p className="text-xs text-text-muted">
                                        {reviewsCount ===
                                        1
                                            ? "1 reseña"
                                            : `${reviewsCount} reseñas`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isReviewsLoading ? (
                            <div className="mt-6 grid gap-5 md:grid-cols-2">
                                {Array.from({
                                    length: 4,
                                }).map(
                                    (
                                        _,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                index
                                            }
                                            className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
                                        >
                                            <div className="flex gap-3">
                                                <div className="h-12 w-12 rounded-full bg-border" />

                                                <div className="flex-1">
                                                    <div className="h-4 w-40 rounded bg-border" />

                                                    <div className="mt-2 h-3 w-24 rounded bg-border" />
                                                </div>
                                            </div>

                                            <div className="mt-5 h-4 w-full rounded bg-border" />

                                            <div className="mt-2 h-4 w-3/4 rounded bg-border" />
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : reviewsError ? (
                            <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center">
                                <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-danger" />

                                <p className="mt-3 text-sm text-text-muted">
                                    {
                                        reviewsError
                                    }
                                </p>
                            </div>
                        ) : publicReviews.length >
                          0 ? (
                            <>
                                <div className="mt-6 grid gap-5 md:grid-cols-2">
                                    {publicReviews.map(
                                        (
                                            review,
                                        ) => {
                                            const evaluator =
                                                review.evaluator;

                                            const evaluatorName =
                                                evaluator
                                                    ? [
                                                          evaluator.name,
                                                          evaluator.last_name,
                                                      ]
                                                          .filter(
                                                              Boolean,
                                                          )
                                                          .join(
                                                              " ",
                                                          )
                                                    : "Usuario de WorkLink";

                                            const initials =
                                                evaluator
                                                    ? [
                                                          evaluator.name?.charAt(
                                                              0,
                                                          ),
                                                          evaluator.last_name?.charAt(
                                                              0,
                                                          ),
                                                      ]
                                                          .filter(
                                                              Boolean,
                                                          )
                                                          .join(
                                                              "",
                                                          )
                                                          .toUpperCase()
                                                    : "";

                                            return (
                                                <article
                                                    key={
                                                        review.id
                                                    }
                                                    className="rounded-2xl border border-border bg-surface p-5 shadow-card"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
                                                            {evaluator?.profile_photo_url ? (
                                                                <img
                                                                    src={
                                                                        evaluator.profile_photo_url
                                                                    }
                                                                    alt={`Perfil de ${evaluatorName}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : initials ? (
                                                                initials
                                                            ) : (
                                                                <UserCircleIcon className="h-8 w-8" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-semibold text-text">
                                                                {
                                                                    evaluatorName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs capitalize text-text-muted">
                                                                {evaluator?.role ??
                                                                    "Usuario"}
                                                            </p>

                                                            <div className="mt-2">
                                                                <ReviewStars
                                                                    value={
                                                                        review.rating
                                                                    }
                                                                    size="sm"
                                                                    showValue
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
                                                        {review.comment ||
                                                            "El usuario dejó una calificación sin comentario."}
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-text-muted">
                                                        <span>
                                                            {review
                                                                .service
                                                                ?.title ??
                                                                "Contrato completado"}
                                                        </span>

                                                        <span>
                                                            {formatDate(
                                                                review.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </article>
                                            );
                                        },
                                    )}
                                </div>

                                {reviewsPagination &&
                                    reviewsPagination.last_page >
                                        1 && (
                                        <div className="mt-6 flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setReviewsPage(
                                                        (
                                                            currentPage,
                                                        ) =>
                                                            Math.max(
                                                                currentPage -
                                                                    1,
                                                                1,
                                                            ),
                                                    )
                                                }
                                                disabled={
                                                    reviewsPage <=
                                                        1 ||
                                                    isReviewsLoading
                                                }
                                                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Anterior
                                            </button>

                                            <span className="text-sm text-text-muted">
                                                Página{" "}
                                                <strong className="text-text">
                                                    {
                                                        reviewsPagination.current_page
                                                    }
                                                </strong>{" "}
                                                de{" "}
                                                <strong className="text-text">
                                                    {
                                                        reviewsPagination.last_page
                                                    }
                                                </strong>
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setReviewsPage(
                                                        (
                                                            currentPage,
                                                        ) =>
                                                            Math.min(
                                                                currentPage +
                                                                    1,
                                                                reviewsPagination.last_page,
                                                            ),
                                                    )
                                                }
                                                disabled={
                                                    reviewsPage >=
                                                        reviewsPagination.last_page ||
                                                    isReviewsLoading
                                                }
                                                className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    )}
                            </>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface px-5 py-12 text-center shadow-card">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning">
                                    <StarIcon className="h-8 w-8" />
                                </div>

                                <h3 className="mt-5 text-xl font-semibold text-text">
                                    Aún no tiene
                                    reseñas
                                </h3>

                                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                                    Las opiniones
                                    aparecerán
                                    cuando el
                                    freelancer
                                    complete
                                    contratos y
                                    reciba
                                    calificaciones.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Volver */}
                    <div className="mt-10 flex justify-center">
                        <Link
                            to="/freelancers"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 font-semibold text-text transition hover:border-primary/40 hover:text-primary"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />

                            Ver más
                            freelancers
                        </Link>
                    </div>
                </div>
            </main>

            <PublicBriefcaseDetail
                briefcase={
                    selectedBriefcase
                }
                isLoading={
                    isBriefcaseDetailLoading
                }
                error={
                    briefcaseDetailError
                }
                onClose={
                    closeBriefcaseDetail
                }
            />
        </>
    );
}