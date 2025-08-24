'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface PlanetPositions {
  [key: string]: number;
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
  const [positions, setPositions] = useState<PlanetPositions>({});
  const [mounted, setMounted] = useState(false); // クライアントマウント確認
  const sun = planets.find(p => p.isSun);
  const planetsToAnimate = planets.filter(p => !p.isSun);
  const animationFrameId = useRef<number | null>(null);
  const initialAnglesRef = useRef<Record<string, number>>({});
  const colorMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    setMounted(true); // クライアント側マウント完了
  }, []);

  useEffect(() => {
    if (!mounted) return; // SSR時は何もしない

    if (planetsToAnimate.length > 0) {
      const step = (2 * Math.PI) / planetsToAnimate.length;
      planetsToAnimate.forEach((planet, i) => {
        initialAnglesRef.current[planet.id] = step * i;
        colorMapRef.current[planet.id] = SOFT_BLUE_NEON_COLORS[i % SOFT_BLUE_NEON_COLORS.length];
      });
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setPositions(prevPositions => {
        const newPositions: PlanetPositions = { ...prevPositions };
        planetsToAnimate.forEach(planet => {
          const { id, orbitRadius, animationDuration } = planet;
          const currentAngle = newPositions[id] ?? initialAnglesRef.current[id] ?? 0;
          const rotationSpeed = (2 * Math.PI) / animationDuration;
          const newAngle = currentAngle + rotationSpeed * deltaTime;

          newPositions[id] = newAngle;
          newPositions[`${id}-x`] = orbitRadius * Math.cos(newAngle);
          newPositions[`${id}-y`] = orbitRadius * Math.sin(newAngle);
        });
        return newPositions;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [mounted, planetsToAnimate]);

  if (!sun) return null;
  if (!mounted) return null; // SSR時は描画しない

  return (
    <div className="galaxy-map-container relative w-full h-screen flex items-center justify-center bg-night-sky overflow-hidden">
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

      {planetsToAnimate.map(planet => {
        const x = positions[`${planet.id}-x`] || 0;
        const y = positions[`${planet.id}-y`] || 0;
        const color = colorMapRef.current[planet.id];
        const size = 60;
        const glowOffset = 2 + Math.sin(performance.now() / 300 + planet.id.length) * 2;

        return (
          <div
            key={planet.id}
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