'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import lang from '@/translations/lang';

type LangKey = keyof typeof lang;

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const invalidLang = searchParams.get('invalid_lang');
  const { language } = LanguageStore();
  const fullLanguage = lang[language as LangKey] || 'English';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 transition-colors duration-300 dark:bg-black">
      <Card className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-none dark:border-gray-800 dark:bg-black">
        <CardHeader className="pt-8 pb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
            <AlertCircle className="h-8 w-8 text-black dark:text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Invalid Language
          </CardTitle>
          <CardDescription className="text-lg text-gray-500 dark:text-gray-400">
            The language code is not supported
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <div className="space-y-4 text-center">
            {invalidLang && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Language code{' '}
                  <span className="font-mono font-bold text-black dark:text-white">
                    &quot;{invalidLang}&quot;
                  </span>{' '}
                  is not valid
                </p>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                Supported languages:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div>🇺🇸 English (eng)</div>
                <div>🇫🇷 Français (fr)</div>
                <div>🇳🇵 नेपाली (nep)</div>
                <div>🇸🇦 العربية (arab)</div>
                <div>🇨🇳 中文 (chin)</div>
                <div>🇪🇸 Español (span)</div>
              </div>
            </div>
          </div>

          <Link href={`/${language}/home`} className="block">
            <Button className="h-12 w-full rounded-xl bg-black font-bold text-white transition-all duration-300 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Home className="mr-2 h-4 w-4" />
              Go to Home ({fullLanguage})
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
