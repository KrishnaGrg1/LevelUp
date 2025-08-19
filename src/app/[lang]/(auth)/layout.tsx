"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import TopBar from "@/components/auth/TopBar";
import useLanguage from "@/stores/useLanguage";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const arr: Particle[] = [];
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

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y - p.speed,
          opacity: p.y > 0 ? p.opacity : 0,
        })),
      );
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
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

        {/* Navigation and brand handled by TopBar */}

        {/* Top bar and page content */}
        <div className="relative z-10">
          <TopBar language={language} />
          <div className="min-h-screen p-4">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
