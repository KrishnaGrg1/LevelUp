'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageStore from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';
import { Check, Zap, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingPageProps {
  params: Promise<{ lang: string }>;
}

// ... props
import { t } from '@/translations';

const PricingPage: React.FC<PricingPageProps> = ({ params }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { setLanguage, language } = LanguageStore();

  useEffect(() => {
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      description: t('pricing.plans.free.description'),
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Zap,
      features: [
        t('pricing.plans.free.features.0'),
        t('pricing.plans.free.features.1'),
        t('pricing.plans.free.features.2'),
        t('pricing.plans.free.features.3'),
        t('pricing.plans.free.features.4'),
      ],
      buttonText: t('pricing.plans.free.button'),
      popular: false,
    },
    {
      name: t('pricing.plans.pro.name'),
      description: t('pricing.plans.pro.description'),
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      icon: Crown,
      features: [
        t('pricing.plans.pro.features.0'),
        t('pricing.plans.pro.features.1'),
        t('pricing.plans.pro.features.2'),
        t('pricing.plans.pro.features.3'),
        t('pricing.plans.pro.features.4'),
      ],
      buttonText: t('pricing.plans.pro.button'),
      popular: true,
    },
    {
      name: t('pricing.plans.team.name'),
      description: t('pricing.plans.team.description'),
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      icon: Users,
      features: [
        t('pricing.plans.team.features.0'),
        t('pricing.plans.team.features.1'),
        t('pricing.plans.team.features.2'),
        t('pricing.plans.team.features.3'),
        t('pricing.plans.team.features.4'),
      ],
      buttonText: t('pricing.plans.team.button'),
      popular: false,
    },
  ];

  const faqs = [
    {
      q: t('pricing.faq.hiddenFees.q'),
      a: t('pricing.faq.hiddenFees.a'),
    },
    {
      q: t('pricing.faq.missDay.q'),
      a: t('pricing.faq.missDay.a'),
    },
    {
      q: t('pricing.faq.upgrade.q'),
      a: t('pricing.faq.upgrade.a'),
    },
    {
      q: t('pricing.faq.tokens.q'),
      a: t('pricing.faq.tokens.a'),
    },
  ];

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Hero */}
      <section className="relative py-24 text-center">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('pricing.hero.title')}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
            {t('pricing.hero.subtitle')}
          </p>

          <div className="flex items-center justify-center space-x-4">
            <span
              className={`text-sm font-medium ${!isAnnual ? 'text-black dark:text-white' : 'text-gray-400'}`}
            >
              {t('pricing.billing.monthly')}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-black shadow-sm transition-transform duration-300 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? 'text-black dark:text-white' : 'text-gray-400'}`}
            >
              {t('pricing.billing.annual')}
              <span className="ml-2 px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full">
                {t('pricing.billing.save')}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-black dark:border-white'
                  : 'border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-wide">
                  Popular
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <plan.icon className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 h-10">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="text-4xl font-bold mb-1">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    {plan.monthlyPrice > 0 && (
                      <span className="text-lg text-gray-400 font-normal ml-1">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <div className="text-gray-400 text-xs">
                      ${(plan.annualPrice / 12).toFixed(2)}/mo billed annually
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Check className="w-4 h-4 text-black dark:text-white mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/${language}/signup`} className="block">
                <Button
                  className={`w-full h-12 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                      : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 border-t border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('pricing.faqTitle')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('pricing.faqSubtitle')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
                // Updated hover border to be consistent with other elements
              >
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
