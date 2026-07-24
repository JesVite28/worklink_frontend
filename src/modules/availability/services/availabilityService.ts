import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  AvailabilitiesResponse,
  Availability,
  AvailabilityResponse,
  AvailabilityStatus,
  CreateAvailabilityPayload,
  DeleteAvailabilityResponse,
  MyAvailabilitiesResponse,
  UpdateAvailabilityPayload,
} from "../models/availability";

/*
|--------------------------------------------------------------------------
| Listados
|--------------------------------------------------------------------------
*/

/**
 * Obtiene todas las disponibilidades registradas.
 * Se utilizará principalmente desde administración.
 */
export async function getAvailabilities(): Promise<
  Availability[]
> {
  const response =
    await authApi.get<AvailabilitiesResponse>(
      ENDPOINTS.AVAILABILITIES,
    );

  return response.data.data.availabilities;
}

/**
 * Obtiene únicamente las disponibilidades del
 * freelancer autenticado.
 */
export async function getMyAvailabilities(): Promise<
  MyAvailabilitiesResponse
> {
  const response =
    await authApi.get<MyAvailabilitiesResponse>(
      ENDPOINTS.MY_AVAILABILITIES,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

export async function getAvailabilityById(
  availabilityId: number,
): Promise<Availability> {
  const response =
    await authApi.get<AvailabilityResponse>(
      ENDPOINTS.AVAILABILITY(
        availabilityId,
      ),
    );

  return response.data.data.availability;
}

/*
|--------------------------------------------------------------------------
| Creación
|--------------------------------------------------------------------------
*/

export async function createAvailability(
  payload: CreateAvailabilityPayload,
): Promise<AvailabilityResponse> {
  const response =
    await authApi.post<AvailabilityResponse>(
      ENDPOINTS.AVAILABILITIES,
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
 * El backend utiliza PATCH porque permite actualizar
 * fechas, estado o ambos.
 */
export async function updateAvailability(
  availabilityId: number,
  payload: UpdateAvailabilityPayload,
): Promise<AvailabilityResponse> {
  const response =
    await authApi.patch<AvailabilityResponse>(
      ENDPOINTS.AVAILABILITY(
        availabilityId,
      ),
      payload,
    );

  return response.data;
}

/**
 * Cambia únicamente el estado de una disponibilidad.
 */
export async function updateAvailabilityStatus(
  availabilityId: number,
  status: AvailabilityStatus,
): Promise<AvailabilityResponse> {
  return updateAvailability(availabilityId, {
    status,
  });
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

export async function deleteAvailability(
  availabilityId: number,
): Promise<DeleteAvailabilityResponse> {
  const response =
    await authApi.delete<DeleteAvailabilityResponse>(
      ENDPOINTS.AVAILABILITY(
        availabilityId,
      ),
    );

  return response.data;
}