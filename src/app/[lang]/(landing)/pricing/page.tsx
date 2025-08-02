"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Language } from "@/stores/useLanguage";
import {
  Check,
  Zap,
  Crown,
  Rocket,
  Star,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";

// Helper function to validate and normalize language code
const validateLanguage = (lang: string): Language => {
  const validLanguages: Language[] = [
    "eng",
    "nep",
    "fr",
    "arab",
    "chin",
    "span",
  ];
  return validLanguages.includes(lang as Language) ? (lang as Language) : "eng";
};

interface PricingPageProps {
  params: Promise<{ lang: string }>;
}

const PricingPage: React.FC<PricingPageProps> = ({ params }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [language, setLanguage] = useState<Language>("eng");

  useEffect(() => {
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params]);

  const plans = [
    {
      name: "Adventurer",
      description: "Perfect for getting started on your journey",
      monthlyPrice: 0,
      annualPrice: 0,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      features: [
        "Up to 5 active quests",
        "Basic progress tracking",
        "Community access",
        "Mobile app",
        "Basic achievements",
        "Weekly reports",
      ],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "Hero",
      description: "For serious goal achievers who want more power",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      icon: Crown,
      color: "from-indigo-500 to-purple-500",
      features: [
        "Unlimited quests",
        "Advanced analytics",
        "AI-powered insights",
        "Priority support",
        "Custom quest templates",
        "Advanced achievements",
        "Team collaboration",
        "Export data",
      ],
      buttonText: "Upgrade to Hero",
      popular: true,
    },
    {
      name: "Legend",
      description: "Ultimate power for teams and power users",
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      icon: Rocket,
      color: "from-purple-500 to-pink-500",
      features: [
        "Everything in Hero",
        "Team management",
        "Advanced integrations",
        "White-label options",
        "Custom branding",
        "API access",
        "Dedicated success manager",
        "Advanced security",
      ],
      buttonText: "Go Legend",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar language={language} />

      {/* Hero Section */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-8">
            <Crown className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">
              Choose Your Adventure
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Level Up Your Life
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Choose the plan that fits your ambitions. Start free and upgrade as
            your adventures grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span
              className={`text-lg ${
                !isAnnual ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                isAnnual
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                  : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  isAnnual ? "translate-x-9" : "translate-x-1"
                }`}
              ></div>
            </button>
            <span
              className={`text-lg ${
                isAnnual ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-black">
                Save 17%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative mx-auto max-w-7xl px-6 z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-3xl border transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-indigo-900/20"
                    : "border-slate-700/30 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:border-purple-500/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold text-white">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-black text-white mb-2">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      {plan.monthlyPrice > 0 && (
                        <span className="text-lg text-slate-400 font-normal">
                          /{isAnnual ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <div className="text-slate-400 text-sm">
                        ${(plan.annualPrice / 12).toFixed(2)}/month billed
                        annually
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/en/signup"
                  className={`block w-full py-4 px-6 rounded-2xl font-bold text-center transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Level Up pricing and features.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
              },
              {
                question: "What happens to my data if I cancel?",
                answer:
                  "Your data remains accessible for 30 days after cancellation. You can export your progress and quest data anytime before permanent deletion.",
              },
              {
                question: "Is there a team discount?",
                answer:
                  "Yes! Teams of 10+ users get 20% off any plan. Contact our sales team for custom enterprise pricing and features.",
              },
              {
                question: "Do you offer a money-back guarantee?",
                answer:
                  "Absolutely! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30"
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Enterprise Solutions
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Ready for Enterprise?
          </h2>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            Get custom solutions, dedicated support, and enterprise-grade
            security for your organization.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Users,
                title: "Team Management",
                description:
                  "Advanced user management with role-based permissions",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "SOC 2 compliance, SSO, and advanced data protection",
              },
              {
                icon: Star,
                title: "Custom Solutions",
                description:
                  "Tailored features and integrations for your needs",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30"
              >
                <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <Link
            href="/en/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span>Contact Sales</span>
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
