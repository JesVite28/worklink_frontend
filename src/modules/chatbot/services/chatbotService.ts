import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

export interface ChatbotMessagePayload {
  message: string;
}

export interface ChatbotResponse {
  success: boolean;
  message: string;
  data: {
    provider: string;
    model: string;
    mode: "public" | "authenticated";
    user_id?: number | null;
    reply: string;
  };
}

export async function sendPublicChatbotMessage(
  message: string
): Promise<ChatbotResponse> {
  const response = await authApi.post<ChatbotResponse>(
    ENDPOINTS.CHATBOT_PUBLIC_MESSAGE,
    {
      message,
    }
  );

  return response.data;
}

export async function sendAuthChatbotMessage(
  message: string
): Promise<ChatbotResponse> {
  const response = await authApi.post<ChatbotResponse>(
    ENDPOINTS.CHATBOT_AUTH_MESSAGE,
    {
      message,
    }
  );

  return response.data;
}

export async function sendChatbotMessage(
  message: string,
  isAuthenticated: boolean
): Promise<ChatbotResponse> {
  if (isAuthenticated) {
    return sendAuthChatbotMessage(message);
  }

  return sendPublicChatbotMessage(message);
}