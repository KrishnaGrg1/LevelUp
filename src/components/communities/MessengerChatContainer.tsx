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
  currentUserId?: string;
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
  currentUserId,
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
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-white dark:bg-black">
        <div className="max-w-sm px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-8 w-8 text-gray-500"
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
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
      className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-black"
      style={{
        overflowAnchor: 'none', // Prevent browser's automatic scroll anchoring
      }}
    >
      {/* Load more indicator at the top */}
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-gray-800">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Loading older messages...
            </span>
          </div>
        </div>
      )}

      {/* Messages container with proper padding */}
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:px-6">
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
              currentUserId={currentUserId}
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
  currentUserId?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirstInGroup,
  isLastInGroup,
  currentUserId,
}) => {
  const isCurrentUser = currentUserId === message.sender?.id;

  if (isCurrentUser) {
    // Current user's message - align right
    return (
      <div className={`flex justify-end gap-3 ${!isFirstInGroup ? 'mt-1' : 'mt-4'}`}>
        {/* Message content */}
        <div className="flex min-w-0 flex-1 flex-col items-end">
          {/* Timestamp - show for every message */}
          <div className="mb-1 flex items-center gap-2 px-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>

          {/* Message bubble */}
          <div
            className={`inline-block max-w-[85%] rounded-2xl px-4 py-2 ${
              isFirstInGroup ? 'rounded-tr-sm' : ''
            } ${
              isLastInGroup ? 'rounded-br-sm' : ''
            } bg-black text-white shadow-sm dark:bg-white dark:text-black`}
          >
            <p className="text-sm break-words overflow-wrap-anywhere whitespace-pre-wrap" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{message.content}</p>
          </div>
        </div>

        {/* Avatar - show for every message */}
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
            <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-sm font-semibold text-white dark:from-gray-200 dark:to-gray-400 dark:text-black">
              {message.sender?.UserName?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  // Other user's message - align left
  return (
    <div className={`flex gap-3 ${!isFirstInGroup ? 'mt-1' : 'mt-4'}`}>
      {/* Avatar - show for every message */}
      <div className="flex-shrink-0">
        <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 text-sm font-semibold text-white dark:from-gray-200 dark:to-gray-400 dark:text-black">
            {message.sender?.UserName?.[0]?.toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message content */}
      <div className="min-w-0 flex-1">
        {/* Sender name and timestamp - show for every message */}
        <div className="mb-1 flex items-center gap-2 px-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {message.sender?.UserName ?? 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        {/* Message bubble */}
        <div
          className={`inline-block max-w-[85%] rounded-2xl px-4 py-2 ${
            isFirstInGroup ? 'rounded-tl-sm' : ''
          } ${
            isLastInGroup ? 'rounded-bl-sm' : ''
          } border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800`}
        >
          <p className="text-sm break-words whitespace-pre-wrap text-gray-800 dark:text-gray-200" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
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
