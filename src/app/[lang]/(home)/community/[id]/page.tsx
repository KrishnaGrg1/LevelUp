'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ClansList from '@/components/clans/ClansList';
import CreateClanModal from '@/components/clans/CreateClanModal';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations/index';
import { Shield, Users } from 'lucide-react';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { language } = LanguageStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('clans.title', language)}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('clans.description', language)}
          </p>
        </div>

        {/* Clans Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('clans.availableClans', language)}</h2>
            </div>
            <CreateClanModal communityId={communityId} />
          </div>

          <ClansList communityId={communityId} />
        </section>
      </div>
    </div>
  );
}
