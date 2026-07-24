import type { FreelancerProfile } from "../../profile/models/profile";

/*
|--------------------------------------------------------------------------
| Servicio
|--------------------------------------------------------------------------
*/

export interface FreelancerService {
  id: number;
  freelancer_id: number;

  freelancer_profile: FreelancerProfile | null;

  title: string;
  description: string;
  price: string | null;
  category: string;
  location: string | null;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Payloads
|--------------------------------------------------------------------------
*/

export interface CreateServicePayload {
  title: string;
  description: string;
  price: number | null;
  category: string;
  location: string | null;
  is_active: boolean;
}

export type UpdateServicePayload =
  Partial<CreateServicePayload>;

/*
|--------------------------------------------------------------------------
| Respuestas
|--------------------------------------------------------------------------
*/

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: {
    services: FreelancerService[];
  };
}

export interface FreelancerServicesResponse {
  success: boolean;
  message: string;
  data: {
    freelancer_profile: FreelancerProfile;
    services: FreelancerService[];
  };
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: {
    service: FreelancerService;
  };
}

export interface DeleteServiceResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Formularios
|--------------------------------------------------------------------------
*/

export interface ServiceFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  is_active: boolean;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface ServiceErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}