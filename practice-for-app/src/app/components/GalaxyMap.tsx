// src/components/GalaxyMap.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/globals.css';

// 惑星の位置情報を格納する型を定義
interface PlanetPositions {
  [key: string]: number;
}

// propsの型定義
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

export default function GalaxyMap({ planets }: GalaxyMapProps) {
  // useStateの型を明示的に指定
  const [positions, setPositions] = useState<PlanetPositions>({});
  const sun = planets.find(p => p.isSun);
  const otherPlanets = planets.filter(p => !p.isSun);
  // useRefの型と初期値を修正
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setPositions(prevPositions => {
        // newPositionsに型を明示的に指定
        const newPositions: PlanetPositions = { ...prevPositions };
        otherPlanets.forEach(planet => {
          const { id, orbitRadius, animationDuration } = planet;
          const currentAngle = newPositions[id] || 0;
          const rotationSpeed = (360 / animationDuration) * (Math.PI / 180);
          const newAngle = currentAngle + rotationSpeed * deltaTime;

          // `orbitRadius`が `number`型なので、`|| 0`は不要
          const x = orbitRadius * Math.cos(newAngle);
          const y = orbitRadius * Math.sin(newAngle);

          newPositions[id] = newAngle;
          newPositions[`${id}-x`] = x;
          newPositions[`${id}-y`] = y;
        });
        return newPositions;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [otherPlanets]);

  if (!sun) return null;

  return (
    <div className="galaxy-map-container">
      {/* 太陽を中央に配置 */}
      <div className="sun-wrapper">
        <Link href={sun.route}>
          <Image
            src={sun.avatar}
            alt={sun.name}
            width={150}
            height={150}
            className="rounded-full shadow-lg border-4 border-yellow-400"
          />
        </Link>
      </div>

      {/* 惑星の公転 */}
      {otherPlanets.map((planet) => {
        const x = positions[`${planet.id}-x`] || 0;
        const y = positions[`${planet.id}-y`] || 0;

        return (
          <div
            key={planet.id}
            className="planet-wrapper"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <Link href={planet.route} className="planet-link">
              <Image
                src={planet.avatar}
                alt={planet.name}
                width={80}
                height={80}
                className="rounded-full shadow-lg border-2 border-blue-400 hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}