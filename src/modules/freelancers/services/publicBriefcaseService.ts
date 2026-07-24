import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  PublicBriefcase,
  PublicBriefcaseResponse,
  PublicBriefcasesResponse,
} from "../models/publicBriefcase";

/*
|--------------------------------------------------------------------------
| Portafolios públicos de un freelancer
|--------------------------------------------------------------------------
*/

/**
 * Obtiene todos los proyectos públicos pertenecientes
 * a un perfil freelancer.
 */
export async function getPublicBriefcasesByFreelancer(
  freelancerProfileId: number,
): Promise<PublicBriefcase[]> {
  const response =
    await authApi.get<PublicBriefcasesResponse>(
      ENDPOINTS.PUBLIC_BRIEFCASES_BY_FREELANCER(
        freelancerProfileId,
      ),
    );

  return response.data.data.briefcases;
}

/*
|--------------------------------------------------------------------------
| Detalle público de un portafolio
|--------------------------------------------------------------------------
*/

/**
 * Obtiene un proyecto público individual mediante su ID.
 */
export async function getPublicBriefcaseById(
  briefcaseId: number,
): Promise<PublicBriefcase> {
  const response =
    await authApi.get<PublicBriefcaseResponse>(
      ENDPOINTS.PUBLIC_BRIEFCASE(
        briefcaseId,
      ),
    );

  return response.data.data.briefcase;
}