import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import { useAuth } from "../../../context/useAuth";

import type {
  ChatMessage,
  ConversationSummary,
  MessagePagination,
  MessageUser,
} from "../models/message";

import {
  deleteMessage,
  getConversation,
  getConversations,
  markConversationAsRead,
  sendMessage,
} from "../services/messageService";

const EMPTY_PAGINATION: MessagePagination = {
  current_page: 1,
  last_page: 1,
  per_page: 30,
  total: 0,
};

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message;

    if (
      typeof responseMessage === "string" &&
      responseMessage.trim()
    ) {
      return responseMessage;
    }

    const validationErrors =
      error.response?.data?.errors;

    if (
      validationErrors &&
      typeof validationErrors === "object"
    ) {
      const firstError = Object.values(
        validationErrors,
      )
        .flat()
        .find(
          (message) =>
            typeof message === "string",
        );

      if (typeof firstError === "string") {
        return firstError;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

function sortMessages(
  messages: ChatMessage[],
): ChatMessage[] {
  return [...messages].sort(
    (firstMessage, secondMessage) =>
      new Date(
        firstMessage.created_at,
      ).getTime() -
      new Date(
        secondMessage.created_at,
      ).getTime(),
  );
}

function mergeMessages(
  currentMessages: ChatMessage[],
  incomingMessages: ChatMessage[],
): ChatMessage[] {
  const messagesMap = new Map<
    number,
    ChatMessage
  >();

  currentMessages.forEach((message) => {
    messagesMap.set(
      message.id,
      message,
    );
  });

  incomingMessages.forEach((message) => {
    messagesMap.set(
      message.id,
      message,
    );
  });

  return sortMessages(
    Array.from(messagesMap.values()),
  );
}

export default function useMessages() {
  const { user } = useAuth();

  const currentUserId =
    user?.id ?? null;

  const [
    conversations,
    setConversations,
  ] = useState<ConversationSummary[]>([]);

  const [
    selectedUser,
    setSelectedUser,
  ] = useState<MessageUser | null>(null);

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<MessagePagination>(
    EMPTY_PAGINATION,
  );

  const [
    messageContent,
    setMessageContent,
  ] = useState("");

  const [
    isLoadingConversations,
    setIsLoadingConversations,
  ] = useState(true);

  const [
    isLoadingConversation,
    setIsLoadingConversation,
  ] = useState(false);

  const [
    isLoadingOlderMessages,
    setIsLoadingOlderMessages,
  ] = useState(false);

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const [
    deletingMessageId,
    setDeletingMessageId,
  ] = useState<number | null>(null);

  const [
    conversationsError,
    setConversationsError,
  ] = useState<string | null>(null);

  const [
    conversationError,
    setConversationError,
  ] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Conversaciones
  |--------------------------------------------------------------------------
  */

  const loadConversations =
    useCallback(
      async (
        showLoading = true,
      ): Promise<void> => {
        if (showLoading) {
          setIsLoadingConversations(true);
        }

        setConversationsError(null);

        try {
          const conversationData =
            await getConversations();

          setConversations(
            conversationData.filter(
              (
                conversation,
              ): conversation is ConversationSummary & {
                user: MessageUser;
              } =>
                conversation.user !== null,
            ),
          );
        } catch (requestError) {
          setConversationsError(
            getErrorMessage(
              requestError,
              "No se pudieron cargar las conversaciones.",
            ),
          );
        } finally {
          if (showLoading) {
            setIsLoadingConversations(
              false,
            );
          }
        }
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Marcar conversación como leída
  |--------------------------------------------------------------------------
  */

  const markSelectedConversationAsRead =
    useCallback(
      async (
        otherUserId: number,
      ): Promise<void> => {
        try {
          await markConversationAsRead(
            otherUserId,
          );

          setConversations(
            (currentConversations) =>
              currentConversations.map(
                (conversation) =>
                  conversation.user?.id ===
                  otherUserId
                    ? {
                        ...conversation,
                        unread_count: 0,
                      }
                    : conversation,
              ),
          );

          setMessages(
            (currentMessages) =>
              currentMessages.map(
                (message) =>
                  message.sender_id ===
                    otherUserId &&
                  message.receiver_id ===
                    currentUserId
                    ? {
                        ...message,
                        is_read: true,
                      }
                    : message,
              ),
          );
        } catch {
          /*
           * No bloqueamos el chat si falla
           * únicamente la actualización de lectura.
           */
        }
      },
      [currentUserId],
    );

  /*
  |--------------------------------------------------------------------------
  | Abrir conversación desde la lista
  |--------------------------------------------------------------------------
  */

  const openConversation =
    useCallback(
      async (
        conversationUser: MessageUser,
      ): Promise<void> => {
        if (
          selectedUser?.id ===
            conversationUser.id &&
          messages.length > 0
        ) {
          return;
        }

        setSelectedUser(
          conversationUser,
        );

        setMessages([]);

        setPagination(
          EMPTY_PAGINATION,
        );

        setMessageContent("");
        setConversationError(null);
        setIsLoadingConversation(true);

        try {
          const conversationData =
            await getConversation(
              conversationUser.id,
              {
                page: 1,
                per_page: 30,
              },
            );

          setSelectedUser(
            conversationData.user,
          );

          setMessages(
            sortMessages(
              conversationData.messages,
            ),
          );

          setPagination(
            conversationData.pagination,
          );

          await markSelectedConversationAsRead(
            conversationUser.id,
          );
        } catch (requestError) {
          setConversationError(
            getErrorMessage(
              requestError,
              "No se pudo cargar la conversación.",
            ),
          );
        } finally {
          setIsLoadingConversation(false);
        }
      },
      [
        markSelectedConversationAsRead,
        messages.length,
        selectedUser?.id,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Abrir conversación directamente mediante userId
  |--------------------------------------------------------------------------
  |
  | Permite iniciar una conversación con un usuario aunque todavía
  | no exista ningún mensaje previo entre ambos.
  |
  */

  const openConversationByUserId =
    useCallback(
      async (
        userId: number,
      ): Promise<boolean> => {
        if (
          !Number.isInteger(userId) ||
          userId <= 0
        ) {
          setConversationError(
            "El usuario seleccionado no es válido.",
          );

          return false;
        }

        if (
          currentUserId !== null &&
          userId === currentUserId
        ) {
          setConversationError(
            "No puedes iniciar una conversación contigo mismo.",
          );

          return false;
        }

        if (
          selectedUser?.id === userId &&
          !isLoadingConversation
        ) {
          return true;
        }

        setMessages([]);

        setPagination(
          EMPTY_PAGINATION,
        );

        setMessageContent("");
        setConversationError(null);
        setIsLoadingConversation(true);

        try {
          const conversationData =
            await getConversation(
              userId,
              {
                page: 1,
                per_page: 30,
              },
            );

          setSelectedUser(
            conversationData.user,
          );

          setMessages(
            sortMessages(
              conversationData.messages,
            ),
          );

          setPagination(
            conversationData.pagination,
          );

          await markSelectedConversationAsRead(
            userId,
          );

          return true;
        } catch (requestError) {
          setSelectedUser(null);

          setMessages([]);

          setPagination(
            EMPTY_PAGINATION,
          );

          setConversationError(
            getErrorMessage(
              requestError,
              "No se pudo abrir la conversación con este usuario.",
            ),
          );

          return false;
        } finally {
          setIsLoadingConversation(false);
        }
      },
      [
        currentUserId,
        isLoadingConversation,
        markSelectedConversationAsRead,
        selectedUser?.id,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Cargar mensajes anteriores
  |--------------------------------------------------------------------------
  */

  const loadOlderMessages =
    useCallback(async (): Promise<void> => {
      if (
        !selectedUser ||
        isLoadingOlderMessages ||
        pagination.current_page >=
          pagination.last_page
      ) {
        return;
      }

      setIsLoadingOlderMessages(true);
      setConversationError(null);

      try {
        const nextPage =
          pagination.current_page + 1;

        const conversationData =
          await getConversation(
            selectedUser.id,
            {
              page: nextPage,
              per_page:
                pagination.per_page,
            },
          );

        setMessages(
          (currentMessages) =>
            mergeMessages(
              conversationData.messages,
              currentMessages,
            ),
        );

        setPagination(
          conversationData.pagination,
        );
      } catch (requestError) {
        setConversationError(
          getErrorMessage(
            requestError,
            "No se pudieron cargar los mensajes anteriores.",
          ),
        );
      } finally {
        setIsLoadingOlderMessages(
          false,
        );
      }
    }, [
      isLoadingOlderMessages,
      pagination.current_page,
      pagination.last_page,
      pagination.per_page,
      selectedUser,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Actualizar conversación silenciosamente
  |--------------------------------------------------------------------------
  */

  const refreshCurrentConversation =
    useCallback(async (): Promise<void> => {
      if (!selectedUser) {
        return;
      }

      try {
        const conversationData =
          await getConversation(
            selectedUser.id,
            {
              page: 1,
              per_page: 30,
            },
          );

        setMessages(
          (currentMessages) =>
            mergeMessages(
              currentMessages,
              conversationData.messages,
            ),
        );

        setSelectedUser(
          conversationData.user,
        );

        await markSelectedConversationAsRead(
          selectedUser.id,
        );
      } catch {
        /*
         * La actualización automática no reemplaza
         * el contenido actual por un error.
         */
      }
    }, [
      markSelectedConversationAsRead,
      selectedUser,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Escribir mensaje
  |--------------------------------------------------------------------------
  */

  const handleMessageContentChange =
    useCallback(
      (value: string): void => {
        if (value.length > 5000) {
          return;
        }

        setMessageContent(value);
        setConversationError(null);
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Enviar mensaje
  |--------------------------------------------------------------------------
  */

  const sendCurrentMessage =
    useCallback(async (): Promise<boolean> => {
      const normalizedContent =
        messageContent.trim();

      if (!selectedUser) {
        setConversationError(
          "Selecciona una conversación para enviar un mensaje.",
        );

        return false;
      }

      if (!normalizedContent) {
        setConversationError(
          "Escribe un mensaje antes de enviarlo.",
        );

        return false;
      }

      if (
        normalizedContent.length > 5000
      ) {
        setConversationError(
          "El mensaje no puede superar los 5000 caracteres.",
        );

        return false;
      }

      if (isSending) {
        return false;
      }

      setIsSending(true);
      setConversationError(null);

      try {
        const createdMessage =
          await sendMessage({
            receiver_id:
              selectedUser.id,

            content:
              normalizedContent,
          });

        setMessages(
          (currentMessages) =>
            mergeMessages(
              currentMessages,
              [createdMessage],
            ),
        );

        setMessageContent("");

        /*
         * Después del primer mensaje,
         * la conversación ya aparecerá
         * automáticamente en la lista.
         */
        await loadConversations(false);

        return true;
      } catch (requestError) {
        setConversationError(
          getErrorMessage(
            requestError,
            "No se pudo enviar el mensaje.",
          ),
        );

        return false;
      } finally {
        setIsSending(false);
      }
    }, [
      isSending,
      loadConversations,
      messageContent,
      selectedUser,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Eliminar mensaje
  |--------------------------------------------------------------------------
  */

  const removeMessage =
    useCallback(
      async (
        message: ChatMessage,
      ): Promise<boolean> => {
        if (
          currentUserId === null ||
          message.sender_id !==
            currentUserId
        ) {
          setConversationError(
            "Solo puedes eliminar los mensajes que enviaste.",
          );

          return false;
        }

        if (message.is_read) {
          setConversationError(
            "No puedes retirar un mensaje que ya fue leído.",
          );

          return false;
        }

        if (
          deletingMessageId !== null
        ) {
          return false;
        }

        setDeletingMessageId(
          message.id,
        );

        setConversationError(null);

        try {
          await deleteMessage(
            message.id,
          );

          setMessages(
            (currentMessages) =>
              currentMessages.filter(
                (currentMessage) =>
                  currentMessage.id !==
                  message.id,
              ),
          );

          await loadConversations(false);

          return true;
        } catch (requestError) {
          setConversationError(
            getErrorMessage(
              requestError,
              "No se pudo retirar el mensaje.",
            ),
          );

          return false;
        } finally {
          setDeletingMessageId(null);
        }
      },
      [
        currentUserId,
        deletingMessageId,
        loadConversations,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | Cerrar conversación seleccionada
  |--------------------------------------------------------------------------
  */

  const closeConversation =
    useCallback((): void => {
      setSelectedUser(null);

      setMessages([]);

      setPagination(
        EMPTY_PAGINATION,
      );

      setMessageContent("");
      setConversationError(null);
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Carga inicial
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  /*
  |--------------------------------------------------------------------------
  | Actualización automática
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        void refreshCurrentConversation();
        void loadConversations(false);
      }, 6000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    loadConversations,
    refreshCurrentConversation,
    selectedUser,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Información calculada
  |--------------------------------------------------------------------------
  */

  const unreadMessagesCount =
    useMemo(
      () =>
        conversations.reduce(
          (
            total,
            conversation,
          ) =>
            total +
            conversation.unread_count,
          0,
        ),
      [conversations],
    );

  const hasConversations =
    conversations.length > 0;

  const hasSelectedConversation =
    selectedUser !== null;

  const hasOlderMessages =
    pagination.current_page <
    pagination.last_page;

  const messageLength =
    messageContent.length;

  return {
    currentUserId,

    conversations,
    selectedUser,
    messages,
    pagination,

    messageContent,
    messageLength,
    maxMessageLength: 5000,

    unreadMessagesCount,

    hasConversations,
    hasSelectedConversation,
    hasOlderMessages,

    isLoadingConversations,
    isLoadingConversation,
    isLoadingOlderMessages,
    isSending,

    deletingMessageId,

    conversationsError,
    conversationError,

    loadConversations,

    openConversation,

    /*
     * Nueva función para iniciar chats
     * desde perfiles, vacantes, etc.
     */
    openConversationByUserId,

    closeConversation,
    loadOlderMessages,

    handleMessageContentChange,
    sendCurrentMessage,
    removeMessage,
  };
}