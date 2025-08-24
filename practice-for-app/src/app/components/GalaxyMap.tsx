// src/components/GalaxyMap.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/globals.css';

interface PlanetPositions {
  [key: string]: number;
}

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
  const sun = planets.find(p => p.isSun);
  const planetsToAnimate = planets.filter(p => !p.isSun);

  const initialAnglesRef = useRef<Record<string, number>>({});
  const colorMapRef = useRef<Record<string, string>>({});
  const animationFrameId = useRef<number | null>(null);

  // 初期位置を設定
  const initialPositions: PlanetPositions = {};
  planetsToAnimate.forEach((planet, i) => {
    const step = (2 * Math.PI) / planetsToAnimate.length;
    const angle = step * i;
    initialAnglesRef.current[planet.id] = angle;
    colorMapRef.current[planet.id] = SOFT_BLUE_NEON_COLORS[i % SOFT_BLUE_NEON_COLORS.length];
    initialPositions[planet.id] = angle;
    initialPositions[`${planet.id}-x`] = planet.orbitRadius * Math.cos(angle);
    initialPositions[`${planet.id}-y`] = planet.orbitRadius * Math.sin(angle);
  });

  const [positions, setPositions] = useState<PlanetPositions>(initialPositions);
  const [shootingStar, setShootingStar] = useState({ x: 0, y: 0, visible: false });

  // 惑星のアニメーション
  useEffect(() => {
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
  }, [planetsToAnimate]);

  // 流れ星アニメーション
  useEffect(() => {
    let starAnimationId: number;
    const animateStar = () => {
      setShootingStar({ x: 0, y: 0, visible: true });
      let start = performance.now();

      const step = (time: number) => {
        const t = (time - start) / 1000; // 秒
        if (t > 1.5) {
          setShootingStar({ x: 0, y: 0, visible: false });
          starAnimationId = window.setTimeout(animateStar, 2000 + Math.random() * 3000);
          return;
        }
        setShootingStar({ x: t * window.innerWidth, y: t * window.innerHeight, visible: true });
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    starAnimationId = window.setTimeout(animateStar, 1000);
    return () => clearTimeout(starAnimationId);
  }, []);

  if (!sun) return null;

  return (
    <div className="galaxy-map-container relative w-full h-screen flex items-center justify-center bg-night-sky overflow-hidden">
      {/* 軌道 */}
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

      {/* 太陽 */}
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

      {/* 惑星 */}
      {planetsToAnimate.map(planet => {
        const x = positions[`${planet.id}-x`] || 0;
        const y = positions[`${planet.id}-y`] || 0;
        const color = colorMapRef.current[planet.id];
        const size = 60;
        const time = performance.now();
        const glowOffset = 2 + Math.sin(time / 300 + planet.id.length) * 2;

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

      {/* 流れ星 */}
      {shootingStar.visible && (
        <div
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: shootingStar.y,
            left: shootingStar.x,
            boxShadow: '0 0 10px 3px white, 0 0 20px 6px white',
          }}
        />
      )}
    </div>
  );
}
