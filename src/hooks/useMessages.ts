// hooks/useMessages.ts
import { Message } from '@/lib/generated';
import { getClanMessages, getCommunityMessages } from '@/lib/services/message';
import {
  getSocket,
  onClanMessage,
  onCommunityMessage,
  sendClanMessage,
  sendCommunityMessage,
} from '@/lib/services/socket';
import LanguageStore from '@/stores/useLanguage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRoom } from './useRoom';

interface UseMessagesProps {
  communityId?: string;
  clanId?: string;
  type: 'community' | 'clan';
}

/**
 * Messaging hook
 * Responsibility: Handle message sending, receiving, and pagination only
 */
export const useMessages = ({ communityId, clanId, type }: UseMessagesProps) => {
  const { language } = LanguageStore();
  const targetId = type === 'community' ? communityId : clanId;

  // Use room hook for room management
  const { isJoined, isMember, accessDenied, accessDeniedCode } = useRoom({
    roomId: targetId,
    type,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const hasInitializedRef = useRef(false);
  const queryClient = useQueryClient();

  // ✅ Create unique room key for tracking
  const roomKey = `${type}-${targetId}`;
  const previousRoomKeyRef = useRef<string | null>(null);

  const queryKey =
    type === 'community'
      ? ['community-messages', language, communityId, currentPage]
      : ['clan-messages', language, clanId, currentPage];

  // Fetch paginated messages from API
  const { data: initialMessages, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!targetId) return { messages: [], pagination: { hasMore: false } };

      let result;
      if (type === 'community') {
        result = await getCommunityMessages(language, targetId, currentPage);
      } else {
        result = await getClanMessages(language, targetId, currentPage);
      }

      return result;
    },
    enabled: !!targetId,
    staleTime: 0, // ✅ Always refetch on room change
    gcTime: 0, // ✅ Don't cache between room switches
  });

  // ✅ Reset state when switching rooms (using unique room key)
  useEffect(() => {
    if (previousRoomKeyRef.current !== roomKey) {
      console.log(`🔄 Room changed: ${previousRoomKeyRef.current} → ${roomKey}`);
      hasInitializedRef.current = false;

      // Reset local state
      setMessages([]);
      setCurrentPage(1);

      //  Invalidate query cache for this room to force fresh fetch
      queryClient.invalidateQueries({ queryKey });
      previousRoomKeyRef.current = roomKey;
    }
  }, [roomKey, queryClient, queryKey]);

  // ✅ Initialize messages from API (with room key tracking)
  useEffect(() => {
    if (!initialMessages?.messages) return;
    if (hasInitializedRef.current) return;

    if (initialMessages.messages.length > 0) {
      setMessages(initialMessages.messages);
      hasInitializedRef.current = true;
    } else {
      // Even if no messages, mark as initialized to prevent re-fetching
      hasInitializedRef.current = true;
    }
  }, [initialMessages, roomKey]);

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!targetId || !initialMessages?.pagination?.hasMore) return;

    const nextPage = currentPage + 1;

    try {
      const more =
        type === 'community'
          ? await getCommunityMessages(language, targetId, nextPage)
          : await getClanMessages(language, targetId, nextPage);

      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = more.messages.filter(m => !existingIds.has(m.id));
        return [...newMessages, ...prev];
      });
      setCurrentPage(nextPage);
    } catch (error) {
      console.error(`Failed to load more messages for ${roomKey}:`, error);
      toast.error('Failed to load more messages');
    }
  }, [targetId, initialMessages?.pagination?.hasMore, currentPage, type, language, roomKey]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!targetId || !isJoined) return;

    const socket = getSocket();

    const handleMessage = (message: Message) => {
      const belongs =
        type === 'community' ? message.communityId === targetId : message.clanId === targetId;

      if (!belongs) return;

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        console.log(`🔌 New message received via socket`);
        return [...prev, message];
      });
    };

    if (type === 'community') {
      onCommunityMessage(handleMessage);
    } else {
      onClanMessage(handleMessage);
    }

    return () => {
      socket.off(type === 'community' ? 'community:new-message' : 'clan:new-message');
    };
  }, [targetId, type, isJoined, roomKey]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!targetId) throw new Error('No target ID');

      console.log(`📤 Sending message`);

      if (type === 'community') {
        sendCommunityMessage(targetId, content);
      } else {
        sendClanMessage(targetId, content);
      }

      return Promise.resolve({ success: true });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },

    onError: error => {
      console.error(`❌ Failed to send message:`, error);
      toast.error('Failed to send message');
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return toast.error('Message cannot be empty');
      if (!isJoined) return toast.error('Not connected to room');
      if (!isMember) return toast.error('You are not a member');

      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation, isJoined, isMember],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isSending: sendMessageMutation.isPending,
    loadMore,
    hasMore: initialMessages?.pagination?.hasMore || false,
    isJoined,
    isMember,
    accessDenied,
    accessDeniedCode,
  };
};
