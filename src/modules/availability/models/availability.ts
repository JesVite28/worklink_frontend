import type { FreelancerProfile } from "../../profile/models/profile";

/*
|--------------------------------------------------------------------------
| Estados de disponibilidad
|--------------------------------------------------------------------------
*/

export type AvailabilityStatus =
  | "available"
  | "busy"
  | "vacation";

/*
|--------------------------------------------------------------------------
| Disponibilidad
|--------------------------------------------------------------------------
*/

export interface Availability {
  id: number;
  freelancer_id: number;

  freelancer_profile: FreelancerProfile | null;

  start_date: string;
  end_date: string;

  status: AvailabilityStatus;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Formulario
|--------------------------------------------------------------------------
*/

export interface AvailabilityFormState {
  start_date: string;
  end_date: string;
  status: AvailabilityStatus;
}

/*
|--------------------------------------------------------------------------
| Payloads
|--------------------------------------------------------------------------
*/

export interface CreateAvailabilityPayload {
  start_date: string;
  end_date: string;
  status: AvailabilityStatus;
}

export type UpdateAvailabilityPayload =
  Partial<CreateAvailabilityPayload>;

/*
|--------------------------------------------------------------------------
| Respuesta de listado general
|--------------------------------------------------------------------------
*/

export interface AvailabilitiesResponse {
  success: boolean;
  message: string;

  data: {
    availabilities: Availability[];
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta de mis disponibilidades
|--------------------------------------------------------------------------
*/

export interface MyAvailabilitiesResponse {
  success: boolean;
  message: string;

  data: {
    freelancer_profile: FreelancerProfile;
    availabilities: Availability[];
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta individual
|--------------------------------------------------------------------------
*/

export interface AvailabilityResponse {
  success: boolean;
  message: string;

  data: {
    availability: Availability;
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta de eliminación
|--------------------------------------------------------------------------
*/

export interface DeleteAvailabilityResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Respuesta de error
|--------------------------------------------------------------------------
*/

export interface AvailabilityErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}