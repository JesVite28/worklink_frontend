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
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";

import type {
  AppNotification,
  NotificationErrorResponse,
  NotificationPagination,
  NotificationReadFilter,
  NotificationTypeFilter,
} from "../models/notification";

function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (
    axios.isAxiosError<NotificationErrorResponse>(
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
      const firstError =
        Object.values(
          responseData.errors,
        )
          .flat()
          .find(Boolean);

      if (firstError) {
        return firstError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}

export default function useNotifications() {
  const [
    notifications,
    setNotifications,
  ] = useState<AppNotification[]>([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<NotificationPagination | null>(
      null,
    );

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    readFilter,
    setReadFilter,
  ] =
    useState<NotificationReadFilter>(
      "all",
    );

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<NotificationTypeFilter>(
      "all",
    );

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    perPage,
    setPerPage,
  ] = useState(20);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isMarkingAll,
    setIsMarkingAll,
  ] = useState(false);

  const [
    processingNotificationId,
    setProcessingNotificationId,
  ] = useState<number | null>(
    null,
  );

  const [
    notificationToDelete,
    setNotificationToDelete,
  ] = useState<AppNotification | null>(
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
  | Cargar notificaciones
  |--------------------------------------------------------------------------
  */

  const loadNotifications =
    useCallback(
      async (
        showLoading = true,
      ): Promise<void> => {
        try {
          if (showLoading) {
            setIsLoading(true);
          } else {
            setIsRefreshing(true);
          }

          setError(null);

          const response =
            await getNotifications({
              is_read:
                readFilter === "all"
                  ? undefined
                  : readFilter ===
                      "read"
                    ? 1
                    : 0,

              type:
                typeFilter === "all"
                  ? undefined
                  : typeFilter,

              page,
              per_page: perPage,
            });

          setNotifications(
            response.data.notifications,
          );

          setPagination(
            response.data.pagination,
          );

          setUnreadCount(
            response.data.unread_count,
          );
        } catch (requestError) {
          const message =
            getErrorMessage(
              requestError,
              "No se pudieron cargar las notificaciones.",
            );

          setError(message);
          setNotifications([]);
          setPagination(null);
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      },
      [
        page,
        perPage,
        readFilter,
        typeFilter,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Actualizar únicamente el contador
  |--------------------------------------------------------------------------
  */

  const refreshUnreadCount =
    useCallback(
      async (): Promise<void> => {
        try {
          const count =
            await getUnreadNotificationCount();

          setUnreadCount(count);
        } catch {
          // Evitamos interrumpir la interfaz
          // por una actualización silenciosa.
        }
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Carga inicial y actualización automática
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const intervalId =
      window.setInterval(() => {
        void refreshUnreadCount();
      }, 30000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [refreshUnreadCount]);

  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  const handleReadFilterChange = (
    value: NotificationReadFilter,
  ): void => {
    setReadFilter(value);
    setPage(1);
  };

  const handleTypeFilterChange = (
    value: NotificationTypeFilter,
  ): void => {
    setTypeFilter(value);
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
    setReadFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Marcar una como leída
  |--------------------------------------------------------------------------
  */

  const handleMarkAsRead =
    async (
      notification: AppNotification,
    ): Promise<boolean> => {
      if (notification.is_read) {
        return true;
      }

      if (
        processingNotificationId !==
        null
      ) {
        return false;
      }

      try {
        setProcessingNotificationId(
          notification.id,
        );

        const updatedNotification =
          await markNotificationAsRead(
            notification.id,
          );

        setNotifications(
          (currentNotifications) =>
            currentNotifications.map(
              (currentNotification) =>
                currentNotification.id ===
                updatedNotification.id
                  ? updatedNotification
                  : currentNotification,
            ),
        );

        setUnreadCount(
          (currentCount) =>
            Math.max(
              currentCount - 1,
              0,
            ),
        );

        if (
          readFilter === "unread"
        ) {
          await loadNotifications(
            false,
          );
        }

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo marcar la notificación como leída.",
          ),
        );

        return false;
      } finally {
        setProcessingNotificationId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Marcar todas como leídas
  |--------------------------------------------------------------------------
  */

  const handleMarkAllAsRead =
    async (): Promise<boolean> => {
      if (isMarkingAll) {
        return false;
      }

      if (unreadCount === 0) {
        showWarning(
          "No tienes notificaciones pendientes por leer.",
        );

        return false;
      }

      try {
        setIsMarkingAll(true);

        const updatedCount =
          await markAllNotificationsAsRead();

        setNotifications(
          (currentNotifications) =>
            currentNotifications.map(
              (notification) => ({
                ...notification,
                is_read: true,
              }),
            ),
        );

        setUnreadCount(0);

        showSuccess(
          updatedCount === 1
            ? "Se marcó una notificación como leída."
            : `Se marcaron ${updatedCount} notificaciones como leídas.`,
        );

        if (
          readFilter === "unread"
        ) {
          await loadNotifications(
            false,
          );
        }

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudieron marcar las notificaciones como leídas.",
          ),
        );

        return false;
      } finally {
        setIsMarkingAll(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Solicitar eliminación
  |--------------------------------------------------------------------------
  */

  const requestDeleteNotification = (
    notification: AppNotification,
  ): void => {
    if (
      processingNotificationId !==
      null
    ) {
      return;
    }

    setNotificationToDelete(
      notification,
    );
  };

  const closeDeleteConfirmation =
    (): void => {
      if (
        processingNotificationId !==
        null
      ) {
        return;
      }

      setNotificationToDelete(null);
    };

  /*
  |--------------------------------------------------------------------------
  | Confirmar eliminación
  |--------------------------------------------------------------------------
  */

  const confirmDeleteNotification =
    async (): Promise<boolean> => {
      if (
        !notificationToDelete ||
        processingNotificationId !==
          null
      ) {
        return false;
      }

      const notification =
        notificationToDelete;

      try {
        setProcessingNotificationId(
          notification.id,
        );

        const message =
          await deleteNotification(
            notification.id,
          );

        if (!notification.is_read) {
          setUnreadCount(
            (currentCount) =>
              Math.max(
                currentCount - 1,
                0,
              ),
          );
        }

        setNotificationToDelete(
          null,
        );

        showSuccess(
          message ||
            "Notificación eliminada correctamente.",
        );

        if (
          notifications.length ===
            1 &&
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
          await loadNotifications(
            false,
          );
        }

        return true;
      } catch (requestError) {
        showError(
          getErrorMessage(
            requestError,
            "No se pudo eliminar la notificación.",
          ),
        );

        return false;
      } finally {
        setProcessingNotificationId(
          null,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Recargar
  |--------------------------------------------------------------------------
  */

  const reloadNotifications =
    useCallback(
      async (): Promise<void> => {
        await loadNotifications(
          false,
        );
      },
      [loadNotifications],
    );

  /*
  |--------------------------------------------------------------------------
  | Valores calculados
  |--------------------------------------------------------------------------
  */

  const hasNotifications =
    notifications.length > 0;

  const hasActiveFilters =
    readFilter !== "all" ||
    typeFilter !== "all";

  const readNotificationsCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            notification.is_read,
        ).length,
      [notifications],
    );

  const unreadNotificationsOnPage =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.is_read,
        ).length,
      [notifications],
    );

  const isProcessingNotification = (
    notificationId: number,
  ): boolean =>
    processingNotificationId ===
    notificationId;

  return {
    notifications,
    pagination,

    unreadCount,
    readNotificationsCount,
    unreadNotificationsOnPage,

    readFilter,
    typeFilter,
    page,
    perPage,

    notificationToDelete,

    isLoading,
    isRefreshing,
    isMarkingAll,

    error,

    hasNotifications,
    hasActiveFilters,

    loadNotifications,
    reloadNotifications,
    refreshUnreadCount,

    handleReadFilterChange,
    handleTypeFilterChange,
    handlePerPageChange,
    handlePageChange,
    resetFilters,

    handleMarkAsRead,
    handleMarkAllAsRead,

    requestDeleteNotification,
    closeDeleteConfirmation,
    confirmDeleteNotification,

    isProcessingNotification,
  };
}