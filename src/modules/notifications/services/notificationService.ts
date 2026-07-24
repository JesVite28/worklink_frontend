import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  AppNotification,
  DeleteNotificationResponse,
  MarkAllNotificationsReadResponse,
  NotificationFilters,
  NotificationResponse,
  NotificationsResponse,
  NotificationUnreadCountResponse,
} from "../models/notification";

/*
|--------------------------------------------------------------------------
| Construcción de parámetros
|--------------------------------------------------------------------------
*/

function buildNotificationParams(
  filters: NotificationFilters = {},
): Record<string, string | number> {
  const params: Record<
    string,
    string | number
  > = {};

  if (filters.is_read !== undefined) {
    params.is_read =
      typeof filters.is_read === "boolean"
        ? filters.is_read
          ? 1
          : 0
        : filters.is_read;
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
| Listar notificaciones
|--------------------------------------------------------------------------
*/

export async function getNotifications(
  filters: NotificationFilters = {},
): Promise<NotificationsResponse> {
  const response =
    await authApi.get<NotificationsResponse>(
      ENDPOINTS.NOTIFICATIONS.BASE,
      {
        params:
          buildNotificationParams(
            filters,
          ),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Contador de no leídas
|--------------------------------------------------------------------------
*/

export async function getUnreadNotificationCount(): Promise<number> {
  const response =
    await authApi.get<NotificationUnreadCountResponse>(
      ENDPOINTS.NOTIFICATIONS
        .UNREAD_COUNT,
    );

  return response.data.data.unread_count;
}

/*
|--------------------------------------------------------------------------
| Marcar una notificación como leída
|--------------------------------------------------------------------------
*/

export async function markNotificationAsRead(
  notificationId: number,
): Promise<AppNotification> {
  const response =
    await authApi.patch<NotificationResponse>(
      ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(
        notificationId,
      ),
    );

  return response.data.data.notification;
}

/*
|--------------------------------------------------------------------------
| Marcar todas como leídas
|--------------------------------------------------------------------------
*/

export async function markAllNotificationsAsRead(): Promise<number> {
  const response =
    await authApi.patch<MarkAllNotificationsReadResponse>(
      ENDPOINTS.NOTIFICATIONS
        .MARK_ALL_AS_READ,
    );

  return response.data.data
    .updated_notifications;
}

/*
|--------------------------------------------------------------------------
| Eliminar notificación
|--------------------------------------------------------------------------
*/

export async function deleteNotification(
  notificationId: number,
): Promise<string> {
  const response =
    await authApi.delete<DeleteNotificationResponse>(
      ENDPOINTS.NOTIFICATIONS.DELETE(
        notificationId,
      ),
    );

  return response.data.message;
}