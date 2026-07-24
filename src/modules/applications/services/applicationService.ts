import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  Application,
  ApplicationFilters,
  ApplicationFinalStatus,
  ApplicationResponse,
  ApplicationsByVacancyResponse,
  ApplicationsResponse,
  CreateApplicationPayload,
  DeleteApplicationResponse,
  UpdateApplicationMessagePayload,
} from "../models/application";

/*
|--------------------------------------------------------------------------
| Parámetros de consulta
|--------------------------------------------------------------------------
*/

function buildApplicationParams(
  filters: ApplicationFilters = {},
): Record<string, string | number> {
  const params: Record<
    string,
    string | number
  > = {};

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.vacancy_id !== undefined) {
    params.vacancy_id =
      filters.vacancy_id;
  }

  if (
    filters.freelancer_id !== undefined
  ) {
    params.freelancer_id =
      filters.freelancer_id;
  }

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
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
| Listado según el rol autenticado
|--------------------------------------------------------------------------
*/

/**
 * Obtiene las postulaciones disponibles para
 * el usuario autenticado:
 *
 * - Administrador: todas las postulaciones.
 * - Freelancer: sus propias postulaciones.
 * - Empresa: postulaciones recibidas en sus vacantes.
 */
export async function getApplications(
  filters: ApplicationFilters = {},
): Promise<ApplicationsResponse> {
  const response =
    await authApi.get<ApplicationsResponse>(
      ENDPOINTS.APPLICATIONS,
      {
        params:
          buildApplicationParams(filters),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Postulaciones del freelancer
|--------------------------------------------------------------------------
*/

/**
 * Obtiene las postulaciones realizadas por
 * el freelancer autenticado.
 */
export async function getMyApplications(
  filters: ApplicationFilters = {},
): Promise<ApplicationsResponse> {
  const response =
    await authApi.get<ApplicationsResponse>(
      ENDPOINTS.MY_APPLICATIONS,
      {
        params:
          buildApplicationParams(filters),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Postulaciones recibidas por vacante
|--------------------------------------------------------------------------
*/

/**
 * Obtiene las postulaciones recibidas por
 * una vacante específica.
 *
 * Solo puede acceder la empresa propietaria
 * de la vacante o un administrador.
 */
export async function getApplicationsByVacancy(
  vacancyId: number,
  filters: Pick<
    ApplicationFilters,
    "status" | "search" | "per_page" | "page"
  > = {},
): Promise<ApplicationsByVacancyResponse> {
  const response =
    await authApi.get<ApplicationsByVacancyResponse>(
      ENDPOINTS.APPLICATIONS_BY_VACANCY(
        vacancyId,
      ),
      {
        params:
          buildApplicationParams(filters),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

/**
 * Obtiene una postulación por su identificador.
 */
export async function getApplicationById(
  applicationId: number,
): Promise<Application> {
  const response =
    await authApi.get<ApplicationResponse>(
      ENDPOINTS.APPLICATION(
        applicationId,
      ),
    );

  return response.data.data.application;
}

/*
|--------------------------------------------------------------------------
| Crear postulación
|--------------------------------------------------------------------------
*/

/**
 * Permite que el freelancer autenticado se
 * postule a una vacante abierta.
 *
 * El backend asigna automáticamente:
 * - freelancer_id
 * - status: pending
 */
export async function createApplication(
  payload: CreateApplicationPayload,
): Promise<ApplicationResponse> {
  const response =
    await authApi.post<ApplicationResponse>(
      ENDPOINTS.APPLICATIONS,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Editar mensaje
|--------------------------------------------------------------------------
*/

/**
 * Actualiza únicamente el mensaje enviado
 * por el freelancer.
 *
 * Solo puede modificarse mientras la
 * postulación esté pendiente.
 */
export async function updateApplicationMessage(
  applicationId: number,
  payload: UpdateApplicationMessagePayload,
): Promise<ApplicationResponse> {
  const response =
    await authApi.patch<ApplicationResponse>(
      ENDPOINTS.APPLICATION(
        applicationId,
      ),
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Aceptar o rechazar
|--------------------------------------------------------------------------
*/

/**
 * Permite que la empresa acepte o rechace
 * una postulación pendiente.
 */
export async function updateApplicationStatus(
  applicationId: number,
  status: ApplicationFinalStatus,
): Promise<ApplicationResponse> {
  const response =
    await authApi.patch<ApplicationResponse>(
      ENDPOINTS.APPLICATION(
        applicationId,
      ),
      {
        status,
      },
    );

  return response.data;
}

/**
 * Acepta una postulación pendiente.
 */
export async function acceptApplication(
  applicationId: number,
): Promise<ApplicationResponse> {
  return updateApplicationStatus(
    applicationId,
    "accepted",
  );
}

/**
 * Rechaza una postulación pendiente.
 */
export async function rejectApplication(
  applicationId: number,
): Promise<ApplicationResponse> {
  return updateApplicationStatus(
    applicationId,
    "rejected",
  );
}

/*
|--------------------------------------------------------------------------
| Retirar postulación
|--------------------------------------------------------------------------
*/

/**
 * Elimina una postulación.
 *
 * Un freelancer solamente puede retirar
 * postulaciones que continúen pendientes.
 */
export async function deleteApplication(
  applicationId: number,
): Promise<DeleteApplicationResponse> {
  const response =
    await authApi.delete<DeleteApplicationResponse>(
      ENDPOINTS.APPLICATION(
        applicationId,
      ),
    );

  return response.data;
}