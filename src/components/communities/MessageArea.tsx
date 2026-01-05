'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Paperclip,
  MoreVertical,
  Users,
  Shield as ShieldIcon,
  Loader2,
  Settings,
  UserPlus,
  Bell,
  BellOff,
  LogOut,
  Info,
} from 'lucide-react';

import { MessengerChatContainer } from './MessengerChatContainer';
import { ClanAccessDenied } from './ClanAccessDenied';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { useMessages } from '@/hooks/useMessages';

interface MessageAreaProps {
  communityId?: string;
  clanId?: string;
  viewType: 'community' | 'clan';
  viewName: string;
  memberCount: number;
  isPrivate?: boolean;
  onJoinClick?: () => void;
  onRequestJoinClick?: () => void;
}

export default function MessageArea({
  communityId,
  clanId,
  viewType,
  viewName,
  memberCount,
  isPrivate = false,
}: MessageAreaProps) {
  const { user } = authStore();
  const { language } = LanguageStore();
  const [messageInput, setMessageInput] = useState('');

  const {
    messages,
    sendMessage,
    isLoading,
    isSending,
    loadMore,
    hasMore,
    accessDenied,
    accessDeniedCode,
    isMember,
  } = useMessages({
    communityId,
    clanId,
    type: viewType,
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!messageInput.trim()) {
      toast.error(t('community:messageArea.enterMessage', language));
      return;
    }

    if (!user) {
      toast.error(t('community:messageArea.mustBeLoggedIn', language));
      return;
    }

    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If clan access is denied, show access denied screen
  if (viewType === 'clan' && accessDenied) {
    return <ClanAccessDenied clanName={viewName} accessDeniedCode={accessDeniedCode} />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-black">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black dark:bg-white">
            <ShieldIcon className="h-6 w-6 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{viewName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>
                {memberCount} {t('community:messageArea.members', language)}
              </span>
              {viewType === 'clan' && (
                <>
                  <span className="mx-1 text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isPrivate ? 'Private' : 'Public'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              {viewType === 'community'
                ? t('community:messageArea.communityInfo', language)
                : t('community:messageArea.clanInfo', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {t('community:messageArea.settings', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('community:messageArea.inviteMembers', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              {t('community:messageArea.notifications', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BellOff className="mr-2 h-4 w-4" />
              {t('community:messageArea.mute', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              {viewType === 'community'
                ? t('community:messageArea.leaveCommunity', language)
                : t('community:messageArea.leaveClan', language)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages - Messenger-style chat container */}
      <MessengerChatContainer
        messages={messages}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
        currentUserId={user?.id}
      />

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-black">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>

          <div className="flex-1">
            <Input
              type="text"
              placeholder={t('community:messageArea.typeMessage', language)}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending || !isMember}
              className="h-11 border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-black"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            disabled={!messageInput.trim() || isSending || !isMember}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
