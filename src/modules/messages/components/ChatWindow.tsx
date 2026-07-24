import {
    ArrowLeftIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ClockIcon,
    PaperAirplaneIcon,
    TrashIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";

import type {
    ChatMessage,
    MessageUser,
} from "../models/message";

interface Props {
    currentUserId: number | null;

    selectedUser: MessageUser | null;
    messages: ChatMessage[];

    messageContent: string;
    messageLength: number;
    maxMessageLength: number;

    isLoading: boolean;
    isLoadingOlderMessages: boolean;
    isSending: boolean;

    hasOlderMessages: boolean;
    deletingMessageId: number | null;

    error: string | null;

    onMessageChange: (
        value: string,
    ) => void;

    onSend: () => Promise<boolean>;
    onLoadOlder: () => Promise<void>;

    onDeleteMessage: (
        message: ChatMessage,
    ) => Promise<boolean>;

    onClose: () => void;
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

function formatMessageTime(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            hour: "2-digit",
            minute: "2-digit",
        },
    ).format(date);
}

function formatMessageDate(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Fecha no disponible";
    }

    const now = new Date();

    if (
        date.toDateString() ===
        now.toDateString()
    ) {
        return "Hoy";
    }

    const yesterday = new Date(now);

    yesterday.setDate(
        now.getDate() - 1,
    );

    if (
        date.toDateString() ===
        yesterday.toDateString()
    ) {
        return "Ayer";
    }

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        },
    ).format(date);
}

function getDateKey(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    ].join("-");
}

export default function ChatWindow({
    currentUserId,

    selectedUser,
    messages,

    messageContent,
    messageLength,
    maxMessageLength,

    isLoading,
    isLoadingOlderMessages,
    isSending,

    hasOlderMessages,
    deletingMessageId,

    error,

    onMessageChange,
    onSend,
    onLoadOlder,
    onDeleteMessage,
    onClose,
}: Props) {
    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    const textareaRef =
        useRef<HTMLTextAreaElement>(null);

    const [
        messageToDelete,
        setMessageToDelete,
    ] = useState<ChatMessage | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Desplazar al mensaje más reciente
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            isLoading ||
            isLoadingOlderMessages ||
            messages.length === 0
        ) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [
        isLoading,
        isLoadingOlderMessages,
        messages.length,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Enviar formulario
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        const sent =
            await onSend();

        if (sent) {
            textareaRef.current?.focus();
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Enviar con Enter
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>,
    ): void => {
        if (
            event.key !== "Enter" ||
            event.shiftKey
        ) {
            return;
        }

        event.preventDefault();

        if (
            isSending ||
            !messageContent.trim()
        ) {
            return;
        }

        void onSend();
    };

    /*
    |--------------------------------------------------------------------------
    | Estado sin conversación
    |--------------------------------------------------------------------------
    */

    if (!selectedUser) {
        return (
            <section className="hidden h-full min-h-0 flex-1 items-center justify-center bg-background lg:flex">
                <div className="max-w-md px-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                        <ChatBubbleLeftRightIcon className="h-10 w-10" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-text">
                        Selecciona una conversación
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-text-muted">
                        Elige un usuario de la lista para consultar el
                        historial y continuar la conversación.
                    </p>
                </div>
            </section>
        );
    }

    const fullName =
        getFullName(selectedUser);

    const initials =
        getInitials(selectedUser);

    const profilePhoto =
        selectedUser.profile_photo_url ||
        selectedUser.profile_photo;

    return (
        <section className="flex h-full min-h-0 flex-1 flex-col bg-background">
            {/* Encabezado */}
            <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-4 sm:px-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-text-muted transition hover:border-primary/40 hover:text-primary lg:hidden"
                    aria-label="Volver a conversaciones"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-sm font-semibold text-primary">
                    {profilePhoto ? (
                        <img
                            src={profilePhoto}
                            alt={`Perfil de ${fullName}`}
                            className="h-full w-full object-cover"
                        />
                    ) : initials ? (
                        initials
                    ) : (
                        <UserCircleIcon className="h-8 w-8" />
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-text">
                        {fullName}
                    </h2>

                    <p className="mt-0.5 truncate text-xs text-text-muted">
                        {selectedUser.role
                            ? roleLabels[selectedUser.role] ??
                            selectedUser.role
                            : "Usuario de WorkLink"}
                    </p>
                </div>

                <div
                    className={[
                        "hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-flex",
                        selectedUser.is_active
                            ? "bg-success/10 text-success"
                            : "bg-text-muted/10 text-text-muted",
                    ].join(" ")}
                >
                    {selectedUser.is_active
                        ? "Cuenta activa"
                        : "Cuenta inactiva"}
                </div>
            </header>

            {/* Error */}
            {error && (
                <div className="shrink-0 border-b border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger sm:px-5">
                    {error}
                </div>
            )}

            {/* Historial */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                {isLoading ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                        <div className="h-11 w-11 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                        <p className="text-sm text-text-muted">
                            Cargando conversación...
                        </p>
                    </div>
                ) : (
                    <div className="mx-auto flex min-h-full max-w-4xl flex-col">
                        {hasOlderMessages && (
                            <div className="mb-5 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() =>
                                        void onLoadOlder()
                                    }
                                    disabled={
                                        isLoadingOlderMessages
                                    }
                                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-muted transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <ArrowPathIcon
                                        className={[
                                            "h-4 w-4",
                                            isLoadingOlderMessages
                                                ? "animate-spin"
                                                : "",
                                        ].join(" ")}
                                    />

                                    {isLoadingOlderMessages
                                        ? "Cargando..."
                                        : "Cargar mensajes anteriores"}
                                </button>
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <ChatBubbleLeftRightIcon className="h-8 w-8" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-text">
                                    Inicia la conversación
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                                    Todavía no existen mensajes con este
                                    usuario. Envía el primero desde el campo
                                    inferior.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map(
                                    (
                                        message,
                                        index,
                                    ) => {
                                        const isOwnMessage =
                                            currentUserId !== null &&
                                            message.sender_id ===
                                            currentUserId;

                                        const previousMessage =
                                            index > 0
                                                ? messages[index - 1]
                                                : null;

                                        const showDateDivider =
                                            !previousMessage ||
                                            getDateKey(
                                                previousMessage.created_at,
                                            ) !==
                                            getDateKey(
                                                message.created_at,
                                            );

                                        const canDelete =
                                            isOwnMessage &&
                                            !message.is_read;

                                        const isDeleting =
                                            deletingMessageId ===
                                            message.id;

                                        return (
                                            <div
                                                key={message.id}
                                            >
                                                {showDateDivider && (
                                                    <div className="my-5 flex items-center gap-3">
                                                        <div className="h-px flex-1 bg-border" />

                                                        <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-text-muted">
                                                            {formatMessageDate(
                                                                message.created_at,
                                                            )}
                                                        </span>

                                                        <div className="h-px flex-1 bg-border" />
                                                    </div>
                                                )}

                                                <div
                                                    className={[
                                                        "group flex",
                                                        isOwnMessage
                                                            ? "justify-end"
                                                            : "justify-start",
                                                    ].join(" ")}
                                                >
                                                    <div
                                                        className={[
                                                            "flex max-w-[88%] items-end gap-2 sm:max-w-[75%]",
                                                            isOwnMessage
                                                                ? "flex-row-reverse"
                                                                : "flex-row",
                                                        ].join(" ")}
                                                    >
                                                        {!isOwnMessage && (
                                                            <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                                {profilePhoto ? (
                                                                    <img
                                                                        src={
                                                                            profilePhoto
                                                                        }
                                                                        alt=""
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    initials
                                                                )}
                                                            </span>
                                                        )}

                                                        <div
                                                            className={[
                                                                "relative min-w-0 rounded-2xl px-4 py-3 shadow-sm",
                                                                isOwnMessage
                                                                    ? "rounded-br-md bg-primary text-white"
                                                                    : "rounded-bl-md border border-border bg-surface text-text",
                                                            ].join(" ")}
                                                        >
                                                            <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                                                {message.content}
                                                            </p>

                                                            <div
                                                                className={[
                                                                    "mt-1.5 flex items-center justify-end gap-1.5 text-[10px]",
                                                                    isOwnMessage
                                                                        ? "text-white/75"
                                                                        : "text-text-muted",
                                                                ].join(" ")}
                                                            >
                                                                <ClockIcon className="h-3 w-3" />

                                                                <span>
                                                                    {formatMessageTime(
                                                                        message.created_at,
                                                                    )}
                                                                </span>

                                                                {isOwnMessage && (
                                                                    <>
                                                                        <span>
                                                                            ·
                                                                        </span>

                                                                        {message.is_read ? (
                                                                            <span className="inline-flex items-center gap-1">
                                                                                <CheckCircleIcon className="h-3.5 w-3.5" />

                                                                                Leído
                                                                            </span>
                                                                        ) : (
                                                                            <span>
                                                                                Enviado
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {canDelete && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMessageToDelete(
                                                                        message,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                                className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted opacity-100 transition hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
                                                                aria-label="Retirar mensaje"
                                                                title="Retirar mensaje"
                                                            >
                                                                {isDeleting ? (
                                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-danger/20 border-t-danger" />
                                                                ) : (
                                                                    <TrashIcon className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="shrink-0 border-t border-border bg-surface px-4 py-4 sm:px-5"
            >
                <div className="mx-auto max-w-4xl">
                    <div className="flex items-end gap-3">
                        <div className="min-w-0 flex-1">
                            <textarea
                                ref={textareaRef}
                                value={messageContent}
                                onChange={(event) =>
                                    onMessageChange(
                                        event.target.value,
                                    )
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                disabled={
                                    isSending ||
                                    !selectedUser.is_active
                                }
                                rows={1}
                                maxLength={
                                    maxMessageLength
                                }
                                placeholder={
                                    selectedUser.is_active
                                        ? "Escribe un mensaje..."
                                        : "No puedes enviar mensajes a una cuenta inactiva"
                                }
                                className="max-h-36 min-h-12 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <div className="mt-1 flex items-center justify-between gap-3 px-1">
                                <p className="text-[11px] text-text-muted">
                                    Enter para enviar, Shift + Enter para una
                                    nueva línea.
                                </p>

                                <span
                                    className={[
                                        "shrink-0 text-[11px]",
                                        messageLength >=
                                            maxMessageLength
                                            ? "text-danger"
                                            : "text-text-muted",
                                    ].join(" ")}
                                >
                                    {messageLength}/
                                    {maxMessageLength}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isSending ||
                                !messageContent.trim() ||
                                !selectedUser.is_active
                            }
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Enviar mensaje"
                        >
                            {isSending ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <PaperAirplaneIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </form>
            {messageToDelete && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-message-title"
                    onMouseDown={() => {
                        if (
                            deletingMessageId === null
                        ) {
                            setMessageToDelete(null);
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                            <TrashIcon className="h-7 w-7" />
                        </div>

                        <div className="mt-5 text-center">
                            <h2
                                id="delete-message-title"
                                className="text-xl font-bold text-text"
                            >
                                ¿Retirar este mensaje?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-text-muted">
                                El mensaje desaparecerá de la conversación y esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setMessageToDelete(null)
                                }
                                disabled={
                                    deletingMessageId !== null
                                }
                                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={
                                    deletingMessageId !== null
                                }
                                onClick={async () => {
                                    const deleted =
                                        await onDeleteMessage(
                                            messageToDelete,
                                        );

                                    if (deleted) {
                                        setMessageToDelete(null);
                                    }
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingMessageId ===
                                    messageToDelete.id ? (
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <TrashIcon className="h-5 w-5" />
                                )}

                                {deletingMessageId ===
                                    messageToDelete.id
                                    ? "Retirando..."
                                    : "Sí, retirar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}