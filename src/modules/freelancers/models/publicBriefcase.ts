export interface PublicBriefcaseFreelancerUser {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name: string | null;
  profile_photo: string | null;

  role: {
    id: number;
    name: string;
    description: string | null;
  } | null;
}

export interface PublicBriefcaseFreelancerProfile {
  id: number;
  user_id: number;
  user: PublicBriefcaseFreelancerUser | null;

  description: string | null;
  specialty: string | null;
  location: string | null;
  service_area: string | null;
  work_mode: string | null;
  experience: string | null;

  rate_type: string | null;
  rate: string | null;

  languages: string[];

  professional_links: {
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio_url: string | null;
  };

  available: boolean;
  average_rate: string | null;
}

export interface PublicBriefcase {
  id: number;
  freelancer_id: number;

  freelancer_profile:
    | PublicBriefcaseFreelancerProfile
    | null;

  title: string;
  description: string | null;

  /**
   * Ruta interna almacenada por Laravel.
   * No debe utilizarse directamente para mostrar la imagen.
   */
  image_path: string | null;

  /**
   * URL completa preparada por el backend.
   */
  image_url: string | null;

  project_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface PublicBriefcasesResponse {
  success: boolean;
  message: string;

  data: {
    freelancer_profile:
      | PublicBriefcaseFreelancerProfile
      | null;

    briefcases: PublicBriefcase[];
  };
}

export interface PublicBriefcaseResponse {
  success: boolean;
  message: string;

  data: {
    briefcase: PublicBriefcase;
  };
}

export interface PublicBriefcaseErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;

  errors?: Record<
    string,
    string[]
  >;
}