export type WorkMode =
  | "remote"
  | "on_site"
  | "hybrid"
  | "home_service";

export type RateType =
  | "hourly"
  | "daily"
  | "project"
  | "negotiable";

/*
|--------------------------------------------------------------------------
| Rol
|--------------------------------------------------------------------------
*/

export interface FreelancerRole {
  id: number;
  name: string;
  description:
    | string
    | null;
}

/*
|--------------------------------------------------------------------------
| Usuario público
|--------------------------------------------------------------------------
*/

export interface FreelancerPublicUser {
  id: number;

  name: string;
  last_name: string;

  maternal_last_name:
    | string
    | null;

  profile_photo:
    | string
    | null;

  profile_photo_url:
    | string
    | null;

  is_active?: boolean;

  role:
    | FreelancerRole
    | null;
}

/*
|--------------------------------------------------------------------------
| Enlaces profesionales
|--------------------------------------------------------------------------
*/

export interface ProfessionalLinks {
  website:
    | string
    | null;

  facebook:
    | string
    | null;

  instagram:
    | string
    | null;

  linkedin:
    | string
    | null;

  github:
    | string
    | null;

  portfolio_url:
    | string
    | null;
}

/*
|--------------------------------------------------------------------------
| Respuesta del perfil
|--------------------------------------------------------------------------
*/

export interface FreelancerApiResponse {
  id: number;
  user_id: number;

  user:
    | FreelancerPublicUser
    | null;

  description:
    | string
    | null;

  specialty:
    | string
    | null;

  location:
    | string
    | null;

  service_area:
    | string
    | null;

  work_mode:
    | WorkMode
    | null;

  experience:
    | string
    | null;

  rate_type:
    | RateType
    | null;

  rate:
    | string
    | number
    | null;

  languages: string[];

  professional_links:
    | ProfessionalLinks
    | null;

  available: boolean;

  average_rate:
    | string
    | number
    | null;

  created_at: string;
  updated_at: string;

  /*
   * Compatibilidad con respuestas antiguas
   * donde la fotografía venía directamente
   * en el perfil.
   */
  profile_photo?:
    | string
    | null;

  profile_photo_url?:
    | string
    | null;
}

/*
|--------------------------------------------------------------------------
| Respuesta del listado
|--------------------------------------------------------------------------
*/

export interface FreelancersApiResponse {
  success: boolean;
  message: string;

  data: {
    profiles:
      FreelancerApiResponse[];
  };
}

/*
|--------------------------------------------------------------------------
| Modelo utilizado por los componentes
|--------------------------------------------------------------------------
*/

export interface Freelancer {
  id: number;
  userId: number;

  name: string;
  profession: string;

  rating: number;
  price: string;

  image: string;

  location: string;
  available: boolean;

  description?: string;
  delivery?: string;
  serviceArea?: string;

  workMode?:
    | WorkMode
    | null;

  experience?: string;

  languages?: string[];

  professionalLinks?:
    | ProfessionalLinks
    | null;

  createdAt?: string;

  rateValue:
    | number
    | null;

  rateType:
    | RateType
    | null;
}