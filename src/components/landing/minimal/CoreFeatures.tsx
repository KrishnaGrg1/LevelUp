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
    <section className="w-full py-24 bg-white dark:bg-black text-black dark:text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300"
            >
              <div className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
