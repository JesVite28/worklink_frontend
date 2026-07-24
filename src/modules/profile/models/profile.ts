import type { UserData } from "../../auth/models/authResponse";

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

export interface ProfileRole {
  id: number;
  name: "admin" | "cliente" | "freelancer" | "empresa";
  description: string | null;
}

/**
 * Usuario incluido dentro de las respuestas privadas
 * de perfiles freelancer y empresa.
 */
export interface PrivateProfileUser {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name: string | null;
  email: string;
  phone: string | null;
  profile_photo: string | null;
  profile_photo_url?: string | null;
  is_active: boolean;
  role: ProfileRole | null;
}

/*
|--------------------------------------------------------------------------
| Cuenta personal
|--------------------------------------------------------------------------
*/

export interface UpdateAccountPayload {
  name?: string;
  last_name?: string;
  maternal_last_name?: string | null;
  email?: string;
  phone?: string | null;

  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AccountResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

export interface ProfilePhotoPayload {
  profile_photo: File;
}

export interface ProfilePhotoResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

/*
|--------------------------------------------------------------------------
| Perfil freelancer
|--------------------------------------------------------------------------
*/

export interface ProfessionalLinks {
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio_url: string | null;
}

export interface FreelancerProfile {
  id: number;
  user_id: number;
  user: PrivateProfileUser | null;

  description: string | null;
  specialty: string | null;
  location: string | null;
  service_area: string | null;
  work_mode: WorkMode | null;
  experience: string | null;

  rate_type: RateType | null;
  rate: string | null;

  languages: string[];
  professional_links: ProfessionalLinks;

  available: boolean;
  average_rate: string | null;

  created_at: string;
  updated_at: string;

  services?: unknown[];
  briefcases?: unknown[];
  availabilities?: unknown[];
}

export interface CreateFreelancerProfilePayload {
  description: string;
  specialty: string;
  location: string;
  service_area: string;
  work_mode: WorkMode;
  experience: string;

  rate_type: RateType;
  rate: number | null;

  languages: string[];

  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio_url?: string | null;

  available: boolean;
}

export type UpdateFreelancerProfilePayload =
  Partial<CreateFreelancerProfilePayload>;

export interface FreelancerProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: FreelancerProfile;
  };
}

/*
|--------------------------------------------------------------------------
| Perfil empresarial
|--------------------------------------------------------------------------
*/

export interface CompanyProfile {
  id: number;
  user_id: number;
  user: PrivateProfileUser | null;

  company_name: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  average_rate: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateCompanyProfilePayload {
  company_name: string;
  description?: string | null;
  industry?: string | null;
  location?: string | null;
}

export type UpdateCompanyProfilePayload =
  Partial<CreateCompanyProfilePayload>;

export interface CompanyProfileResponse {
  success: boolean;
  message: string;
  data: {
    company_profile: CompanyProfile;
  };
}

/*
|--------------------------------------------------------------------------
| Errores del backend
|--------------------------------------------------------------------------
*/

export interface ProfileErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}