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
      className="w-full border-t border-gray-100 bg-white py-32 text-black dark:border-gray-900 dark:bg-black dark:text-white"
    >
      <div className="container mx-auto px-6 text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          {t('landing.FinalCTASection.title')}
        </h2>

        <div className="mt-10 flex justify-center">
          <Link href={`/${language}/signup`}>
            <Button
              size="lg"
              className="h-14 rounded-full bg-black px-10 text-lg font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t('landing.FinalCTASection.button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
