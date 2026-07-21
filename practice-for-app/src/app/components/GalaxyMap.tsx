'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/globals.css';

interface Planet {
  id: string;
  name: string;
  route: string;
  avatar: string;
  orbitRadius: number;
  animationDuration: number;
  isSun?: boolean;
}

interface GalaxyMapProps {
  planets: Planet[];
}

const SOFT_BLUE_NEON_COLORS = [
  'rgba(173,216,230,0.7)',
  'rgba(135,206,235,0.7)',
  'rgba(176,224,230,0.7)',
  'rgba(173,216,230,0.6)',
  'rgba(135,206,250,0.7)',
];

export default function GalaxyMap({ planets }: GalaxyMapProps) {
  const sun = useMemo(() => planets.find((planet) => planet.isSun), [planets]);
  const planetsToAnimate = useMemo(
    () => planets.filter((planet) => !planet.isSun),
    [planets],
  );
  const planetNodes = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (planetsToAnimate.length === 0) {
      return;
    }

    const angleStep = (2 * Math.PI) / planetsToAnimate.length;
    const startedAt = performance.now();
    let animationFrameId = 0;

    const animate = (currentTime: number) => {
      const elapsedSeconds = (currentTime - startedAt) / 1000;

      planetsToAnimate.forEach((planet, index) => {
        const node = planetNodes.current[planet.id];
        if (!node) return;

        const duration = Math.max(planet.animationDuration, 1);
        const angle = angleStep * index + (elapsedSeconds * 2 * Math.PI) / duration;
        const x = planet.orbitRadius * Math.cos(angle);
        const y = planet.orbitRadius * Math.sin(angle);
        node.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [planetsToAnimate]);

  if (!sun) return null;

  return (
    <div className="galaxy-map-container relative w-full h-screen flex items-center justify-center bg-[#050816] overflow-hidden">
      {planetsToAnimate.map(planet => (
        <div
          key={`${planet.id}-orbit`}
          className="absolute rounded-full"
          style={{
            width: planet.orbitRadius * 2,
            height: planet.orbitRadius * 2,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1px solid rgba(255,255,255,0.5)`,
          }}
        />
      ))}

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link href={sun.route}>
          <Image
            src={sun.avatar}
            alt={sun.name}
            width={150}
            height={150}
            className="rounded-full shadow-[0_0_30px_10px_rgba(255,200,50,0.7)] border-4 border-yellow-400"
          />
        </Link>
        <div className="text-white text-base mt-2 text-center whitespace-nowrap">
          {sun.name}
        </div>
      </div>

      {planetsToAnimate.map((planet, index) => {
        const initialAngle = (2 * Math.PI * index) / planetsToAnimate.length;
        const x = planet.orbitRadius * Math.cos(initialAngle);
        const y = planet.orbitRadius * Math.sin(initialAngle);
        const color = SOFT_BLUE_NEON_COLORS[index % SOFT_BLUE_NEON_COLORS.length];
        const size = 60;
        const glowOffset = 2 + (index % 3);

        return (
          <div
            key={planet.id}
            ref={(node) => {
              planetNodes.current[planet.id] = node;
            }}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <Link href={planet.route} className="planet-link">
              <Image 
                src={planet.avatar}
                alt={planet.name}
                width={size}
                height={size}
                className="rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  borderColor: color,
                  boxShadow: `0 0 ${10 + glowOffset}px ${3 + glowOffset}px ${color}, 0 0 ${
                    20 + glowOffset
                  }px ${6 + glowOffset}px ${color}`,
                }}
              />
            </Link>
            <div className="text-white text-sm mt-1 text-center whitespace-nowrap">
              {planet.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
