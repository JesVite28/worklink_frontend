import axios from "axios";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  showError,
  showSuccess,
  showWarning,
} from "../../../shared/services/alertService";

import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../services/reviewService";

import type {
  CreateReviewPayload,
  Review,
  ReviewErrorResponse,
  ReviewPagination,
  ReviewRating,
  ReviewTypeFilter,
  UpdateReviewPayload,
} from "../models/review";

export type ReviewRatingFilter =
  | ReviewRating
  | "all";

function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (
    axios.isAxiosError<ReviewErrorResponse>(
      error,
    )
  ) {
    const responseData =
      error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.error) {
      return responseData.error;
    }

    if (responseData?.errors) {
      const firstValidationError =
        Object.values(
          responseData.errors,
        )
          .flat()
          .find(Boolean);

      if (firstValidationError) {
        return firstValidationError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}

export function useReviews() {
  const [
    reviews,
    setReviews,
  ] = useState<Review[]>([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<ReviewPagination | null>(
      null,
    );

  const [
    selectedReview,
    setSelectedReview,
  ] = useState<Review | null>(
    null,
  );

  const [
    reviewToDelete,
    setReviewToDelete,
  ] = useState<Review | null>(
    null,
  );

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<ReviewTypeFilter>(
      "all",
    );

  const [
    ratingFilter,
    setRatingFilter,
  ] =
    useState<ReviewRatingFilter>(
      "all",
    );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(12);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    processingReviewId,
    setProcessingReviewId,
  ] = useState<number | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
  |--------------------------------------------------------------------------
  | Cargar reseñas
  |--------------------------------------------------------------------------
  */

  const loadReviews = useCallback(
    async (
      showInitialLoading = true,
    ): Promise<void> => {
      try {
        if (showInitialLoading) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }

        setError(null);

        const response =
          await getReviews({
            type:
              typeFilter === "all"
                ? undefined
                : typeFilter,

            rating:
              ratingFilter === "all"
                ? undefined
                : ratingFilter,

            page,
            per_page: perPage,
          });

        setReviews(
          response.data.reviews,
        );

        setPagination(
          response.data.pagination,
        );
      } catch (requestError) {
        const message =
          getErrorMessage(
            requestError,
            "No se pudieron cargar las reseñas.",
          );

        setError(message);

        if (!showInitialLoading) {
          showError(message);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      page,
      perPage,
      ratingFilter,
      typeFilter,
    ],
  );

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  const handleTypeFilterChange = (
    value: ReviewTypeFilter,
  ): void => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleRatingFilterChange = (
    value: ReviewRatingFilter,
  ): void => {
    setRatingFilter(value);
    setPage(1);
  };

  const handlePerPageChange = (
    value: number,
  ): void => {
    setPerPage(value);
    setPage(1);
  };

  const handlePageChange = (
    value: number,
  ): void => {
    if (
      value < 1 ||
      (
        pagination &&
        value >
          pagination.last_page
      )
    ) {
      return;
    }

    setPage(value);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilters = (): void => {
    setTypeFilter("all");
    setRatingFilter("all");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Seleccionar reseña
  |--------------------------------------------------------------------------
  */

  const selectReview = (
    review: Review,
  ): void => {
    setSelectedReview(review);
  };

  const clearSelectedReview =
    (): void => {
      if (
        processingReviewId !== null ||
        isSaving
      ) {
        return;
      }

      setSelectedReview(null);
    };

  /*
  |--------------------------------------------------------------------------
  | Actualizar reseña local
  |--------------------------------------------------------------------------
  */

  const updateReviewInState = (
    updatedReview: Review,
  ): void => {
    setReviews(
      (currentReviews) =>
        currentReviews.map(
          (review) =>
            review.id ===
            updatedReview.id
              ? updatedReview
              : review,
        ),
    );

    setSelectedReview(
      (currentReview) =>
        currentReview?.id ===
        updatedReview.id
          ? updatedReview
          : currentReview,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Crear reseña
  |--------------------------------------------------------------------------
  */

  const handleCreateReview =
    async (
      payload: CreateReviewPayload,
    ): Promise<boolean> => {
      if (isSaving) {
        return false;
      }

      try {
        setIsSaving(true);

        await createReview(
          payload,
        );

        showSuccess(
          "Calificación publicada correctamente.",
        );

        setPage(1);

        if (page === 1) {
          await loadReviews(false);
        }

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo publicar la calificación.",
          ),
        );

        return false;
      } finally {
        setIsSaving(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Actualizar reseña
  |--------------------------------------------------------------------------
  */

  const handleUpdateReview =
    async (
      reviewId: number,
      payload: UpdateReviewPayload,
    ): Promise<boolean> => {
      if (
        isSaving ||
        processingReviewId !== null
      ) {
        return false;
      }

      if (
        payload.rating ===
          undefined &&
        payload.comment ===
          undefined
      ) {
        showWarning(
          "Debes modificar al menos un campo.",
        );

        return false;
      }

      try {
        setIsSaving(true);
        setProcessingReviewId(
          reviewId,
        );

        const updatedReview =
          await updateReview(
            reviewId,
            payload,
          );

        updateReviewInState(
          updatedReview,
        );

        showSuccess(
          "Calificación actualizada correctamente.",
        );

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo actualizar la calificación.",
          ),
        );

        return false;
      } finally {
        setIsSaving(false);
        setProcessingReviewId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Solicitar eliminación
  |--------------------------------------------------------------------------
  */

  const requestDeleteReview = (
    review: Review,
  ): void => {
    if (
      processingReviewId !== null
    ) {
      return;
    }

    setReviewToDelete(review);
  };

  const closeDeleteConfirmation =
    (): void => {
      if (
        processingReviewId !== null
      ) {
        return;
      }

      setReviewToDelete(null);
    };

  /*
  |--------------------------------------------------------------------------
  | Confirmar eliminación
  |--------------------------------------------------------------------------
  */

  const confirmDeleteReview =
    async (): Promise<boolean> => {
      if (
        !reviewToDelete ||
        processingReviewId !== null
      ) {
        return false;
      }

      const reviewId =
        reviewToDelete.id;

      try {
        setProcessingReviewId(
          reviewId,
        );

        const message =
          await deleteReview(
            reviewId,
          );

        showSuccess(
          message ||
            "Calificación eliminada correctamente.",
        );

        setReviewToDelete(null);

        setSelectedReview(
          (currentReview) =>
            currentReview?.id ===
            reviewId
              ? null
              : currentReview,
        );

        if (
          reviews.length === 1 &&
          page > 1
        ) {
          setPage(
            (currentPage) =>
              Math.max(
                currentPage - 1,
                1,
              ),
          );
        } else {
          await loadReviews(false);
        }

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo eliminar la calificación.",
          ),
        );

        return false;
      } finally {
        setProcessingReviewId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Recargar
  |--------------------------------------------------------------------------
  */

  const reloadReviews =
    useCallback(
      async (): Promise<void> => {
        await loadReviews(false);
      },
      [loadReviews],
    );

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const hasActiveFilters =
    useMemo(
      () =>
        typeFilter !== "all" ||
        ratingFilter !== "all",
      [
        ratingFilter,
        typeFilter,
      ],
    );

  const givenReviewsCount =
    useMemo(
      () =>
        reviews.filter(
          (review) =>
            typeFilter ===
              "given" ||
            review.evaluator_id !==
              review.evaluated_id,
        ).length,
      [
        reviews,
        typeFilter,
      ],
    );

  const hasReviews =
    reviews.length > 0;

  const isEmpty =
    !isLoading &&
    !isRefreshing &&
    !hasReviews;

  const isProcessingReview = (
    reviewId: number,
  ): boolean =>
    processingReviewId ===
    reviewId;

  return {
    reviews,
    pagination,

    selectedReview,
    reviewToDelete,

    typeFilter,
    ratingFilter,
    page,
    perPage,

    isLoading,
    isRefreshing,
    isSaving,
    error,

    hasReviews,
    isEmpty,
    hasActiveFilters,
    givenReviewsCount,

    totalReviews:
      pagination?.total ?? 0,

    handleTypeFilterChange,
    handleRatingFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    selectReview,
    clearSelectedReview,

    handleCreateReview,
    handleUpdateReview,

    requestDeleteReview,
    closeDeleteConfirmation,
    confirmDeleteReview,

    reloadReviews,
    isProcessingReview,
  };
}

export default useReviews;