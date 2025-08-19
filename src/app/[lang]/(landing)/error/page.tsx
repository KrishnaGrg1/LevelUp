'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import lang from '@/translations/lang';

// If possible, import the Language type from where it's defined
// import type { Language } from '@/types/language';

type LangKey = keyof typeof lang;

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const invalidLang = searchParams.get('invalid_lang');
  const { language } = LanguageStore();
  const fullLanguage = lang[language as LangKey] || 'English';
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-3xl"></div>

        <CardHeader className="relative text-center pb-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-black text-white">
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Invalid Language
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            The language code is not supported
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6 px-8 pb-8">
          <div className="text-center space-y-4">
            {invalidLang && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm">
                  Language code{' '}
                  <span className="font-mono font-bold">&quot;{invalidLang}&quot;</span> is not
                  valid
                </p>
              </div>
            )}

            <div className="p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
              <p className="text-slate-300 text-sm mb-2">Supported languages:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
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
            <Button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 rounded-xl">
              <Home className="w-4 h-4 mr-2" />
              Go to Home ({fullLanguage})
            </Button>
          </Link>

          {/* <div className="flex gap-2">
                        <Link href="/fr/home" className="flex-1">
                            <Button variant="outline" className="w-full h-10 bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 text-sm rounded-xl">
                                🇫🇷 Français
                            </Button>
                        </Link>
                        <Link href="/nep/home" className="flex-1">
                            <Button variant="outline" className="w-full h-10 bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 text-sm rounded-xl">
                                🇳🇵 नेपाली
                            </Button>
                        </Link>
                    </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
