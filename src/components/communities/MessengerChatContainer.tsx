import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Message } from '@/lib/generated';
import { useChatScroll } from '@/hooks/useChatScroll';

interface MessengerChatContainerProps {
  messages: Message[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onScrollToBottom?: () => void;
}

/**
 * Production-ready Messenger-style chat container
 * Handles perfect scroll behavior and message rendering
 */
export const MessengerChatContainer: React.FC<MessengerChatContainerProps> = ({
  messages,
  hasMore,
  loadMore,
  isLoading,
  isLoadingMore = false,
}) => {
  const { containerRef, messagesEndRef, handleScroll } = useChatScroll({
    messages,
    hasMore,
    loadMore,
    isLoading,
  });

  // Loading state for initial load
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No messages yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Be the first to start the conversation!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scroll-smooth"
      style={{
        overflowAnchor: 'none', // Prevent browser's automatic scroll anchoring
      }}
    >
      {/* Load more indicator at the top */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Loading older messages...
            </span>
          </div>
        </div>
      )}

      {/* Messages container with proper padding */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.map((message, index) => {
          const isFirstInGroup =
            index === 0 || messages[index - 1]?.sender?.id !== message.sender?.id;
          const isLastInGroup =
            index === messages.length - 1 || messages[index + 1]?.sender?.id !== message.sender?.id;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
            />
          );
        })}

        {/* Invisible anchor element at the bottom for scrolling */}
        <div ref={messagesEndRef} className="h-0" />
      </div>
    </div>
  );
};

/**
 * Individual message bubble component
 */
interface MessageBubbleProps {
  message: Message;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirstInGroup,
  isLastInGroup,
}) => {
  return (
    <div className={`flex gap-3 ${!isFirstInGroup ? 'mt-1' : 'mt-4'}`}>
      {/* Avatar - show for every message */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
            {message.sender?.UserName?.[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Sender name and timestamp - show for every message */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {message.sender?.UserName ?? 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={`inline-block max-w-[85%] px-4 py-2 rounded-2xl ${
            isFirstInGroup ? 'rounded-tl-sm' : ''
          } ${
            isLastInGroup ? 'rounded-bl-sm' : ''
          } bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700`}
        >
          <p className="text-sm text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Format message timestamp
 */
const formatMessageTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  // If today, show time only
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // If within a week, show day and time
  if (diffInHours < 168) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Otherwise show full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
