import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  CreateServicePayload,
  DeleteServiceResponse,
  FreelancerService,
  FreelancerServicesResponse,
  ServiceResponse,
  ServicesResponse,
  UpdateServicePayload,
} from "../models/service";

interface PublicServicesResponse {
  success: boolean;
  message: string;

  data: {
    services: FreelancerService[];
  };
}

interface PublicServiceResponse {
  success: boolean;
  message: string;

  data: {
    service: FreelancerService;
  };
}

interface PublicFreelancerServicesResponse {
  success: boolean;
  message: string;

  data: {
    freelancer_profile: unknown;
    services: FreelancerService[];
  };
}

/*
|--------------------------------------------------------------------------
| Servicios públicos
|--------------------------------------------------------------------------
*/

/**
 * Obtiene todos los servicios activos publicados por freelancers activos.
 */
export async function getPublicServices(): Promise<
  FreelancerService[]
> {
  const response =
    await authApi.get<PublicServicesResponse>(
      ENDPOINTS.PUBLIC_SERVICES,
    );

  return response.data.data.services;
}

/**
 * Obtiene el detalle público de un servicio activo.
 */
export async function getPublicServiceById(
  serviceId: number,
): Promise<FreelancerService> {
  const response =
    await authApi.get<PublicServiceResponse>(
      ENDPOINTS.PUBLIC_SERVICE(
        serviceId,
      ),
    );

  return response.data.data.service;
}

/**
 * Obtiene los servicios públicos activos pertenecientes
 * a un perfil freelancer.
 */
export async function getPublicServicesByFreelancer(
  freelancerProfileId: number,
): Promise<FreelancerService[]> {
  const response =
    await authApi.get<PublicFreelancerServicesResponse>(
      ENDPOINTS.PUBLIC_SERVICES_BY_FREELANCER(
        freelancerProfileId,
      ),
    );

  return response.data.data.services;
}

/*
|--------------------------------------------------------------------------
| Listados privados
|--------------------------------------------------------------------------
*/

/**
 * Obtiene todos los servicios privados.
 * Esta operación normalmente se utiliza en administración.
 */
export async function getServices(): Promise<
  FreelancerService[]
> {
  const response =
    await authApi.get<ServicesResponse>(
      ENDPOINTS.SERVICES,
    );

  return response.data.data.services;
}

/**
 * Obtiene los servicios pertenecientes al perfil
 * freelancer autenticado.
 *
 * El backend permite esta operación únicamente al
 * propietario del perfil o a un administrador.
 */
export async function getServicesByFreelancer(
  freelancerProfileId: number,
): Promise<FreelancerServicesResponse> {
  const response =
    await authApi.get<FreelancerServicesResponse>(
      ENDPOINTS.SERVICES_BY_FREELANCER(
        freelancerProfileId,
      ),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Detalle privado
|--------------------------------------------------------------------------
*/

export async function getServiceById(
  serviceId: number,
): Promise<FreelancerService> {
  const response =
    await authApi.get<ServiceResponse>(
      ENDPOINTS.SERVICE(serviceId),
    );

  return response.data.data.service;
}

/*
|--------------------------------------------------------------------------
| Creación
|--------------------------------------------------------------------------
*/

export async function createService(
  payload: CreateServicePayload,
): Promise<ServiceResponse> {
  const response =
    await authApi.post<ServiceResponse>(
      ENDPOINTS.SERVICES,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Actualización
|--------------------------------------------------------------------------
*/

export async function updateService(
  serviceId: number,
  payload: UpdateServicePayload,
): Promise<ServiceResponse> {
  const response =
    await authApi.put<ServiceResponse>(
      ENDPOINTS.SERVICE(serviceId),
      payload,
    );

  return response.data;
}

/**
 * Activa o desactiva un servicio conservando
 * el resto de sus datos.
 */
export async function updateServiceStatus(
  serviceId: number,
  isActive: boolean,
): Promise<ServiceResponse> {
  return updateService(
    serviceId,
    {
      is_active: isActive,
    },
  );
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

export async function deleteService(
  serviceId: number,
): Promise<DeleteServiceResponse> {
  const response =
    await authApi.delete<DeleteServiceResponse>(
      ENDPOINTS.SERVICE(
        serviceId,
      ),
    );

  return response.data;
}