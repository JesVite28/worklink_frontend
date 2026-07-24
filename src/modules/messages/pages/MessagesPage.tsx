import ChatWindow from "../components/ChatWindow";
import ConversationList from "../components/ConversationList";

import useMessages from "../hooks/useMessages";

export default function MessagesPage() {
  const {
    currentUserId,

    conversations,
    selectedUser,
    messages,

    messageContent,
    messageLength,
    maxMessageLength,

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
    closeConversation,
    loadOlderMessages,

    handleMessageContentChange,
    sendCurrentMessage,
    removeMessage,
  } = useMessages();

  const hasSelectedConversation =
    selectedUser !== null;

  return (
    <section className="h-[calc(100dvh-9rem)] min-h-[650px] overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex h-full min-h-0">
        {/* Lista de conversaciones */}
        <div
          className={[
            "h-full min-h-0 w-full lg:block lg:w-[360px] lg:shrink-0 xl:w-[390px]",
            hasSelectedConversation
              ? "hidden"
              : "block",
          ].join(" ")}
        >
          <ConversationList
            conversations={conversations}
            selectedUserId={
              selectedUser?.id ?? null
            }
            isLoading={
              isLoadingConversations
            }
            error={conversationsError}
            onSelect={(user) => {
              void openConversation(user);
            }}
            onReload={() => {
              void loadConversations();
            }}
          />
        </div>

        {/* Ventana del chat */}
        <div
          className={[
            "h-full min-h-0 flex-1",
            hasSelectedConversation
              ? "flex"
              : "hidden lg:flex",
          ].join(" ")}
        >
          <ChatWindow
            currentUserId={currentUserId}
            selectedUser={selectedUser}
            messages={messages}
            messageContent={messageContent}
            messageLength={messageLength}
            maxMessageLength={
              maxMessageLength
            }
            isLoading={
              isLoadingConversation
            }
            isLoadingOlderMessages={
              isLoadingOlderMessages
            }
            isSending={isSending}
            hasOlderMessages={
              hasOlderMessages
            }
            deletingMessageId={
              deletingMessageId
            }
            error={conversationError}
            onMessageChange={
              handleMessageContentChange
            }
            onSend={sendCurrentMessage}
            onLoadOlder={
              loadOlderMessages
            }
            onDeleteMessage={
              removeMessage
            }
            onClose={closeConversation}
          />
        </div>
      </div>
    </section>
  );
}