import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  BriefcaseProject,
  BriefcaseResponse,
  BriefcasesResponse,
  CreateBriefcasePayload,
  DeleteBriefcaseResponse,
  MyBriefcasesResponse,
  UpdateBriefcasePayload,
} from "../models/briefcase";

/*
|--------------------------------------------------------------------------
| Utilidades
|--------------------------------------------------------------------------
*/

function buildBriefcaseFormData(
  payload: CreateBriefcasePayload,
): FormData {
  const formData = new FormData();

  formData.append("title", payload.title);

  if (payload.description) {
    formData.append(
      "description",
      payload.description,
    );
  }

  if (payload.project_url) {
    formData.append(
      "project_url",
      payload.project_url,
    );
  }

  /*
   * El backend espera el archivo con el nombre image_url.
   */
  if (payload.image) {
    formData.append(
      "image_url",
      payload.image,
    );
  }

  return formData;
}

/*
|--------------------------------------------------------------------------
| Listados privados
|--------------------------------------------------------------------------
*/

/**
 * Obtiene todos los proyectos del portafolio.
 * Normalmente se utilizará desde administración.
 */
export async function getBriefcases(): Promise<
  BriefcaseProject[]
> {
  const response =
    await authApi.get<BriefcasesResponse>(
      ENDPOINTS.BRIEFCASES,
    );

  return response.data.data.briefcases;
}

/**
 * Obtiene el portafolio del freelancer autenticado.
 *
 * Esta es la función principal que utilizaremos en
 * /dashboard/portafolio.
 */
export async function getMyBriefcases(): Promise<
  MyBriefcasesResponse
> {
  const response =
    await authApi.get<MyBriefcasesResponse>(
      ENDPOINTS.MY_BRIEFCASES,
    );

  return response.data;
}

/**
 * Obtiene el portafolio privado de un perfil freelancer.
 * Solo puede utilizarlo el propietario o un administrador.
 */
export async function getBriefcasesByFreelancer(
  freelancerProfileId: number,
): Promise<MyBriefcasesResponse> {
  const response =
    await authApi.get<MyBriefcasesResponse>(
      ENDPOINTS.BRIEFCASES_BY_FREELANCER(
        freelancerProfileId,
      ),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Detalle
|--------------------------------------------------------------------------
*/

export async function getBriefcaseById(
  briefcaseId: number,
): Promise<BriefcaseProject> {
  const response =
    await authApi.get<BriefcaseResponse>(
      ENDPOINTS.BRIEFCASE(briefcaseId),
    );

  return response.data.data.briefcase;
}

/*
|--------------------------------------------------------------------------
| Creación
|--------------------------------------------------------------------------
*/

/**
 * Crea un proyecto mediante multipart/form-data.
 *
 * La imagen es opcional y Laravel espera recibirla
 * utilizando el campo image_url.
 */
export async function createBriefcase(
  payload: CreateBriefcasePayload,
): Promise<BriefcaseResponse> {
  const formData =
    buildBriefcaseFormData(payload);

  const response =
    await authApi.post<BriefcaseResponse>(
      ENDPOINTS.BRIEFCASES,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Actualización de información
|--------------------------------------------------------------------------
*/

/**
 * Actualiza únicamente:
 *
 * - título
 * - descripción
 * - enlace del proyecto
 *
 * La imagen se administra mediante funciones separadas.
 */
export async function updateBriefcase(
  briefcaseId: number,
  payload: UpdateBriefcasePayload,
): Promise<BriefcaseResponse> {
  const response =
    await authApi.put<BriefcaseResponse>(
      ENDPOINTS.BRIEFCASE(briefcaseId),
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Imagen
|--------------------------------------------------------------------------
*/

/**
 * Agrega o reemplaza la imagen de un proyecto.
 */
export async function updateBriefcaseImage(
  briefcaseId: number,
  image: File,
): Promise<BriefcaseResponse> {
  const formData = new FormData();

  formData.append("image_url", image);

  const response =
    await authApi.post<BriefcaseResponse>(
      ENDPOINTS.BRIEFCASE_IMAGE(
        briefcaseId,
      ),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return response.data;
}

/**
 * Elimina únicamente la imagen del proyecto.
 * El proyecto continuará existiendo.
 */
export async function deleteBriefcaseImage(
  briefcaseId: number,
): Promise<BriefcaseResponse> {
  const response =
    await authApi.delete<BriefcaseResponse>(
      ENDPOINTS.BRIEFCASE_IMAGE(
        briefcaseId,
      ),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

/**
 * Elimina el proyecto completo del portafolio.
 */
export async function deleteBriefcase(
  briefcaseId: number,
): Promise<DeleteBriefcaseResponse> {
  const response =
    await authApi.delete<DeleteBriefcaseResponse>(
      ENDPOINTS.BRIEFCASE(briefcaseId),
    );

  return response.data;
}