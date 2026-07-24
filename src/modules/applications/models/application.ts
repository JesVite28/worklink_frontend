import type { FreelancerProfile } from "../../profile/models/profile";
import type { Vacancy } from "../../vacancies/models/vacancy";

/*
|--------------------------------------------------------------------------
| Estados
|--------------------------------------------------------------------------
*/

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

export type ApplicationFinalStatus =
  Exclude<ApplicationStatus, "pending">;

/*
|--------------------------------------------------------------------------
| Postulación
|--------------------------------------------------------------------------
*/

export interface Application {
  id: number;

  vacancy_id: number;
  vacancy: Vacancy | null;

  freelancer_id: number;
  freelancer_profile:
    | FreelancerProfile
    | null;

  message: string | null;

  status: ApplicationStatus;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Crear postulación
|--------------------------------------------------------------------------
*/

export interface CreateApplicationPayload {
  vacancy_id: number;
  message: string | null;
}

/*
|--------------------------------------------------------------------------
| Editar mensaje
|--------------------------------------------------------------------------
*/

export interface UpdateApplicationMessagePayload {
  message: string | null;
}

/*
|--------------------------------------------------------------------------
| Aceptar o rechazar
|--------------------------------------------------------------------------
*/

export interface UpdateApplicationStatusPayload {
  status: ApplicationFinalStatus;
}

/*
|--------------------------------------------------------------------------
| Filtros
|--------------------------------------------------------------------------
*/

export interface ApplicationFilters {
  status?: ApplicationStatus;
  vacancy_id?: number;
  freelancer_id?: number;
  search?: string;
  per_page?: number;
  page?: number;
}

/*
|--------------------------------------------------------------------------
| Paginación
|--------------------------------------------------------------------------
*/

export interface ApplicationPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/*
|--------------------------------------------------------------------------
| Listado
|--------------------------------------------------------------------------
*/

export interface ApplicationsResponse {
  success: boolean;
  message: string;

  data: {
    applications: Application[];
    pagination: ApplicationPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Postulaciones de una vacante
|--------------------------------------------------------------------------
*/

export interface ApplicationsByVacancyResponse {
  success: boolean;
  message: string;

  data: {
    vacancy: Vacancy;
    applications: Application[];
    pagination: ApplicationPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta individual
|--------------------------------------------------------------------------
*/

export interface ApplicationResponse {
  success: boolean;
  message: string;

  data: {
    application: Application;
  };
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

export interface DeleteApplicationResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface ApplicationErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;

  errors?: Record<
    string,
    string[]
  >;

  data?: {
    current_status?: ApplicationStatus;
  };
}