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
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl shadow-none">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-800">
            <AlertCircle className="w-8 h-8 text-black dark:text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Invalid Language
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
            The language code is not supported
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <div className="text-center space-y-4">
            {invalidLang && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Language code{' '}
                  <span className="font-mono font-bold text-black dark:text-white">
                    &quot;{invalidLang}&quot;
                  </span>{' '}
                  is not valid
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 font-medium">
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
            <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-bold transition-all duration-300 rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              Go to Home ({fullLanguage})
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
