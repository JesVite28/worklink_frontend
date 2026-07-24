export type MessageRole =
  | "admin"
  | "cliente"
  | "freelancer"
  | "empresa";

export interface MessageUser {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name: string | null;

  profile_photo: string | null;
  profile_photo_url: string | null;

  is_active: boolean;
  role: MessageRole | null;
}

export interface ChatMessage {
  id: number;

  sender_id: number;
  sender: MessageUser | null;

  receiver_id: number;
  receiver: MessageUser | null;

  content: string;
  is_read: boolean;

  created_at: string;
  updated_at: string;
}

export interface ConversationSummary {
  user: MessageUser | null;
  last_message: ChatMessage;
  unread_count: number;
}

export interface MessagePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/*
|--------------------------------------------------------------------------
| Respuestas del backend
|--------------------------------------------------------------------------
*/

export interface ConversationsResponse {
  success: boolean;
  message: string;

  data: {
    conversations: ConversationSummary[];
  };
}

export interface ConversationResponse {
  success: boolean;
  message: string;

  data: {
    user: MessageUser;
    messages: ChatMessage[];
    pagination: MessagePagination;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;

  data: {
    message: ChatMessage;
  };
}

export interface MarkConversationAsReadResponse {
  success: boolean;
  message: string;

  data: {
    updated_messages: number;
  };
}

export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Peticiones
|--------------------------------------------------------------------------
*/

export interface SendMessagePayload {
  receiver_id: number;
  content: string;
}

export interface ConversationFilters {
  page?: number;
  per_page?: number;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface MessageErrorResponse {
  success?: boolean;
  message?: string;

  errors?: Record<
    string,
    string[]
  >;
}