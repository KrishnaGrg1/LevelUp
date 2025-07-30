"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CTASection } from "@/components/landing/CTASection";
import {
  CheckCircle,
  Users,
  Shield,
  Zap,
  Target,
  Trophy,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

const AboutPage: React.FC<AboutPageProps> = ({ params }) => {
  const [language, setLanguage] = useState("en");
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);
  const [isClient, setIsClient] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Animated stats for company metrics
  const [foundedYear] = useState(2021);
  const [teamSize, setTeamSize] = useState(0);
  const [countriesServed, setCountriesServed] = useState(0);
  const [milestonesAchieved, setMilestonesAchieved] = useState(0);

  useEffect(() => {
    // Mark as client-side to avoid hydration issues
    setIsClient(true);

    // Get language from params
    params.then((resolvedParams) => {
      setLanguage(resolvedParams.lang);
    });

    // Particle setup - only on client side
    if (typeof window !== "undefined") {
      const arr: {
        x: number;
        y: number;
        size: number;
        speed: number;
        opacity: number;
      }[] = [];
      for (let i = 0; i < 30; i++) {
        arr.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(arr);
    }

    // Animate particles
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          opacity: particle.y > 0 ? particle.opacity : 0,
        }))
      );
    };

    const interval = setInterval(animateParticles, 80);

    // Animate company stats when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let currentTeam = 0;
            let currentCountries = 0;
            let currentMilestones = 0;

            const targetTeam = 47;
            const targetCountries = 25;
            const targetMilestones = 156;

            const duration = 2000;
            const increment = 50;

            const timer = setInterval(() => {
              currentTeam += Math.ceil(targetTeam / (duration / increment));
              currentCountries += Math.ceil(
                targetCountries / (duration / increment)
              );
              currentMilestones += Math.ceil(
                targetMilestones / (duration / increment)
              );

              if (currentTeam >= targetTeam) {
                currentTeam = targetTeam;
                currentCountries = targetCountries;
                currentMilestones = targetMilestones;
                clearInterval(timer);
              }

              setTeamSize(currentTeam);
              setCountriesServed(currentCountries);
              setMilestonesAchieved(currentMilestones);
            }, increment);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [params]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Particle background - only render on client side */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map((particle, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
                transform: `scale(${particle.size})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-8 animate-float">
            <Heart className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">
              Our Story
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
              Transforming Lives
            </span>
            <br />
            <span
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-shift"
              style={{ animationDelay: "0.5s" }}
            >
              One Quest at a Time
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            We believe that everyone has the potential to level up their life.
            Level Up was born from the idea that achieving your goals should
            feel like an epic adventure, not a boring chore.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section
        ref={statsRef}
        className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Our Journey in Numbers
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              From a small startup to a global community of life-leveling
              adventurers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                count: foundedYear,
                label: "Founded",
                description: "Our adventure began",
                suffix: "",
              },
              {
                count: teamSize,
                label: "Team Members",
                description: "Passionate adventurers",
                suffix: "+",
              },
              {
                count: countriesServed,
                label: "Countries",
                description: "Global community",
                suffix: "+",
              },
              {
                count: milestonesAchieved,
                label: "Milestones",
                description: "Goals achieved together",
                suffix: "+",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    {stat.count}
                    {stat.suffix}
                  </div>
                  <p className="text-slate-300 text-lg font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-slate-500 text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              To gamify personal development and make achieving life goals as
              engaging as playing your favorite game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Goal Achievement",
                description:
                  "Transform your dreams into achievable quests with clear milestones and rewarding progress tracking.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                title: "Community Power",
                description:
                  "Join a supportive community of adventurers who celebrate your wins and help you overcome challenges.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                icon: Trophy,
                title: "Gamified Experience",
                description:
                  "Level up your life with XP points, achievements, and rewards that make personal growth addictively fun.",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((mission, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${mission.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <mission.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-black">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do at Level Up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                icon: CheckCircle,
                title: "Progress Over Perfection",
                description:
                  "We believe that consistent small steps lead to extraordinary transformations. Every quest completed is a victory worth celebrating.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Users,
                title: "Community First",
                description:
                  "Personal growth is better together. We foster a supportive environment where everyone can thrive and help others succeed.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: Shield,
                title: "Privacy & Security",
                description:
                  "Your personal journey is sacred. We protect your data with enterprise-grade security and never compromise your privacy.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "Innovation & Fun",
                description:
                  "We constantly innovate to make personal development more engaging, effective, and enjoyable than ever before.",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((value, index) => (
              <div key={index} className="flex items-start space-x-6 group">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Meet the Team
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              The passionate adventurers behind Level Up who are dedicated to
              helping you level up your life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Alex Chen",
                role: "Co-Founder & CEO",
                avatar: "AC",
                color: "from-indigo-500 to-purple-500",
                bio: "Former game designer turned life-leveling enthusiast. Believes everyone deserves to be the hero of their own story.",
              },
              {
                name: "Sarah Rodriguez",
                role: "Co-Founder & CTO",
                avatar: "SR",
                color: "from-purple-500 to-pink-500",
                bio: "Tech wizard with a passion for building tools that actually make life better. 15+ years in product development.",
              },
              {
                name: "Marcus Johnson",
                role: "Head of Product",
                avatar: "MJ",
                color: "from-pink-500 to-indigo-500",
                bio: "UX obsessed designer who turned his own productivity struggles into the features you love in Level Up.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="group text-center p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="relative">
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${member.color} rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="text-white text-2xl font-bold">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-purple-400 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Join Team CTA */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-6">
              <Star className="w-5 h-5 text-indigo-400" />
              <span className="text-indigo-300 font-medium">
                We&apos;re Growing
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Want to Join Our Adventure?
            </h3>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for passionate individuals who share our
              vision of making personal growth fun and engaging.
            </p>
            <Link
              href="/en/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <span>View Open Positions</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection language={language} />

      <Footer />
    </div>
  );
};

export default AboutPage;
