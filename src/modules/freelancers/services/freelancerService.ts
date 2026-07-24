import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  Freelancer,
  FreelancerApiResponse,
  FreelancersApiResponse,
  RateType,
  WorkMode,
} from "../models/freelancer";

interface FreelancerProfileResponse {
  success: boolean;
  message: string;

  data: {
    profile: FreelancerApiResponse;
  };
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

/*
|--------------------------------------------------------------------------
| Obtener origen del backend
|--------------------------------------------------------------------------
*/

function getBackendOrigin(): string {
  const baseUrl =
    authApi.defaults.baseURL ??
    "http://127.0.0.1:8000/api";

  return baseUrl
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
}

/*
|--------------------------------------------------------------------------
| Resolver URL de imagen
|--------------------------------------------------------------------------
*/

function resolveImageUrl(
  imagePath?: string | null,
): string | null {
  if (!imagePath) {
    return null;
  }

  const normalizedPath =
    imagePath.trim();

  if (!normalizedPath) {
    return null;
  }

  if (
    normalizedPath.startsWith(
      "http://",
    ) ||
    normalizedPath.startsWith(
      "https://",
    ) ||
    normalizedPath.startsWith(
      "data:",
    ) ||
    normalizedPath.startsWith(
      "blob:",
    )
  ) {
    return normalizedPath;
  }

  const backendOrigin =
    getBackendOrigin();

  if (
    normalizedPath.startsWith(
      "/storage/",
    )
  ) {
    return `${backendOrigin}${normalizedPath}`;
  }

  if (
    normalizedPath.startsWith(
      "storage/",
    )
  ) {
    return `${backendOrigin}/${normalizedPath}`;
  }

  const cleanPath =
    normalizedPath.replace(
      /^\/+/,
      "",
    );

  return `${backendOrigin}/storage/${cleanPath}`;
}

/*
|--------------------------------------------------------------------------
| Obtener imagen del perfil
|--------------------------------------------------------------------------
*/

function getProfileImage(
  profile: FreelancerApiResponse,
): string {
  const imagePath =
    profile.user
      ?.profile_photo_url ||
    profile.user
      ?.profile_photo ||
    profile.profile_photo_url ||
    profile.profile_photo;

  return (
    resolveImageUrl(imagePath) ||
    DEFAULT_IMAGE
  );
}

/*
|--------------------------------------------------------------------------
| Formatear tarifa
|--------------------------------------------------------------------------
*/

function formatPrice(
  rate:
    | string
    | number
    | null,
  rateType: RateType | null,
): string {
  if (
    rateType === "negotiable"
  ) {
    return "Precio negociable";
  }

  if (
    rate === null ||
    rate === ""
  ) {
    return "Sin tarifa";
  }

  const numericRate =
    Number(rate);

  const formattedRate =
    Number.isNaN(
      numericRate,
    )
      ? String(rate)
      : new Intl.NumberFormat(
          "es-MX",
          {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 2,
          },
        ).format(
          numericRate,
        );

  const rateLabels: Record<
    Exclude<
      RateType,
      "negotiable"
    >,
    string
  > = {
    hourly: "por hora",
    daily: "por día",
    project: "por proyecto",
  };

  if (!rateType) {
    return formattedRate;
  }

  return `${formattedRate} ${rateLabels[rateType]}`;
}

/*
|--------------------------------------------------------------------------
| Formatear modalidad
|--------------------------------------------------------------------------
*/

function formatWorkMode(
  workMode: WorkMode | null,
): string | undefined {
  if (!workMode) {
    return undefined;
  }

  const workModeLabels: Record<
    WorkMode,
    string
  > = {
    remote: "Trabajo remoto",
    on_site:
      "Trabajo presencial",
    hybrid: "Trabajo híbrido",
    home_service:
      "Servicio a domicilio",
  };

  return workModeLabels[
    workMode
  ];
}

/*
|--------------------------------------------------------------------------
| Obtener nombre completo
|--------------------------------------------------------------------------
*/

function getFullName(
  profile: FreelancerApiResponse,
): string {
  if (!profile.user) {
    return "Freelancer sin nombre";
  }

  return [
    profile.user.name,
    profile.user.last_name,
    profile.user
      .maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

/*
|--------------------------------------------------------------------------
| Mapear respuesta del backend
|--------------------------------------------------------------------------
*/

export function mapFreelancer(
  profile: FreelancerApiResponse,
): Freelancer {
  const numericRate =
    profile.rate !== null &&
    profile.rate !== ""
      ? Number(profile.rate)
      : null;

  return {
    id: profile.id,
    userId: profile.user_id,

    name:
      getFullName(profile),

    profession:
      profile.specialty ||
      "Freelancer",

    rating: Number(
      profile.average_rate ??
        0,
    ),

    price: formatPrice(
      profile.rate,
      profile.rate_type,
    ),

    rateValue:
      numericRate !== null &&
      Number.isFinite(
        numericRate,
      )
        ? numericRate
        : null,

    rateType:
      profile.rate_type,

    image:
      getProfileImage(
        profile,
      ),

    delivery:
      formatWorkMode(
        profile.work_mode,
      ),

    description:
      profile.description ||
      "Sin descripción profesional.",

    location:
      profile.location ||
      "Ubicación no especificada",

    available: Boolean(
      profile.available,
    ),

    serviceArea:
      profile.service_area ||
      undefined,

    workMode:
      profile.work_mode,

    experience:
      profile.experience ||
      undefined,

    languages:
      profile.languages ?? [],

    professionalLinks:
      profile.professional_links,

    createdAt:
      profile.created_at,
  };
}

/*
|--------------------------------------------------------------------------
| Listado público
|--------------------------------------------------------------------------
*/

export async function getFreelancers(): Promise<
  Freelancer[]
> {
  const response =
    await authApi.get<FreelancersApiResponse>(
      ENDPOINTS.PROFILES,
    );

  return response.data.data.profiles.map(
    mapFreelancer,
  );
}

/*
|--------------------------------------------------------------------------
| Perfil público individual
|--------------------------------------------------------------------------
*/

export async function getFreelancerById(
  freelancerProfileId: number,
): Promise<Freelancer> {
  const response =
    await authApi.get<FreelancerProfileResponse>(
      ENDPOINTS.PUBLIC_PROFILE(
        freelancerProfileId,
      ),
    );

  return mapFreelancer(
    response.data.data.profile,
  );
}