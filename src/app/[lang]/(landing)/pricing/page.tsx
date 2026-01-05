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
    <div className="bg-white text-black transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Hero */}
      <section className="relative py-24 text-center">
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t('pricing.hero.title')}
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-xl leading-relaxed text-gray-500 dark:text-gray-400">
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
              className="relative h-6 w-12 rounded-full bg-gray-200 transition-colors focus:ring-2 focus:ring-black focus:outline-none dark:bg-gray-800 dark:focus:ring-white"
            >
              <div
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-black ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? 'text-black dark:text-white' : 'text-gray-400'}`}
            >
              {t('pricing.billing.annual')}
              <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black">
                {t('pricing.billing.save')}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? 'border-black dark:border-white'
                  : 'border-gray-200 hover:border-black dark:border-gray-800 dark:hover:border-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-xs font-bold tracking-wide text-white uppercase dark:bg-white dark:text-black">
                  Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
                  <plan.icon className="h-6 w-6 text-black dark:text-white" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                <p className="mb-6 h-10 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="mb-1 text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    {plan.monthlyPrice > 0 && (
                      <span className="ml-1 text-lg font-normal text-gray-400">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <div className="text-xs text-gray-400">
                      ${(plan.annualPrice / 12).toFixed(2)}/mo billed annually
                    </div>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-black dark:text-white" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/${language}/signup`} className="block">
                <Button
                  className={`h-12 w-full rounded-xl font-medium transition-all ${
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
      <section className="relative border-t border-gray-100 py-32 dark:border-gray-900">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">{t('pricing.faqTitle')}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('pricing.faqSubtitle')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 p-6 transition-colors hover:border-black dark:border-gray-800 dark:hover:border-white"
                // Updated hover border to be consistent with other elements
              >
                <h3 className="mb-2 text-lg font-bold">{faq.q}</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
