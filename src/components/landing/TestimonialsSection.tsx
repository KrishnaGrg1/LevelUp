import React from 'react';
import { Quote, Zap, Target, Trophy } from 'lucide-react';
import { t } from '@/translations';

interface TestimonialCard {
  name: string;
  role: string;
  content: string;
  avatar: string;
  badge: {
    icon: React.ReactNode;
    text: string;
    color: string;
  };
}

interface TestimonialsSectionProps {
  // Allow for future customization
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const testimonials: TestimonialCard[] = [
    {
      name: 'TestimonialsSection.testimonials.0.name',
      role: 'TestimonialsSection.testimonials.0.role',
      content: 'TestimonialsSection.testimonials.0.content',
      avatar: 'AR',
      badge: {
        icon: <Zap className="h-4 w-4" />,
        text: 'TestimonialsSection.testimonials.0.badge.text',
        color: 'from-yellow-400 to-orange-400',
      },
    },
    {
      name: 'TestimonialsSection.testimonials.1.name',
      role: 'TestimonialsSection.testimonials.1.role',
      content: 'TestimonialsSection.testimonials.1.content',
      avatar: 'SC',
      badge: {
        icon: <Target className="h-4 w-4" />,
        text: 'TestimonialsSection.testimonials.1.badge.text',
        color: 'from-blue-400 to-indigo-400',
      },
    },
    {
      name: 'TestimonialsSection.testimonials.2.name',
      role: 'TestimonialsSection.testimonials.2.role',
      content: 'TestimonialsSection.testimonials.2.content',
      avatar: 'MJ',
      badge: {
        icon: <Trophy className="h-4 w-4" />,
        text: 'TestimonialsSection.testimonials.2.badge.text',
        color: 'from-green-400 to-emerald-400',
      },
    },
  ];

  return (
    <section className={`relative bg-gradient-to-b from-slate-950 to-slate-900 py-32 ${className}`}>
      <div className="bg-gradient-radial absolute inset-0 from-purple-500/5 via-transparent to-transparent"></div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
            {t('landing.TestimonialsSection.titleMain')}
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-400">
            {t('landing.TestimonialsSection.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-3xl border border-slate-700/30 bg-gradient-to-br from-slate-800/20 to-slate-900/40 p-8 transition-all duration-500 hover:scale-105 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative">
                {/* Quote icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-purple-400 opacity-50" />
                </div>

                {/* Testimonial content */}
                <p className="mb-8 text-lg leading-relaxed text-slate-300">
                  &ldquo; {t(`landing.${testimonial.content}`)}&rdquo;
                </p>

                {/* User info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <span className="text-sm font-bold text-white">{testimonial.avatar}</span>
                    </div>

                    {/* Name and role */}
                    <div>
                      <p className="font-semibold text-slate-200">
                        {t(`landing.${testimonial.name}`)}
                      </p>
                      <p className="text-sm text-slate-500">{t(`landing.${testimonial.role}`)}</p>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <div
                    className={`flex items-center space-x-2 bg-gradient-to-r px-3 py-1.5 ${testimonial.badge.color} rounded-full backdrop-blur-sm`}
                  >
                    {testimonial.badge.icon}
                    <span className="text-xs font-medium text-white">
                      {t(`landing.${testimonial.badge.text}`)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional social proof */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-700/30 bg-slate-800/30 px-6 py-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-purple-500 to-pink-500"
                >
                  <span className="text-xs font-bold text-white">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-700">
                <span className="text-xs text-slate-400">+</span>
              </div>
            </div>
            <span className="ml-3 text-sm text-slate-400">
              {t('landing.TestimonialsSection.socialProof')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
