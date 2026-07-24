import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  CreateReviewPayload,
  DeleteReviewResponse,
  PublicReviewsResponse,
  Review,
  ReviewFilters,
  ReviewResponse,
  ReviewsResponse,
  UpdateReviewPayload,
} from "../models/review";

/*
|--------------------------------------------------------------------------
| Construcción de parámetros
|--------------------------------------------------------------------------
*/

function buildReviewParams(
  filters: ReviewFilters = {},
): Record<string, string | number> {
  const params: Record<
    string,
    string | number
  > = {};

  if (filters.rating !== undefined) {
    params.rating = filters.rating;
  }

  if (filters.type) {
    params.type = filters.type;
  }

  if (filters.per_page !== undefined) {
    params.per_page =
      filters.per_page;
  }

  if (filters.page !== undefined) {
    params.page = filters.page;
  }

  return params;
}

/*
|--------------------------------------------------------------------------
| Listar reseñas relacionadas
|--------------------------------------------------------------------------
*/

export async function getReviews(
  filters: ReviewFilters = {},
): Promise<ReviewsResponse> {
  const response =
    await authApi.get<ReviewsResponse>(
      ENDPOINTS.REVIEWS.BASE,
      {
        params:
          buildReviewParams(
            filters,
          ),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Consultar una reseña
|--------------------------------------------------------------------------
*/

export async function getReviewById(
  reviewId: number,
): Promise<Review> {
  const response =
    await authApi.get<ReviewResponse>(
      ENDPOINTS.REVIEWS.SHOW(
        reviewId,
      ),
    );

  return response.data.data.review;
}

/*
|--------------------------------------------------------------------------
| Crear reseña
|--------------------------------------------------------------------------
*/

/**
 * Solo se puede calificar cuando:
 *
 * - El contrato está completado.
 * - El usuario pertenece al contrato.
 * - El usuario todavía no ha calificado ese contrato.
 */
export async function createReview(
  payload: CreateReviewPayload,
): Promise<Review> {
  const response =
    await authApi.post<ReviewResponse>(
      ENDPOINTS.REVIEWS.BASE,
      payload,
    );

  return response.data.data.review;
}

/*
|--------------------------------------------------------------------------
| Actualizar reseña
|--------------------------------------------------------------------------
*/

/**
 * Solo el autor de la reseña puede modificarla.
 */
export async function updateReview(
  reviewId: number,
  payload: UpdateReviewPayload,
): Promise<Review> {
  const response =
    await authApi.patch<ReviewResponse>(
      ENDPOINTS.REVIEWS.UPDATE(
        reviewId,
      ),
      payload,
    );

  return response.data.data.review;
}

/*
|--------------------------------------------------------------------------
| Eliminar reseña
|--------------------------------------------------------------------------
*/

/**
 * El autor puede eliminar su reseña.
 * El administrador también puede eliminarla.
 */
export async function deleteReview(
  reviewId: number,
): Promise<string> {
  const response =
    await authApi.delete<DeleteReviewResponse>(
      ENDPOINTS.REVIEWS.DELETE(
        reviewId,
      ),
    );

  return response.data.message;
}

/*
|--------------------------------------------------------------------------
| Reseñas públicas por usuario
|--------------------------------------------------------------------------
*/

export async function getPublicReviewsByUser(
  userId: number,
  page = 1,
  perPage = 10,
): Promise<PublicReviewsResponse> {
  const response =
    await authApi.get<PublicReviewsResponse>(
      ENDPOINTS.REVIEWS.PUBLIC_BY_USER(
        userId,
      ),
      {
        params: {
          page,
          per_page: perPage,
        },
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Reseñas públicas por perfil freelancer
|--------------------------------------------------------------------------
*/

export async function getPublicReviewsByFreelancer(
  freelancerId: number,
  page = 1,
  perPage = 10,
): Promise<PublicReviewsResponse> {
  const response =
    await authApi.get<PublicReviewsResponse>(
      ENDPOINTS.REVIEWS
        .PUBLIC_BY_FREELANCER(
          freelancerId,
        ),
      {
        params: {
          page,
          per_page: perPage,
        },
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Reseñas públicas por empresa
|--------------------------------------------------------------------------
*/

export async function getPublicReviewsByCompany(
  companyId: number,
  page = 1,
  perPage = 10,
): Promise<PublicReviewsResponse> {
  const response =
    await authApi.get<PublicReviewsResponse>(
      ENDPOINTS.REVIEWS
        .PUBLIC_BY_COMPANY(
          companyId,
        ),
      {
        params: {
          page,
          per_page: perPage,
        },
      },
    );

  return response.data;
}