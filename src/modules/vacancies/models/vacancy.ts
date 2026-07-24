import type { CompanyProfile } from "../../profile/models/profile";

/*
|--------------------------------------------------------------------------
| Estados
|--------------------------------------------------------------------------
*/

export type VacancyStatus =
  | "open"
  | "paused"
  | "closed";

/*
|--------------------------------------------------------------------------
| Vacante
|--------------------------------------------------------------------------
*/

export interface Vacancy {
  id: number;
  company_id: number;

  company_profile: CompanyProfile | null;

  title: string;
  description: string;
  category: string;
  location: string;

  salary: string | null;

  status: VacancyStatus;

  accepts_applications: boolean;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Formulario
|--------------------------------------------------------------------------
*/

export interface VacancyFormState {
  title: string;
  description: string;
  category: string;
  location: string;
  salary: string;
  status: VacancyStatus;
}

/*
|--------------------------------------------------------------------------
| Creación
|--------------------------------------------------------------------------
*/

export interface CreateVacancyPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  salary: number | null;

  /*
   * Al crear, Laravel únicamente acepta:
   * open o paused.
   */
  status: Exclude<VacancyStatus, "closed">;
}

/*
|--------------------------------------------------------------------------
| Actualización
|--------------------------------------------------------------------------
*/

export interface UpdateVacancyPayload {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  salary?: number | null;
  status?: VacancyStatus;
}

/*
|--------------------------------------------------------------------------
| Paginación
|--------------------------------------------------------------------------
*/

export interface VacancyPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/*
|--------------------------------------------------------------------------
| Filtros
|--------------------------------------------------------------------------
*/

export interface VacancyFilters {
  search?: string;
  category?: string;
  location?: string;
  status?: VacancyStatus;
  min_salary?: number;
  max_salary?: number;
  per_page?: number;
  page?: number;
}

/*
|--------------------------------------------------------------------------
| Listado paginado
|--------------------------------------------------------------------------
*/

export interface VacanciesResponse {
  success: boolean;
  message: string;

  data: {
    vacancies: Vacancy[];
    pagination: VacancyPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Mis vacantes
|--------------------------------------------------------------------------
*/

export interface MyVacanciesResponse {
  success: boolean;
  message: string;

  data: {
    company_profile: CompanyProfile;
    vacancies: Vacancy[];
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta individual
|--------------------------------------------------------------------------
*/

export interface VacancyResponse {
  success: boolean;
  message: string;

  data: {
    vacancy: Vacancy;
  };
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

export interface DeleteVacancyResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface VacancyErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}