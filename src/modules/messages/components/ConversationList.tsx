import {
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import {
  useMemo,
  useState,
} from "react";

import type {
  ConversationSummary,
  MessageUser,
} from "../models/message";

interface Props {
  conversations: ConversationSummary[];
  selectedUserId: number | null;

  isLoading: boolean;
  error: string | null;

  onSelect: (
    user: MessageUser,
  ) => void;

  onReload: () => void;
}

const roleLabels: Record<
  string,
  string
> = {
  admin: "Administrador",
  cliente: "Cliente",
  freelancer: "Freelancer",
  empresa: "Empresa",
};

function getFullName(
  user: MessageUser,
): string {
  return [
    user.name,
    user.last_name,
    user.maternal_last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getInitials(
  user: MessageUser,
): string {
  return [
    user.name?.charAt(0),
    user.last_name?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();
}

function formatConversationDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const isToday =
    date.toDateString() ===
    now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat(
      "es-MX",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(date);
  }

  const yesterday =
    new Date(now);

  yesterday.setDate(
    now.getDate() - 1,
  );

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Ayer";
  }

  const sameYear =
    date.getFullYear() ===
    now.getFullYear();

  return new Intl.DateTimeFormat(
    "es-MX",
    sameYear
      ? {
          day: "2-digit",
          month: "short",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
  ).format(date);
}

export default function ConversationList({
  conversations,
  selectedUserId,

  isLoading,
  error,

  onSelect,
  onReload,
}: Props) {
  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const filteredConversations =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          if (!conversation.user) {
            return false;
          }

          const fullName =
            getFullName(
              conversation.user,
            ).toLowerCase();

          const role =
            conversation.user.role
              ?.toLowerCase() ?? "";

          const lastMessage =
            conversation.last_message
              .content.toLowerCase();

          return (
            fullName.includes(
              normalizedSearch,
            ) ||
            role.includes(
              normalizedSearch,
            ) ||
            lastMessage.includes(
              normalizedSearch,
            )
          );
        },
      );
    }, [
      conversations,
      searchTerm,
    ]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-surface">
      {/* Encabezado */}
      <header className="shrink-0 border-b border-border px-4 py-5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text">
              Mensajes
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              Tus conversaciones recientes
            </p>
          </div>

          <button
            type="button"
            onClick={onReload}
            disabled={isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Actualizar conversaciones"
            title="Actualizar"
          >
            <ArrowPathIcon
              className={[
                "h-5 w-5",
                isLoading
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />
          </button>
        </div>

        {/* Buscador */}
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value,
              )
            }
            placeholder="Buscar conversación"
            className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </header>

      {/* Contenido */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-border" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-border" />

                  <div className="mt-2 h-3 w-full rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <ChatBubbleLeftRightIcon className="h-7 w-7" />
            </div>

            <h2 className="mt-4 font-semibold text-text">
              No se pudieron cargar
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={onReload}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <ArrowPathIcon className="h-5 w-5" />

              Intentar de nuevo
            </button>
          </div>
        ) : conversations.length ===
          0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ChatBubbleLeftRightIcon className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text">
              Sin conversaciones
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">
              Cuando intercambies mensajes con otro usuario, la conversación aparecerá aquí.
            </p>
          </div>
        ) : filteredConversations.length ===
          0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
            <MagnifyingGlassIcon className="h-10 w-10 text-text-muted" />

            <h2 className="mt-4 font-semibold text-text">
              Sin resultados
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              No encontramos conversaciones que coincidan con tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map(
              (conversation) => {
                const conversationUser =
                  conversation.user;

                if (!conversationUser) {
                  return null;
                }

                const fullName =
                  getFullName(
                    conversationUser,
                  );

                const initials =
                  getInitials(
                    conversationUser,
                  );

                const profilePhoto =
                  conversationUser
                    .profile_photo_url ||
                  conversationUser
                    .profile_photo;

                const isSelected =
                  selectedUserId ===
                  conversationUser.id;

                const hasUnreadMessages =
                  conversation.unread_count >
                  0;

                return (
                  <button
                    key={
                      conversationUser.id
                    }
                    type="button"
                    onClick={() =>
                      onSelect(
                        conversationUser,
                      )
                    }
                    className={[
                      "group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition",
                      isSelected
                        ? "bg-primary/10"
                        : "hover:bg-background",
                    ].join(" ")}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-sm font-semibold text-primary">
                        {profilePhoto ? (
                          <img
                            src={
                              profilePhoto
                            }
                            alt={`Perfil de ${fullName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : initials ? (
                          initials
                        ) : (
                          <UserCircleIcon className="h-8 w-8" />
                        )}
                      </span>

                      {conversationUser.is_active && (
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-surface bg-success" />
                      )}
                    </div>

                    {/* Información */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={[
                            "truncate text-sm",
                            hasUnreadMessages
                              ? "font-bold text-text"
                              : "font-semibold text-text",
                          ].join(" ")}
                        >
                          {fullName}
                        </p>

                        <span
                          className={[
                            "shrink-0 text-[11px]",
                            hasUnreadMessages
                              ? "font-semibold text-primary"
                              : "text-text-muted",
                          ].join(" ")}
                        >
                          {formatConversationDate(
                            conversation
                              .last_message
                              .created_at,
                          )}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-primary">
                          {conversationUser.role
                            ? roleLabels[
                                conversationUser
                                  .role
                              ] ??
                              conversationUser
                                .role
                            : "Usuario"}
                        </p>

                        {hasUnreadMessages && (
                          <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                            {conversation.unread_count >
                            99
                              ? "99+"
                              : conversation.unread_count}
                          </span>
                        )}
                      </div>

                      <p
                        className={[
                          "mt-1 truncate text-sm",
                          hasUnreadMessages
                            ? "font-medium text-text"
                            : "text-text-muted",
                        ].join(" ")}
                      >
                        {conversation
                          .last_message
                          .content}
                      </p>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>
    </aside>
  );
}