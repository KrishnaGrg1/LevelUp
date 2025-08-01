"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Language } from "@/stores/useLanguage";
import { LoginForm } from "@/components/auth/Login";
import { ArrowLeft, Sparkles } from "lucide-react";

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

interface LoginPageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const [language, setLanguage] = useState<Language>("eng");
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; speed: number; opacity: number }[]
  >([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side to avoid hydration issues
    setIsClient(true);

    // Get language from params and validate it
    params.then((resolvedParams) => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
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

    return () => {
      clearInterval(interval);
    };
  }, [params]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
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

      {/* Background Effects - matching homepage */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href={`/${language}/home`}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="absolute top-6 right-6 z-20">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-300 text-sm font-medium">Level Up</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <LoginForm lang={language} />
      </div>
    </div>
  );
}
