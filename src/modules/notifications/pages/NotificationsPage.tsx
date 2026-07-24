import {
  ArrowPathIcon,
  BellAlertIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import NotificationCard from "../components/NotificationCard";
import NotificationDeleteConfirmation from "../components/NotificationDeleteConfirmation";
import NotificationFilters from "../components/NotificationFilters";
import NotificationPagination from "../components/NotificationPagination";

import useNotifications from "../hooks/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    pagination,

    unreadCount,

    readFilter,
    typeFilter,
    perPage,

    notificationToDelete,

    isLoading,
    isRefreshing,
    isMarkingAll,

    error,

    hasNotifications,
    hasActiveFilters,

    reloadNotifications,

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
  } = useNotifications();

  const isDeleting =
    notificationToDelete !== null &&
    isProcessingNotification(
      notificationToDelete.id,
    );

  return (
    <>
      <div className="space-y-6">
        {/* Encabezado */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-card sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                <BellIcon className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-medium text-white/80">
                  Centro de actividad
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Notificaciones
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                  Consulta mensajes, solicitudes, postulaciones,
                  contratos y reseñas relacionadas con tu cuenta.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur">
                    <BellAlertIcon className="h-4 w-4" />

                    {unreadCount === 1
                      ? "1 notificación pendiente"
                      : `${unreadCount} notificaciones pendientes`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => {
                  void reloadNotifications();
                }}
                disabled={
                  isLoading ||
                  isRefreshing ||
                  isMarkingAll
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowPathIcon
                  className={[
                    "h-5 w-5",
                    isRefreshing
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />

                Actualizar
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleMarkAllAsRead();
                }}
                disabled={
                  isLoading ||
                  isRefreshing ||
                  isMarkingAll ||
                  unreadCount === 0
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-soft transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isMarkingAll ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}

                {isMarkingAll
                  ? "Marcando..."
                  : "Marcar todas como leídas"}
              </button>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <NotificationFilters
          readFilter={readFilter}
          typeFilter={typeFilter}
          perPage={perPage}
          totalResults={
            pagination?.total ?? 0
          }
          unreadCount={unreadCount}
          isLoading={
            isLoading ||
            isRefreshing
          }
          hasActiveFilters={
            hasActiveFilters
          }
          onReadFilterChange={
            handleReadFilterChange
          }
          onTypeFilterChange={
            handleTypeFilterChange
          }
          onPerPageChange={
            handlePerPageChange
          }
          onResetFilters={
            resetFilters
          }
        />

        {/* Error */}
        {error && (
          <section className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <ExclamationTriangleIcon className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-text">
              No se pudieron cargar las notificaciones
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void reloadNotifications();
              }}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />

              Intentar de nuevo
            </button>
          </section>
        )}

        {/* Carga inicial */}
        {!error &&
          isLoading && (
            <section className="space-y-4">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <article
                  key={index}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-border" />

                    <div className="flex-1">
                      <div className="h-5 w-48 max-w-full rounded bg-border" />

                      <div className="mt-4 h-4 w-full rounded bg-border" />

                      <div className="mt-2 h-4 w-3/4 rounded bg-border" />

                      <div className="mt-5 flex justify-end gap-3 border-t border-border pt-4">
                        <div className="h-10 w-40 rounded-xl bg-border" />

                        <div className="h-10 w-28 rounded-xl bg-border" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

        {/* Actualización silenciosa */}
        {!error &&
          !isLoading &&
          isRefreshing && (
            <section className="flex items-center justify-center rounded-2xl border border-border bg-surface px-5 py-6 shadow-card">
              <div className="flex items-center gap-3 text-text-muted">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />

                <p className="text-sm font-medium">
                  Actualizando notificaciones...
                </p>
              </div>
            </section>
          )}

        {/* Sin resultados */}
        {!error &&
          !isLoading &&
          !isRefreshing &&
          !hasNotifications && (
            <section className="rounded-2xl border border-dashed border-border bg-surface px-5 py-14 text-center shadow-card">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BellIcon className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-text">
                {hasActiveFilters
                  ? "No hay resultados"
                  : "No tienes notificaciones"}
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-muted">
                {hasActiveFilters
                  ? "No encontramos notificaciones que coincidan con los filtros seleccionados."
                  : "Las novedades relacionadas con tu cuenta aparecerán en esta sección."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Limpiar filtros
                </button>
              )}
            </section>
          )}

        {/* Listado */}
        {!error &&
          !isLoading &&
          !isRefreshing &&
          hasNotifications && (
            <section className="space-y-4">
              {notifications.map(
                (notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={
                      notification
                    }
                    isProcessing={isProcessingNotification(
                      notification.id,
                    )}
                    onMarkAsRead={(
                      selectedNotification,
                    ) => {
                      void handleMarkAsRead(
                        selectedNotification,
                      );
                    }}
                    onDelete={
                      requestDeleteNotification
                    }
                  />
                ),
              )}
            </section>
          )}

        {/* Paginación */}
        {!error &&
          !isLoading && (
            <NotificationPagination
              pagination={pagination}
              isLoading={
                isRefreshing
              }
              onPageChange={
                handlePageChange
              }
            />
          )}
      </div>

      {/* Confirmación de eliminación */}
      <NotificationDeleteConfirmation
        notification={
          notificationToDelete
        }
        isProcessing={
          isDeleting
        }
        onClose={
          closeDeleteConfirmation
        }
        onConfirm={
          confirmDeleteNotification
        }
      />
    </>
  );
}