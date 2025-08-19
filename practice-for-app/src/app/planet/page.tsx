"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Creature = {
  id: number;
  x: number;
  y: number;
  angle: number; // 移動方向
  speed: number; // 移動速度
  isMoving: boolean;
  stopTimer: number;
};

export default function PlanetPage() {
  const [creatures, setCreatures] = useState<Creature[]>([]);

  const planetCenter = { x: 200, y: 200 };
  const planetRadius = 150;

  useEffect(() => {
    // 生物を初期化（必ず x, y, angle を与える）
    setCreatures([
      { id: 1, x: 200, y: 200, angle: Math.random() * 360, speed: 1, isMoving: true, stopTimer: 600},
      { id: 2, x: 180, y: 220, angle: Math.random() * 360, speed: 1.5, isMoving: true, stopTimer: 250},
      { id: 3, x: 180, y: 220, angle: Math.random() * 360, speed: 3, isMoving: true, stopTimer: 100},
      { id: 4, x: 200, y: 200, angle: Math.random() * 360, speed: 1, isMoving: true, stopTimer: 600},
      { id: 5, x: 180, y: 220, angle: Math.random() * 360, speed: 1.5, isMoving: true, stopTimer: 250},
      { id: 6, x: 180, y: 220, angle: Math.random() * 360, speed: 3, isMoving: true, stopTimer: 100},
      { id: 7, x: 200, y: 200, angle: Math.random() * 360, speed: 1, isMoving: true, stopTimer: 600},
      { id: 8, x: 180, y: 220, angle: Math.random() * 360, speed: 1.5, isMoving: true, stopTimer: 250},
      { id: 9, x: 180, y: 220, angle: Math.random() * 360, speed: 3, isMoving: true, stopTimer: 100},
      { id: 10, x: 180, y: 220, angle: Math.random() * 360, speed: 2, isMoving: true, stopTimer: 300},
    ]);

    const interval = setInterval(() => {
      setCreatures((prev) =>
        prev.map((c) => {
          let { x, y, angle, isMoving, stopTimer } = c;

          // タイマーを減らす
          stopTimer -= 1;

          // タイマーが切れたら状態を切り替え
          if (stopTimer <= 0) {
            isMoving = !isMoving;
            // 次の状態が続く時間（ランダムにすると自然）
            stopTimer = Math.floor(Math.random() * 100) + 50;
          }

          if (isMoving) {
            const rad = (angle * Math.PI) / 180;
            let newX = x + Math.cos(rad) * c.speed;
            let newY = y + Math.sin(rad) * c.speed;

            const dx = newX - planetCenter.x;
            const dy = newY - planetCenter.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 外に出そうなら方向転換
            if (dist > planetRadius - 15) {
              angle = Math.random() * 360;
            } else {
              x = newX;
              y = newY;
            }
          }

          return { ...c, x, y, angle, isMoving, stopTimer };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="relative w-[400px] h-[400px]">
        {/* 惑星 */}
        <Image src="/_images/earthilust.png" alt="planet" fill className="object-contain" />

        {/* 生物 */}
        {creatures.map((c) => (
          <Image
            key={c.id}
            src="/_images/creature1.png"
            alt="creature"
            width={50}
            height={50}
            className="absolute"
            style={{
              left: `${c.x - 25}px`,
              top: `${c.y - 25}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

