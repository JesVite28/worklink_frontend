import { useEffect } from "react";

import {
    SparklesIcon,
    PaperAirplaneIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useChatbot } from "../hooks/useChatbot";

type MarkdownMessageProps = {
    content: string;
    isUser: boolean;
};

function MarkdownMessage({ content, isUser }: MarkdownMessageProps) {
    if (isUser) {
        return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
        <div className="chatbot-markdown">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => (
                        <p className="mb-3 last:mb-0">
                            {children}
                        </p>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-bold text-text">
                            {children}
                        </strong>
                    ),
                    ul: ({ children }) => (
                        <ul className="mb-3 list-disc space-y-1 pl-5">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-3 list-decimal space-y-1 pl-5">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-6">
                            {children}
                        </li>
                    ),
                    h1: ({ children }) => (
                        <h3 className="mb-3 text-base font-bold text-text">
                            {children}
                        </h3>
                    ),
                    h2: ({ children }) => (
                        <h3 className="mb-3 text-base font-bold text-text">
                            {children}
                        </h3>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mb-2 text-sm font-bold text-text">
                            {children}
                        </h3>
                    ),
                    code: ({ children }) => (
                        <code className="rounded-md bg-background px-1.5 py-0.5 text-xs text-primary">
                            {children}
                        </code>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

export default function ChatbotWidget() {
    const {
        messages,
        message,
        isOpen,
        isLoading,
        handleToggleChat,
        handleCloseChat,
        handleChangeMessage,
        handleSendMessage,
        handleClearChat,
    } = useChatbot();

    useEffect(() => {
        function clearChatAfterLogout(): void {
            const token = localStorage.getItem("token");

            if (token) {
                return;
            }

            handleClearChat();
            handleCloseChat();
        }

        function handleStorageChange(
            event: StorageEvent,
        ): void {
            if (
                event.key === "token" &&
                !event.newValue
            ) {
                clearChatAfterLogout();
            }
        }

        window.addEventListener(
            "auth:session-updated",
            clearChatAfterLogout,
        );

        window.addEventListener(
            "storage",
            handleStorageChange,
        );

        return () => {
            window.removeEventListener(
                "auth:session-updated",
                clearChatAfterLogout,
            );

            window.removeEventListener(
                "storage",
                handleStorageChange,
            );
        };
    }, [
        handleClearChat,
        handleCloseChat,
    ]);

    return (
        <>
            {!isOpen && (
                <button
                    type="button"
                    onClick={handleToggleChat}
                    className="
    fixed bottom-6 right-6 z-50
    flex h-16 w-16 items-center justify-center
    rounded-full
    bg-gradient-to-br from-primary via-purple-500 to-indigo-500
    text-white
    shadow-2xl shadow-primary/40
    transition hover:scale-105 hover:shadow-primary/60
  "
                    aria-label="Abrir chatbot"
                >
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                        <SparklesIcon className="h-7 w-7 text-white" />

                        <span className="absolute -right-1 top-1 h-2.5 w-2.5 rounded-full bg-white/90" />
                        <span className="absolute bottom-0 left-0 h-2 w-2 rounded-full bg-white/60" />
                    </div>
                </button>
            )}

            {isOpen && (
                <section
                    className="
            fixed bottom-6 right-6 z-50
            flex h-[620px] w-[calc(100vw-2rem)] max-w-md flex-col
            overflow-hidden rounded-3xl border border-border
            bg-surface text-text shadow-2xl
            sm:w-[420px]
          "
                >
                    <header className="border-b border-border bg-primary p-4 text-white">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                                            <SparklesIcon className="h-7 w-7 text-white" />

                                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white/80" />
                                            <span className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-white/50" />
                                        </div>
                                    </span>

                                    <div>
                                        <h2 className="font-bold leading-tight">LinkIA</h2>
                                        <p className="text-xs text-white/75">
                                            Asistente inteligente de WorkLink
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-white/75">
                                    {/* Modo: {isAuthenticated ? "usuario autenticado" : "público"} */}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleClearChat}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                                    aria-label="Limpiar chat"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCloseChat}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20"
                                    aria-label="Cerrar chatbot"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="chatbot-scroll flex-1 space-y-4 overflow-y-auto bg-background p-4">
                        {messages.map((item) => {
                            const isUser = item.role === "user";

                            return (
                                <div
                                    key={item.id}
                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`
                      max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6
                      ${isUser
                                                ? "rounded-br-md bg-primary text-white"
                                                : "rounded-bl-md border border-border bg-surface text-text"
                                            }
                    `}
                                    >
                                        <MarkdownMessage content={item.content} isUser={isUser} />
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-3xl rounded-bl-md border border-border bg-surface px-4 py-3 text-sm text-text-muted">
                                    LinkIA está escribiendo...
                                </div>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-border bg-surface p-4"
                    >
                        <div className="flex items-end gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={handleChangeMessage}
                                placeholder="Escribe tu mensaje..."
                                disabled={isLoading}
                                className="
                  min-h-12 flex-1 rounded-2xl border border-border
                  bg-background px-4 py-3 text-sm text-text
                  outline-none transition
                  placeholder:text-text-muted
                  focus:border-primary
                  disabled:cursor-not-allowed disabled:opacity-60
                "
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !message.trim()}
                                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-2xl bg-primary text-white
                  shadow-lg shadow-primary/20
                  transition hover:opacity-90
                  disabled:cursor-not-allowed disabled:opacity-60
                "
                                aria-label="Enviar mensaje"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
}