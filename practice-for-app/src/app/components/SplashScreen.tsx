// src/components/SplashScreen.tsx
//作成中！恩納作


'use client';

import Image from 'next/image';
import { useEffect } from 'react';

type Props = {
  onFinish: () => void;
  duration?: number; // ms
};

export default function SplashScreen({ onFinish, duration = 4000 }: Props) {
  useEffect(() => {
    const t = setTimeout(onFinish, duration);
    return () => clearTimeout(t);
  }, [onFinish, duration]);

  // 星の座標（固定値）：SSRとクライアントの不一致を避けるために固定
  const stars = [
    { x: '8%', y: '22%', d: '0s' },
    { x: '18%', y: '65%', d: '0.3s' },
    { x: '28%', y: '15%', d: '0.6s' },
    { x: '40%', y: '50%', d: '0.1s' },
    { x: '52%', y: '26%', d: '0.7s' },
    { x: '63%', y: '72%', d: '0.4s' },
    { x: '75%', y: '12%', d: '0.9s' },
    { x: '86%', y: '40%', d: '0.2s' },
    { x: '12%', y: '82%', d: '0.5s' },
    { x: '32%', y: '80%', d: '0.8s' },
    { x: '58%', y: '88%', d: '0.35s' },
    { x: '70%', y: '55%', d: '0.65s' },
    { x: '90%', y: '70%', d: '0.15s' },
    { x: '5%',  y: '45%', d: '0.55s' },
    { x: '45%', y: '8%',  d: '0.25s' },
    { x: '82%', y: '20%', d: '0.75s' },
  ];

  return (
    <div className="splash" aria-label="Universe Splash Screen">
      {/* 星の瞬き */}
      <div className="stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="star"
            style={
              {
                left: s.x,
                top: s.y,
                animationDelay: s.d,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* ロゴ＋グロー */}
      <div className="logoWrap">
        <div className="glow" aria-hidden />
        <Image
          src="/universe-logo.png"
          width={360}
          height={360}
          priority
          alt="Universe Logo"
          className="logo"
        />
      </div>

      <style jsx>{`
        .splash {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: radial-gradient(1200px 800px at 50% 60%, #0b1020 0%, #05070f 45%, #02040a 100%);
          overflow: hidden;
          animation: fadeIn 600ms ease both;
          z-index: 9999;
        }

        /* 星 */
        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.5);
          animation: twinkle 1.8s ease-in-out infinite alternate;
        }

        /* ロゴ周り */
        .logoWrap {
          position: relative;
          display: grid;
          place-items: center;
          transform: translateY(8px);
          animation: floatUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .glow {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(48px);
          background:
            radial-gradient(closest-side, rgba(255, 255, 255, 0.55), transparent 60%),
            radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.65), transparent 60%),
            radial-gradient(circle at 55% 20%, rgba(79, 70, 229, 0.6), transparent 60%),
            radial-gradient(circle at 60% 60%, rgba(147, 51, 234, 0.6), transparent 65%),
            radial-gradient(circle at 70% 50%, rgba(245, 158, 11, 0.6), transparent 70%);
          opacity: 0.85;
          animation: pulse 2.4s ease-in-out infinite;
        }
        .logo {
          width: 360px;
          height: auto;
          filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.65))
                  drop-shadow(0 0 28px rgba(99, 102, 241, 0.45));
          animation: logoIn 900ms ease both 120ms;
          user-select: none;
        }

        /* キーフレーム */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes twinkle {
          0%   { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes logoIn {
          from { opacity: 0; filter: blur(6px) drop-shadow(0 0 0 rgba(0,0,0,0)); }
          to   { opacity: 1; filter: blur(0)   drop-shadow(0 0 16px rgba(255,255,255,0.65)); }
        }
      `}</style>
    </div>
  );
}
