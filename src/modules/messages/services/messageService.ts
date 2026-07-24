import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  ChatMessage,
  ConversationFilters,
  ConversationResponse,
  ConversationsResponse,
  ConversationSummary,
  DeleteMessageResponse,
  MarkConversationAsReadResponse,
  MessageResponse,
  SendMessagePayload,
} from "../models/message";

/*
|--------------------------------------------------------------------------
| Listar conversaciones
|--------------------------------------------------------------------------
*/

export async function getConversations(): Promise<
  ConversationSummary[]
> {
  const response =
    await authApi.get<ConversationsResponse>(
      ENDPOINTS.MESSAGES.CONVERSATIONS,
    );

  return response.data.data.conversations;
}

/*
|--------------------------------------------------------------------------
| Obtener conversación
|--------------------------------------------------------------------------
*/

export async function getConversation(
  userId: number,
  filters: ConversationFilters = {},
): Promise<ConversationResponse["data"]> {
  const response =
    await authApi.get<ConversationResponse>(
      ENDPOINTS.MESSAGES.CONVERSATION(
        userId,
      ),
      {
        params: filters,
      },
    );

  return response.data.data;
}

/*
|--------------------------------------------------------------------------
| Enviar mensaje
|--------------------------------------------------------------------------
*/

export async function sendMessage(
  payload: SendMessagePayload,
): Promise<ChatMessage> {
  const response =
    await authApi.post<MessageResponse>(
      ENDPOINTS.MESSAGES.SEND,
      payload,
    );

  return response.data.data.message;
}

/*
|--------------------------------------------------------------------------
| Marcar conversación como leída
|--------------------------------------------------------------------------
*/

export async function markConversationAsRead(
  userId: number,
): Promise<number> {
  const response =
    await authApi.patch<MarkConversationAsReadResponse>(
      ENDPOINTS.MESSAGES
        .MARK_CONVERSATION_AS_READ(
          userId,
        ),
    );

  return response.data.data.updated_messages;
}

/*
|--------------------------------------------------------------------------
| Marcar mensaje individual como leído
|--------------------------------------------------------------------------
*/

export async function markMessageAsRead(
  messageId: number,
): Promise<ChatMessage> {
  const response =
    await authApi.patch<MessageResponse>(
      ENDPOINTS.MESSAGES.MARK_AS_READ(
        messageId,
      ),
    );

  return response.data.data.message;
}

/*
|--------------------------------------------------------------------------
| Eliminar mensaje
|--------------------------------------------------------------------------
*/

export async function deleteMessage(
  messageId: number,
): Promise<string> {
  const response =
    await authApi.delete<DeleteMessageResponse>(
      ENDPOINTS.MESSAGES.DELETE(
        messageId,
      ),
    );

  return response.data.message;
}