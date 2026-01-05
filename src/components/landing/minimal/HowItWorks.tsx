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
      className="w-full border-t border-gray-100 bg-white py-24 text-black dark:border-gray-900 dark:bg-black dark:text-white"
    >
      <div className="container mx-auto px-6">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight md:text-5xl">
          {t('landing.HowItWorksSection.title')}
        </h2>

        <div className="relative">
          {/* Horizontal Line for Desktop */}
          <div className="absolute top-12 left-0 -z-10 hidden h-px w-full bg-gray-100 md:block dark:bg-gray-800" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-start bg-white text-left md:items-center md:text-center dark:bg-black"
              >
                <div className="font-numeric mb-6 text-6xl font-bold text-gray-400 dark:text-gray-800">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
