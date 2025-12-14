import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';

export const HowItWorks = () => {
  const { language } = LanguageStore();

  const steps = [
    {
      number: '01',
      title: t('landing.HowItWorksSection.steps.step1.title'),
      description: t('landing.HowItWorksSection.steps.step1.description'),
    },
    {
      number: '02',
      title: t('landing.HowItWorksSection.steps.step2.title'),
      description: t('landing.HowItWorksSection.steps.step2.description'),
    },
    {
      number: '03',
      title: t('landing.HowItWorksSection.steps.step3.title'),
      description: t('landing.HowItWorksSection.steps.step3.description'),
    },
    {
      number: '04',
      title: t('landing.HowItWorksSection.steps.step4.title'),
      description: t('landing.HowItWorksSection.steps.step4.description'),
    },
  ];

  return (
    <section
      id="how-it-works"
      key={language}
      className="w-full py-24 bg-white dark:bg-black text-black dark:text-white border-t border-gray-100 dark:border-gray-900"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center tracking-tight">
          {t('landing.HowItWorksSection.title')}
        </h2>

        <div className="relative">
          {/* Horizontal Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gray-100 dark:bg-gray-800 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-start md:items-center text-left md:text-center bg-white dark:bg-black"
              >
                <div className="text-6xl font-bold text-gray-400 dark:text-gray-800 mb-6 font-numeric">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
