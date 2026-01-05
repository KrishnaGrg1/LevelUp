import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

export const SocialProof = () => {
  const { language } = LanguageStore();

  return (
    <section
      key={language}
      className="w-full border-t border-gray-100 bg-white py-24 text-black dark:border-gray-900 dark:bg-black dark:text-white"
    >
      <div className="container mx-auto px-6 text-center">
        <div className="mb-20 grid grid-cols-1 gap-12 text-lg font-medium text-gray-800 md:grid-cols-3 md:text-xl dark:text-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">🌱</span>
            <p className="max-w-xs">&quot;{t('landing.SocialProofSection.quotes.q1')}&quot;</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">✨</span>
            <p className="max-w-xs">&quot;{t('landing.SocialProofSection.quotes.q2')}&quot;</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">📈</span>
            <p className="max-w-xs">&quot;{t('landing.SocialProofSection.quotes.q3')}&quot;</p>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex flex-wrap justify-center gap-12 opacity-60 md:gap-24">
          <div className="text-center">
            <div className="font-numeric mb-1 text-3xl font-bold md:text-4xl">10,000+</div>
            <div className="text-sm font-medium tracking-wider uppercase">
              {t('landing.SocialProofSection.stats.quests')}
            </div>
          </div>
          <div className="text-center">
            <div className="font-numeric mb-1 text-3xl font-bold md:text-4xl">21 Days</div>
            <div className="text-sm font-medium tracking-wider uppercase">
              {t('landing.SocialProofSection.stats.streak')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
