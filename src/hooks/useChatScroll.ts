import { useEffect, useRef, useCallback } from 'react';

interface UseChatScrollProps {
  messages: any[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Professional Messenger-style chat scroll behavior
 * Handles auto-scroll, load more, and scroll position preservation
 */
export const useChatScroll = ({
  messages,
  hasMore,
  loadMore,
  isLoading = false,
}: UseChatScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track user's scroll behavior
  const isUserAtBottomRef = useRef(true);
  const isInitialLoadRef = useRef(true);
  const isLoadingMoreRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const previousMessagesLengthRef = useRef(0);

  /**
   * Check if user is at the bottom of the chat
   */
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const threshold = 150; // 150px from bottom = considered "at bottom"
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom < threshold;
  }, []);

  /**
   * Scroll to bottom smoothly or instantly
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  /**
   * Handle scroll event - detect if user is at bottom and trigger load more
   */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Update whether user is at bottom
    isUserAtBottomRef.current = checkIfAtBottom();

    // Load more messages when scrolled to top (simple approach)
    if (container.scrollTop === 0 && hasMore && !isLoadingMoreRef.current && !isLoading) {
      isLoadingMoreRef.current = true;
      previousScrollHeightRef.current = container.scrollHeight;

      loadMore().finally(() => {
        isLoadingMoreRef.current = false;
      });
    }
  }, [checkIfAtBottom, hasMore, loadMore, isLoading]);

  /**
   * INITIAL LOAD: Scroll to bottom when messages first load
   */
  useEffect(() => {
    if (messages.length > 0 && isInitialLoadRef.current) {
      // Wait for DOM to render
      requestAnimationFrame(() => {
        scrollToBottom('auto');
        isInitialLoadRef.current = false;
        previousMessagesLengthRef.current = messages.length;
        isUserAtBottomRef.current = true;
      });
    }
  }, [messages.length, scrollToBottom]);

  /**
   * LOAD MORE: Preserve scroll position after loading older messages
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const previousLength = previousMessagesLengthRef.current;
    const currentLength = messages.length;
    const lengthIncreased = currentLength > previousLength;

    // If messages were prepended (loaded at the start)
    if (lengthIncreased && !isInitialLoadRef.current && previousScrollHeightRef.current > 0) {
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        const scrollHeightDiff = newScrollHeight - previousScrollHeightRef.current;

        // Maintain scroll position by adjusting scrollTop
        container.scrollTop = scrollHeightDiff;

        // Reset the reference
        previousScrollHeightRef.current = 0;
      });
    }

    previousMessagesLengthRef.current = currentLength;
  }, [messages.length]);

  /**
   * NEW MESSAGE: Auto-scroll to bottom only if user was at bottom
   */
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    const previousLength = previousMessagesLengthRef.current;
    const currentLength = messages.length;

    // Check if new messages were appended (not prepended)
    if (currentLength > previousLength && previousScrollHeightRef.current === 0) {
      // New message arrived (appended at the end)
      // Only auto-scroll if user is at bottom
      if (isUserAtBottomRef.current) {
        requestAnimationFrame(() => {
          scrollToBottom('auto');
        });
      }
    }
  }, [messages.length, scrollToBottom]);

  /**
   * Reset when component unmounts or chat changes
   */
  const reset = useCallback(() => {
    isInitialLoadRef.current = true;
    previousMessagesLengthRef.current = 0;
    previousScrollHeightRef.current = 0;
    isUserAtBottomRef.current = true;
  }, []);

  return {
    containerRef,
    messagesEndRef,
    handleScroll,
    scrollToBottom,
    isAtBottom: isUserAtBottomRef.current,
    reset,
  };
};
