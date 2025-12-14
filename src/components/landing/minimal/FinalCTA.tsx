import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

export const FinalCTA = () => {
  const { language } = LanguageStore();

  return (
    <section
      key={language}
      className="w-full py-32 bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          {t('landing.FinalCTASection.title')}
        </h2>

        <div className="flex justify-center mt-10">
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="px-10 h-14 text-lg font-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full transition-all"
            >
              {t('landing.FinalCTASection.button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
