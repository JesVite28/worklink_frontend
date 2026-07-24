export type ReviewTypeFilter =
  | "all"
  | "given"
  | "received";

export type ReviewRating =
  | 1
  | 2
  | 3
  | 4
  | 5;

/*
|--------------------------------------------------------------------------
| Usuario relacionado
|--------------------------------------------------------------------------
*/

export interface ReviewUser {
  id: number;

  name: string;
  last_name: string;
  maternal_last_name: string | null;

  profile_photo_url: string | null;

  is_active: boolean;

  role:
    | "admin"
    | "cliente"
    | "empresa"
    | "freelancer"
    | string
    | null;
}

/*
|--------------------------------------------------------------------------
| Servicio relacionado
|--------------------------------------------------------------------------
*/

export interface ReviewService {
  id: number;
  title: string;
}

/*
|--------------------------------------------------------------------------
| Reseña
|--------------------------------------------------------------------------
*/

export interface Review {
  id: number;

  contract_id: number;

  evaluator_id: number;
  evaluator: ReviewUser | null;

  evaluated_id: number;
  evaluated: ReviewUser | null;

  rating: ReviewRating;
  comment: string | null;

  service: ReviewService | null;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Paginación
|--------------------------------------------------------------------------
*/

export interface ReviewPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/*
|--------------------------------------------------------------------------
| Filtros
|--------------------------------------------------------------------------
*/

export interface ReviewFilters {
  rating?: ReviewRating;
  type?: Exclude<
    ReviewTypeFilter,
    "all"
  >;

  per_page?: number;
  page?: number;
}

/*
|--------------------------------------------------------------------------
| Crear reseña
|--------------------------------------------------------------------------
*/

export interface CreateReviewPayload {
  contract_id: number;
  rating: ReviewRating;
  comment?: string | null;
}

/*
|--------------------------------------------------------------------------
| Actualizar reseña
|--------------------------------------------------------------------------
*/

export interface UpdateReviewPayload {
  rating?: ReviewRating;
  comment?: string | null;
}

/*
|--------------------------------------------------------------------------
| Listado privado
|--------------------------------------------------------------------------
*/

export interface ReviewsResponse {
  success: boolean;
  message: string;

  data: {
    reviews: Review[];
    pagination: ReviewPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Respuesta individual
|--------------------------------------------------------------------------
*/

export interface ReviewResponse {
  success: boolean;
  message: string;

  data: {
    review: Review;
  };
}

/*
|--------------------------------------------------------------------------
| Reseñas públicas
|--------------------------------------------------------------------------
*/

export interface PublicReviewsResponse {
  success: boolean;
  message: string;

  data: {
    user: ReviewUser;

    average_rating:
      | number
      | null;

    reviews_count: number;

    reviews: Review[];

    pagination: ReviewPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Eliminación
|--------------------------------------------------------------------------
*/

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface ReviewErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;

  errors?: Record<
    string,
    string[]
  >;
}