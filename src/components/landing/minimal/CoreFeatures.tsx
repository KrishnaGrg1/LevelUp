import React from 'react';
import { Target, Zap, Bell, BarChart3 } from 'lucide-react';
import { t } from '@/translations';

export const CoreFeatures = () => {
  // We can't map here easily if we want to use t().
  // So we'll hardcode the structure or build it inside the component.
  const features = [
    {
      icon: Target,
      title: t('landing.FeaturesSection.coreFeatures.features.feature1.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature1.description'),
    },
    {
      icon: Zap,
      title: t('landing.FeaturesSection.coreFeatures.features.feature2.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature2.description'),
    },
    {
      icon: Bell,
      title: t('landing.FeaturesSection.coreFeatures.features.feature3.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature3.description'),
    },
    {
      icon: BarChart3,
      title: t('landing.FeaturesSection.coreFeatures.features.feature4.title'),
      description: t('landing.FeaturesSection.coreFeatures.features.feature4.description'),
    },
  ];

  return (
    <section className="w-full bg-white py-24 text-black dark:bg-black dark:text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-100 p-6 transition-colors duration-300 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 transition-colors duration-300 group-hover:bg-black group-hover:text-white dark:bg-gray-900 dark:group-hover:bg-white dark:group-hover:text-black">
                <feature.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="font-medium text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
