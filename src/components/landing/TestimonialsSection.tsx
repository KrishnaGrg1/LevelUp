import React from "react";
import { Quote, Zap, Target, Trophy } from "lucide-react";

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

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = "",
}) => {
  const testimonials: TestimonialCard[] = [
    {
      name: "Alex Rivera",
      role: "Software Engineer",
      content:
        "Level Up transformed my productivity completely. The gamification made building habits actually fun, and I've completed 45 goals in just 3 months!",
      avatar: "AR",
      badge: {
        icon: <Zap className="w-4 h-4" />,
        text: "45 Quests",
        color: "from-yellow-400 to-orange-400",
      },
    },
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      content:
        "The community aspect is incredible. Sharing achievements and getting support from fellow adventurers keeps me motivated every single day.",
      avatar: "SC",
      badge: {
        icon: <Target className="w-4 h-4" />,
        text: "Level 12",
        color: "from-blue-400 to-indigo-400",
      },
    },
    {
      name: "Marcus Johnson",
      role: "Fitness Coach",
      content:
        "I've tried countless habit apps, but Level Up's approach to wellness and progress tracking is unmatched. My clients love it too!",
      avatar: "MJ",
      badge: {
        icon: <Trophy className="w-4 h-4" />,
        text: "Champion",
        color: "from-green-400 to-emerald-400",
      },
    },
  ];

  return (
    <section
      className={`relative py-32 bg-gradient-to-b from-slate-950 to-slate-900 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent"></div>
      <div className="relative mx-auto max-w-6xl px-6 z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Real Stories, Real Transformations
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover how adventurers worldwide are leveling up their lives with
            Level Up
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/20 to-slate-900/40 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                {/* Quote icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-purple-400 opacity-50" />
                </div>

                {/* Testimonial content */}
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* User info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>

                    {/* Name and role */}
                    <div>
                      <p className="text-slate-200 font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <div
                    className={`flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r ${testimonial.badge.color} rounded-full backdrop-blur-sm`}
                  >
                    {testimonial.badge.icon}
                    <span className="text-white text-xs font-medium">
                      {testimonial.badge.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional social proof */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800/30 rounded-full border border-slate-700/30">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-slate-900 flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
              <div className="w-8 h-8 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <span className="text-slate-400 text-xs">+</span>
              </div>
            </div>
            <span className="text-slate-400 text-sm ml-3">
              Join 10,000+ happy adventurers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
