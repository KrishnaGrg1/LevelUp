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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              viewType === 'community'
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : isPrivate
                  ? 'bg-purple-500'
                  : 'bg-red-500'
            }`}
          >
            <ShieldIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{viewName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>
                {memberCount} {t('community:messageArea.members', language)}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <Info className="h-4 w-4 mr-2" />
              {viewType === 'community'
                ? t('community:messageArea.communityInfo', language)
                : t('community:messageArea.clanInfo', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              {t('community:messageArea.settings', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              {t('community:messageArea.inviteMembers', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="h-4 w-4 mr-2" />
              {t('community:messageArea.notifications', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BellOff className="h-4 w-4 mr-2" />
              {t('community:messageArea.mute', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="h-4 w-4 mr-2" />
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
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm">
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
              className="h-11 text-sm"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
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
