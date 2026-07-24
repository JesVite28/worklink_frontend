import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  CreateVacancyPayload,
  DeleteVacancyResponse,
  MyVacanciesResponse,
  UpdateVacancyPayload,
  VacanciesResponse,
  Vacancy,
  VacancyFilters,
  VacancyResponse,
  VacancyStatus,
} from "../models/vacancy";

/*
|--------------------------------------------------------------------------
| Parámetros de consulta
|--------------------------------------------------------------------------
*/

function buildVacancyParams(
  filters: VacancyFilters = {},
): Record<string, string | number> {
  const params: Record<
    string,
    string | number
  > = {};

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.category?.trim()) {
    params.category =
      filters.category.trim();
  }

  if (filters.location?.trim()) {
    params.location =
      filters.location.trim();
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (
    filters.min_salary !== undefined
  ) {
    params.min_salary =
      filters.min_salary;
  }

  if (
    filters.max_salary !== undefined
  ) {
    params.max_salary =
      filters.max_salary;
  }

  if (filters.per_page !== undefined) {
    params.per_page = filters.per_page;
  }

  if (filters.page !== undefined) {
    params.page = filters.page;
  }

  return params;
}

/*
|--------------------------------------------------------------------------
| Listado privado
|--------------------------------------------------------------------------
*/

/**
 * Obtiene vacantes privadas.
 *
 * El administrador obtiene todas las vacantes.
 * Una empresa obtiene solamente las vacantes
 * pertenecientes a su perfil empresarial.
 */
export async function getVacancies(
  filters: VacancyFilters = {},
): Promise<VacanciesResponse> {
  const response =
    await authApi.get<VacanciesResponse>(
      ENDPOINTS.VACANCIES,
      {
        params:
          buildVacancyParams(filters),
      },
    );

  return response.data;
}

/**
 * Obtiene todas las vacantes de la empresa autenticada.
 *
 * Esta será la función principal para:
 * /dashboard/vacantes
 */
export async function getMyVacancies(): Promise<MyVacanciesResponse> {
  const response =
    await authApi.get<MyVacanciesResponse>(
      ENDPOINTS.MY_VACANCIES,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Detalle privado
|--------------------------------------------------------------------------
*/

export async function getVacancyById(
  vacancyId: number,
): Promise<Vacancy> {
  const response =
    await authApi.get<VacancyResponse>(
      ENDPOINTS.VACANCY(vacancyId),
    );

  return response.data.data.vacancy;
}

/*
|--------------------------------------------------------------------------
| Creación
|--------------------------------------------------------------------------
*/

/**
 * Crea una nueva vacante.
 *
 * Al crear solamente pueden enviarse los estados:
 * - open
 * - paused
 */
export async function createVacancy(
  payload: CreateVacancyPayload,
): Promise<VacancyResponse> {
  const response =
    await authApi.post<VacancyResponse>(
      ENDPOINTS.VACANCIES,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Actualización
|--------------------------------------------------------------------------
*/

/**
 * Actualiza parcialmente una vacante mediante PATCH.
 *
 * Una vacante cerrada ya no puede modificarse ni reabrirse.
 */
export async function updateVacancy(
  vacancyId: number,
  payload: UpdateVacancyPayload,
): Promise<VacancyResponse> {
  const response =
    await authApi.patch<VacancyResponse>(
      ENDPOINTS.VACANCY(vacancyId),
      payload,
    );

  return response.data;
}

/**
 * Cambia únicamente el estado de la vacante.
 */
export async function updateVacancyStatus(
  vacancyId: number,
  status: VacancyStatus,
): Promise<VacancyResponse> {
  return updateVacancy(vacancyId, {
    status,
  });
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

/**
 * Realiza el borrado lógico de una vacante.
 */
export async function deleteVacancy(
  vacancyId: number,
): Promise<DeleteVacancyResponse> {
  const response =
    await authApi.delete<DeleteVacancyResponse>(
      ENDPOINTS.VACANCY(vacancyId),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Vacantes públicas
|--------------------------------------------------------------------------
*/

/**
 * Obtiene las vacantes públicas abiertas,
 * con filtros y paginación.
 */
export async function getPublicVacancies(
  filters: Omit<
    VacancyFilters,
    "status"
  > = {},
): Promise<VacanciesResponse> {
  const response =
    await authApi.get<VacanciesResponse>(
      ENDPOINTS.PUBLIC_VACANCIES,
      {
        params:
          buildVacancyParams(filters),
      },
    );

  return response.data;
}

/**
 * Obtiene una vacante pública por su ID.
 */
export async function getPublicVacancyById(
  vacancyId: number,
): Promise<Vacancy> {
  const response =
    await authApi.get<VacancyResponse>(
      ENDPOINTS.PUBLIC_VACANCY(
        vacancyId,
      ),
    );

  return response.data.data.vacancy;
}

/**
 * Obtiene las vacantes públicas abiertas
 * de una empresa específica.
 */
export async function getPublicVacanciesByCompany(
  companyProfileId: number,
): Promise<MyVacanciesResponse> {
  const response =
    await authApi.get<MyVacanciesResponse>(
      ENDPOINTS.PUBLIC_VACANCIES_BY_COMPANY(
        companyProfileId,
      ),
    );

  return response.data;
}