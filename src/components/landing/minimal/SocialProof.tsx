import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

export const SocialProof = () => {
  const { language } = LanguageStore();

  return (
    <section
      key={language}
      className="w-full py-24 bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900"
    >
      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">🌱</span>
            <p className="max-w-xs">"{t('landing.SocialProofSection.quotes.q1')}"</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">✨</span>
            <p className="max-w-xs">"{t('landing.SocialProofSection.quotes.q2')}"</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">📈</span>
            <p className="max-w-xs">"{t('landing.SocialProofSection.quotes.q3')}"</p>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-numeric mb-1">10,000+</div>
            <div className="text-sm font-medium uppercase tracking-wider">
              {t('landing.SocialProofSection.stats.quests')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-numeric mb-1">21 Days</div>
            <div className="text-sm font-medium uppercase tracking-wider">
              {t('landing.SocialProofSection.stats.streak')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
