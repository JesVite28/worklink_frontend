import { useState, type ChangeEvent, type FormEvent } from "react";
import { isAxiosError } from "axios";

import { useAuthSession } from "../../auth/hooks/useAuthSession";
import { sendChatbotMessage } from "../services/chatbotService";

type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
}

type ErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

const initialMessages: ChatMessage[] = [
  {
    id: crypto.randomUUID(),
    role: "assistant",
    content:
      "Hola, soy LinkIA. Puedo ayudarte con dudas sobre WorkLink, freelancers, servicios, vacantes y cómo usar la plataforma.",
  },
];

function getChatbotErrorMessage(error: unknown) {
  if (isAxiosError<ErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];

      if (firstError) return firstError;
    }

    return data?.message || "No fue posible obtener respuesta de LinkIA.";
  }

  return "No fue posible obtener respuesta de LinkIA.";
}

export function useChatbot() {
  const { isAuthenticated } = useAuthSession();

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleChat = () => {
    setIsOpen((previous) => !previous);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: cleanMessage,
    };

    setMessages((previous) => [...previous, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatbotMessage(
        cleanMessage,
        isAuthenticated
      );

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data.reply,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      console.error(error);

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: getChatbotErrorMessage(error),
      };

      setMessages((previous) => [...previous, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  return {
    messages,
    message,
    isOpen,
    isLoading,
    isAuthenticated,
    handleToggleChat,
    handleCloseChat,
    handleChangeMessage,
    handleSendMessage,
    handleClearChat,
  };
}