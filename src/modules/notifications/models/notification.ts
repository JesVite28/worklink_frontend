export type NotificationType =
  | "message"
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "contract_request"
  | "contract_request_accepted"
  | "contract_request_rejected"
  | "contract_request_canceled"
  | "contract_created"
  | "contract_completed"
  | "contract_canceled"
  | "review_received";

/*
|--------------------------------------------------------------------------
| Notificación
|--------------------------------------------------------------------------
*/

export interface AppNotification {
  id: number;
  user_id: number;

  type: NotificationType;
  message: string;

  is_read: boolean;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Paginación
|--------------------------------------------------------------------------
*/

export interface NotificationPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/*
|--------------------------------------------------------------------------
| Filtros del backend
|--------------------------------------------------------------------------
*/

export interface NotificationFilters {
  is_read?: boolean | 0 | 1;
  type?: NotificationType;
  per_page?: number;
  page?: number;
}

/*
|--------------------------------------------------------------------------
| Filtros del frontend
|--------------------------------------------------------------------------
*/

export type NotificationReadFilter =
  | "all"
  | "unread"
  | "read";

export type NotificationTypeFilter =
  | "all"
  | NotificationType;

export interface NotificationViewFilters {
  readStatus: NotificationReadFilter;
  type: NotificationTypeFilter;
}

/*
|--------------------------------------------------------------------------
| Respuesta del listado
|--------------------------------------------------------------------------
*/

export interface NotificationsResponse {
  success: boolean;
  message: string;

  data: {
    notifications: AppNotification[];
    unread_count: number;
    pagination: NotificationPagination;
  };
}

/*
|--------------------------------------------------------------------------
| Contador de no leídas
|--------------------------------------------------------------------------
*/

export interface NotificationUnreadCountResponse {
  success: boolean;
  message: string;

  data: {
    unread_count: number;
  };
}

/*
|--------------------------------------------------------------------------
| Notificación individual actualizada
|--------------------------------------------------------------------------
*/

export interface NotificationResponse {
  success: boolean;
  message: string;

  data: {
    notification: AppNotification;
  };
}

/*
|--------------------------------------------------------------------------
| Marcar todas como leídas
|--------------------------------------------------------------------------
*/

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  message: string;

  data: {
    updated_notifications: number;
  };
}

/*
|--------------------------------------------------------------------------
| Eliminar
|--------------------------------------------------------------------------
*/

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface NotificationErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;

  errors?: Record<
    string,
    string[]
  >;
}