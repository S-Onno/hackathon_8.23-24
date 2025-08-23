// src/components/GalaxyMap.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/globals.css'; 

// propsの型定義
interface Planet {
  id: string;
  name: string;
  route: string;
  avatar: string;
  isSun?: boolean;
  orbitRadius: number; // 軌道の半径を追加
  animationDuration: number; // アニメーションの時間を追加
}

interface GalaxyMapProps {
  planets: Planet[];
}

export default function GalaxyMap({ planets }: GalaxyMapProps) {
  const sun = planets.find(p => p.isSun);
  const otherPlanets = planets.filter(p => !p.isSun);

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

      {/* 惑星の公転軌道コンテナ */}
      {otherPlanets.map((planet, index) => (
        <div
          key={planet.id}
          className="planet-orbit-container"
          style={{
            animationDuration: `${planet.animationDuration}s`,
            width: `${planet.orbitRadius * 2}px`, // 軌道コンテナの幅と高さを設定
            height: `${planet.orbitRadius * 2}px`,
          }}
        >
          <div className="planet-position-container">
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
        </div>
      ))}
    </div>
  );
}