"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageStore from "@/stores/useLanguage";
import { validateLanguage } from "@/lib/language";

interface LandingLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}
type Particle = { x: number; y: number; size: number; speed: number; opacity: number };
export default function LandingLayout({ children, params }: LandingLayoutProps) {
    const { language, setLanguage } = LanguageStore();
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
                prev.map((p) => ({ ...p, y: p.y - p.speed, opacity: p.y > 0 ? p.opacity : 0 })),
            );
        }, 80);

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        // Get language from params and validate it
        params.then((resolvedParams) => {
            const validatedLang = validateLanguage(resolvedParams.lang);
            setLanguage(validatedLang);
        });
    }, [params, setLanguage]);

    return (
        <>
            {isClient && (
                <div className="fixed inset-0 pointer-events-none z-0">
                    {particles.map((particle, index) => (
                        <div
                            key={index}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
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

            <div className="min-h-screen bg-black text-white overflow-x-hidden">
                {/* Common Navbar for all landing pages */}
                <Navbar language={language} />

                {/* Page content */}
                <main className="relative">
                    {children}
                </main>

                {/* Common Footer for all landing pages */}
                <Footer />
            </div>
        </>
    );
}
