/**
 * Real-time messaging hook for communities and clans using Socket.IO
 */

import { Message } from '@/lib/generated';
import { getClanMessages, getCommunityMessages } from '@/lib/services/message';
import {
  getSocket,
  joinClan,
  leaveClan,
  joinCommunity,
  leaveCommunity,
  onClanMessage,
  onCommunityMessage,
  sendClanMessage,
  sendCommunityMessage,
} from '@/lib/services/socket';
import LanguageStore from '@/stores/useLanguage';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseMessagesProps {
  communityId?: string;
  clanId?: string;
  type: 'community' | 'clan';
  page?: number;
}

export const useMessages = ({ communityId, clanId, page = 1, type }: UseMessagesProps) => {
  const { language } = LanguageStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const messageBoxRef = useRef<HTMLDivElement | null>(null);

  const targetId = type === 'community' ? communityId : clanId;

  const queryKey =
    type === 'community'
      ? ['community-messages', language, communityId, currentPage]
      : ['clan-messages', language, clanId, currentPage];

  // Fetch paginated messages from API
  const { data: initialMessages, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!targetId) return { messages: [], pagination: { hasMore: false } };

      if (type === 'community') {
        return await getCommunityMessages(language, targetId, currentPage);
      } else {
        return await getClanMessages(language, targetId, currentPage);
      }
    },
    enabled: !!targetId,
  });

  // Update local state when initial messages are loaded
  useEffect(() => {
    if (!initialMessages) return;
    setMessages(initialMessages.messages);
  }, [initialMessages]);

  // Load previous page of messages
  const loadMore = async () => {
    if (!targetId) return;
    if (!initialMessages?.pagination?.hasMore) return;

    const div = messageBoxRef.current;
    if (!div) return;

    const oldScrollHeight = div.scrollHeight;
    const nextPage = currentPage + 1;

    const more =
      type === 'community'
        ? await getCommunityMessages(language, targetId, nextPage)
        : await getClanMessages(language, targetId, nextPage);

    setMessages(prev => [...more.messages, ...prev]);
    setCurrentPage(nextPage);

    setTimeout(() => {
      const newScrollHeight = div.scrollHeight;
      div.scrollTop = newScrollHeight - oldScrollHeight; // MAGIC LINE ✨
    }, 0);
  };

  // Initialize Socket.IO connection and room subscriptions
  useEffect(() => {
    if (!targetId) return;

    const socket = getSocket();

    if (!socket.connected) socket.connect();

    if (type === 'community') joinCommunity(targetId);
    else joinClan(targetId);

    // Handle recent messages received when joining a room
    const handleRecentMessages = (data: { messages: Message[] }) => {
      console.log('📥 Recent messages from socket:', data.messages?.length);
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    };

    const handleMessage = (message: Message) => {
      const belongs =
        type === 'community'
          ? message.communityId === targetId
          : (message as any).clanId === targetId;

      if (!belongs) return;

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    //It loads previous messages
    //It runs only once when you join
    socket.on('recent-messages', handleRecentMessages); //This happens right after you join a community:

    //It runs every time ANY user sends a new message
    // It adds one new message to the UI
    if (type === 'community')
      onCommunityMessage(handleMessage); //Backend broadcasts a new message:
    else onClanMessage(handleMessage);

    return () => {
      socket.off('recent-messages', handleRecentMessages);
      if (type === 'community') leaveCommunity(targetId);
      else leaveClan(targetId);
    };
  }, [targetId, type]);

  // Send message via Socket.IO (backend persists to database)
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!targetId) throw new Error('No target ID');

      console.log('📤 Sending message via socket:', content);

      if (type === 'community') {
        sendCommunityMessage(targetId, content);
      } else {
        sendClanMessage(targetId, content);
      }

      return Promise.resolve({ success: true });
    },

    onSuccess: () => {
      console.log('✅ Message sent successfully');
    },

    onError: error => {
      console.error('❌ Failed to send message:', error);
      toast.error('Failed to send message');
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return toast.error('Message cannot be empty');
      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isSending: sendMessageMutation.isPending,
    loadMore,
    hasMore: initialMessages?.pagination?.hasMore || false,
    messageBoxRef,
  };
};
