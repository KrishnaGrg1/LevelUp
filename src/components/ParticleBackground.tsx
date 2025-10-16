import { useEffect, useState } from 'react';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay?: number;
  duration?: number;
};

interface ParticleBackgroundProps {
  count?: number;
  animation?: 'float' | 'rise' | 'static';
  showBackground?: boolean;
  particleColor?: string;
  particleClass?: string;
}

export default function ParticleBackground({
  count = 30,
  animation = 'rise',
  showBackground = true,
  particleColor = 'white',
  particleClass,
}: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const particle: Particle = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        };

        // Add animation-specific properties
        if (animation === 'float') {
          particle.delay = Math.random() * 2;
          particle.duration = 3 + Math.random() * 2;
        }

        arr.push(particle);
      }
      setParticles(arr);
    }

    // Only animate for 'rise' animation
    if (animation === 'rise') {
      const interval = setInterval(() => {
        setParticles(prev =>
          prev.map(p => ({
            ...p,
            y: p.y - p.speed,
            opacity: p.y > 0 ? p.opacity : 0,
          })),
        );
      }, 80);

      return () => clearInterval(interval);
    }
  }, [count, animation]);

  const getParticleStyle = (particle: Particle) => {
    const baseStyle: React.CSSProperties = {
      opacity: particle.opacity,
    };

    if (animation === 'float') {
      // Use percentage-based positioning for float animation
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      return {
        ...baseStyle,
        left: `${(particle.x / windowWidth) * 100}%`,
        top: `${(particle.y / windowHeight) * 100}%`,
        animationDelay: `${particle.delay}s`,
        animationDuration: `${particle.duration}s`,
      };
    } else {
      // Use pixel-based positioning for rise and static animations
      return {
        ...baseStyle,
        left: `${particle.x}px`,
        top: `${particle.y}px`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
      };
    }
  };

  const getParticleClassName = (particle: Particle) => {
    let className = 'absolute rounded-full';

    if (particleClass) {
      className += ` ${particleClass}`;
    } else {
      // Default styling based on animation type
      if (animation === 'float') {
        className += ' w-1 h-1 bg-indigo-400 opacity-60 animate-pulse';
      } else {
        className += ` bg-${particleColor}`;
      }
    }

    return className;
  };

  return (
    <>
      {/* Background Effects - only show if enabled */}
      {showBackground && (
        <>
          <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </>
      )}

      {/* Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className={getParticleClassName(particle)}
          style={getParticleStyle(particle)}
        />
      ))}
    </>
  );
}
