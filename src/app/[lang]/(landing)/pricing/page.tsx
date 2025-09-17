'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import LanguageStore from '@/stores/useLanguage'
import { validateLanguage } from '@/lib/language'
import { t } from '@/translations'
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Star,
  Users,
  Shield,
  Sparkles,
} from 'lucide-react'

interface PricingPageProps {
  params: Promise<{ lang: string }>
}

const PricingPage: React.FC<PricingPageProps> = ({ params }) => {
  const [isAnnual, setIsAnnual] = useState(false)
  const { setLanguage, language } = LanguageStore()

  useEffect(() => {
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang)
      setLanguage(validatedLang)
    })
  }, [params, setLanguage])

  const plans = [
    {
      name: t('pricing.plans.adventurer.name'),
      description: t('pricing.plans.adventurer.description'),
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Zap,
      color: 'from-green-500 to-emerald-500',
      features: [
        t('pricing.plans.adventurer.features.0'),
        t('pricing.plans.adventurer.features.1'),
        t('pricing.plans.adventurer.features.2'),
        t('pricing.plans.adventurer.features.3'),
        t('pricing.plans.adventurer.features.4'),
        t('pricing.plans.adventurer.features.5'),
      ],
      buttonText: t('pricing.plans.adventurer.button'),
      popular: false,
    },
    {
      name: t('pricing.plans.hero.name'),
      description: t('pricing.plans.hero.description'),
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      icon: Crown,
      color: 'from-indigo-500 to-purple-500',
      features: [
        t('pricing.plans.hero.features.0'),
        t('pricing.plans.hero.features.1'),
        t('pricing.plans.hero.features.2'),
        t('pricing.plans.hero.features.3'),
        t('pricing.plans.hero.features.4'),
        t('pricing.plans.hero.features.5'),
        t('pricing.plans.hero.features.6'),
        t('pricing.plans.hero.features.7'),
      ],
      buttonText: t('pricing.plans.hero.button'),
      popular: true,
    },
    {
      name: t('pricing.plans.legend.name'),
      description: t('pricing.plans.legend.description'),
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      features: [
        t('pricing.plans.legend.features.0'),
        t('pricing.plans.legend.features.1'),
        t('pricing.plans.legend.features.2'),
        t('pricing.plans.legend.features.3'),
        t('pricing.plans.legend.features.4'),
        t('pricing.plans.legend.features.5'),
        t('pricing.plans.legend.features.6'),
        t('pricing.plans.legend.features.7'),
      ],
      buttonText: t('pricing.plans.legend.button'),
      popular: false,
    },
  ]

  const faqs = [
    {
      q: t('pricing.faq.0.q'),
      a: t('pricing.faq.0.a'),
    },
    {
      q: t('pricing.faq.1.q'),
      a: t('pricing.faq.1.a'),
    },
    {
      q: t('pricing.faq.2.q'),
      a: t('pricing.faq.2.a'),
    },
    {
      q: t('pricing.faq.3.q'),
      a: t('pricing.faq.3.a'),
    },
  ]

  const enterprise = [
    {
      icon: Users,
      title: t('pricing.enterprise.0.title'),
      description: t('pricing.enterprise.0.description'),
    },
    {
      icon: Shield,
      title: t('pricing.enterprise.1.title'),
      description: t('pricing.enterprise.1.description'),
    },
    {
      icon: Star,
      title: t('pricing.enterprise.2.title'),
      description: t('pricing.enterprise.2.description'),
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar language={language} />

      {/* Hero */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-8">
            <Crown className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">
              {t('pricing.hero.badge')}
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('pricing.hero.titleLine1')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('pricing.hero.titleLine2')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('pricing.hero.description')}
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
              {t('pricing.billing.monthly')}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isAnnual
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  : 'bg-slate-600'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  isAnnual ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? 'text-white font-semibold' : 'text-slate-400'}`}>
              {t('pricing.billing.annual')}
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-black">
                {t('pricing.billing.save')}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative mx-auto max-w-7xl px-6 z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-500 hover:scale-105 ${
                plan.popular
                  ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-indigo-900/20'
                  : 'border-slate-700/30 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:border-purple-500/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold text-white">
                  {t('pricing.plans.popular')}
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-4xl font-black text-white mb-2">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    {plan.monthlyPrice > 0 && (
                      <span className="text-lg text-slate-400 font-normal">
                        /{isAnnual ? t('pricing.billing.year') : t('pricing.billing.month')}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.monthlyPrice > 0 && (
                    <div className="text-slate-400 text-sm">
                      ${(plan.annualPrice / 12).toFixed(2)}/{t('pricing.billing.month')} {t('pricing.billing.billedAnnually')}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${language}/signup`}
                className={`block w-full py-4 px-6 rounded-2xl font-bold text-center transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('pricing.faqTitle')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t('pricing.faqSubtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              {t('pricing.enterprise.badge')}
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t('pricing.enterprise.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('pricing.enterprise.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {enterprise.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30"
              >
                <item.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>

          <Link
            href={`/${language}/contact`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span>{t('pricing.enterprise.contactButton')}</span>
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default PricingPage
