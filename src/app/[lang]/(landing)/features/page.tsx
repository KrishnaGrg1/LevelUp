"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import {
  Zap,
  Target,
  Brain,
  Users,
  TrendingUp,
  Heart,
  Shield,
  Star,
  Clock,
  Trophy,
  Globe,
  Sparkles,
} from "lucide-react";

interface FeaturesPageProps {
  params: Promise<{ lang: string }>;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ params }) => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 text-center min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative mx-auto max-w-4xl px-6 z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Powerful Features
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              To Level Up
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive suite of features designed to transform
            your goals into epic adventures and make personal growth
            irresistibly engaging.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <FeaturesSection />

      {/* Advanced Features */}
      <section className="relative py-32 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Unlock powerful tools that adapt to your unique journey and
              accelerate your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description:
                  "Smart recommendations based on your progress patterns and behavioral data.",
                color: "from-indigo-500 to-purple-500",
                highlight: "NEW",
              },
              {
                icon: TrendingUp,
                title: "Advanced Analytics",
                description:
                  "Deep dive into your performance with detailed charts and trend analysis.",
                color: "from-purple-500 to-pink-500",
                highlight: "",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "End-to-end encryption ensures your personal data stays completely private.",
                color: "from-green-500 to-emerald-500",
                highlight: "",
              },
              {
                icon: Globe,
                title: "Cross-Platform Sync",
                description:
                  "Seamlessly access your quests across all devices with real-time synchronization.",
                color: "from-blue-500 to-indigo-500",
                highlight: "",
              },
              {
                icon: Clock,
                title: "Smart Scheduling",
                description:
                  "AI-optimized time blocks that adapt to your energy levels and availability.",
                color: "from-orange-500 to-red-500",
                highlight: "BETA",
              },
              {
                icon: Star,
                title: "Achievement System",
                description:
                  "Earn badges, unlock titles, and showcase your journey with a comprehensive achievement system.",
                color: "from-yellow-500 to-orange-500",
                highlight: "",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-3xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  {feature.highlight && (
                    <div className="absolute -top-4 -right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black">
                      {feature.highlight}
                    </div>
                  )}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="relative py-32 bg-gradient-to-b from-slate-900 to-black">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Seamless Integrations
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Connect with your favorite apps and services to create a unified
              productivity ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "Calendar Apps",
              "Fitness Trackers",
              "Note Taking",
              "Music Apps",
              "Social Media",
              "Health Apps",
              "Task Managers",
              "Time Trackers",
              "Meditation",
              "Reading Apps",
              "Learning Platforms",
              "Banking Apps",
            ].map((integration, index) => (
              <div
                key={index}
                className="group relative p-6 bg-gradient-to-br from-slate-800/20 to-slate-900/40 rounded-2xl border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <p className="text-slate-300 text-sm font-medium">
                  {integration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative py-32 bg-gradient-to-b from-black to-slate-950">
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Why Choose Level Up?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              See how we compare to traditional goal-setting methods and other
              apps.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-300">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6 text-purple-400 font-bold">
                    Level Up
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400">
                    Traditional Methods
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400">
                    Other Apps
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gamified Experience", "✓", "✗", "Limited"],
                  ["AI-Powered Insights", "✓", "✗", "✗"],
                  ["Community Support", "✓", "✗", "Basic"],
                  ["Cross-Platform Sync", "✓", "✗", "✓"],
                  ["Advanced Analytics", "✓", "✗", "Limited"],
                  ["Privacy Protection", "✓", "✓", "Varies"],
                ].map(([feature, levelup, traditional, others], index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-900/20"
                  >
                    <td className="py-4 px-6 text-slate-300">{feature}</td>
                    <td className="py-4 px-6 text-center">
                      {levelup === "✓" ? (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      ) : (
                        <span className="text-purple-400 font-medium">
                          {levelup}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500">
                      {traditional}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-500">
                      {others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
