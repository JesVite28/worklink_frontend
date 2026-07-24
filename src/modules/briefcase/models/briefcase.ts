import type { FreelancerProfile } from "../../profile/models/profile";

/*
|--------------------------------------------------------------------------
| Proyecto del portafolio
|--------------------------------------------------------------------------
*/

export interface BriefcaseProject {
  id: number;
  freelancer_id: number;

  freelancer_profile: FreelancerProfile | null;

  title: string;
  description: string | null;

  /*
   * Ruta interna almacenada por Laravel:
   * briefcase_images/archivo.webp
   */
  image_path: string | null;

  /*
   * URL pública completa lista para usar en <img>.
   */
  image_url: string | null;

  project_url: string | null;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Formulario
|--------------------------------------------------------------------------
*/

export interface BriefcaseFormState {
  title: string;
  description: string;
  project_url: string;
  image: File | null;
}

/*
|--------------------------------------------------------------------------
| Payload para crear
|--------------------------------------------------------------------------
|
| La creación utiliza multipart/form-data.
| No se envía freelancer_id porque Laravel obtiene el perfil
| del usuario freelancer autenticado.
|
*/

export interface CreateBriefcasePayload {
  title: string;
  description: string | null;
  project_url: string | null;
  image: File | null;
}

/*
|--------------------------------------------------------------------------
| Payload para actualizar información
|--------------------------------------------------------------------------
|
| El controlador actualiza título, descripción y enlace mediante PUT.
| La imagen se actualiza en un endpoint separado.
|
*/

export interface UpdateBriefcasePayload {
  title?: string;
  description?: string | null;
  project_url?: string | null;
}

/*
|--------------------------------------------------------------------------
| Payload de imagen
|--------------------------------------------------------------------------
*/

export interface BriefcaseImagePayload {
  image: File;
}

/*
|--------------------------------------------------------------------------
| Respuesta de listado general
|--------------------------------------------------------------------------
*/

export interface BriefcasesResponse {
  success: boolean;
  message: string;

  data: {
    briefcases: BriefcaseProject[];
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta de mi portafolio
|--------------------------------------------------------------------------
*/

export interface MyBriefcasesResponse {
  success: boolean;
  message: string;

  data: {
    freelancer_profile: FreelancerProfile;
    briefcases: BriefcaseProject[];
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta de un proyecto
|--------------------------------------------------------------------------
*/

export interface BriefcaseResponse {
  success: boolean;
  message: string;

  data: {
    briefcase: BriefcaseProject;
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta de eliminación
|--------------------------------------------------------------------------
*/

export interface DeleteBriefcaseResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Respuesta de error
|--------------------------------------------------------------------------
*/

export interface BriefcaseErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}