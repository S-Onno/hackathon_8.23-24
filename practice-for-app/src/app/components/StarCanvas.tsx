"use client";
import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  segments: number;
  curve: number;
}

export default function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // 星
    const stars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    // 流星
    const meteors: Meteor[] = [];
    for (let i = 0; i < 15; i++) {
      meteors.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 10 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.5,
        segments: 8 + Math.floor(Math.random() * 5),
        curve: (Math.random() - 0.5) * 0.1
      });
    }

    function animate() {
      // 宇宙背景グラデーション
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#050a23"); // 上: 深紺
      gradient.addColorStop(1, "#000000"); // 下: 黒
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 星雲のような淡い雲を描く
      const nebulaGradient = ctx.createRadialGradient(
        width * 0.7, height * 0.3, 0,
        width * 0.7, height * 0.3, width * 0.5
      );
      nebulaGradient.addColorStop(0, "rgba(100,100,255,0.2)");
      nebulaGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, width, height);

      // 星を描く
      stars.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 流星を描く
      meteors.forEach(meteor => {
        for (let i = 0; i < meteor.segments; i++) {
          const t = i / meteor.segments;
          const x = meteor.x - t * meteor.length * Math.cos(meteor.angle + t * meteor.curve);
          const y = meteor.y - t * meteor.length * Math.sin(meteor.angle + t * meteor.curve);
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,255,255,${meteor.opacity * (1 - t)})`;
          ctx.arc(x, y, (1 - t) * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        meteor.x += meteor.speed * Math.cos(meteor.angle);
        meteor.y += meteor.speed * Math.sin(meteor.angle);
        meteor.speed *= 0.99;
        meteor.angle += meteor.curve * 0.1;

        if (meteor.x > width || meteor.y > height || meteor.speed < 2) {
          meteor.x = Math.random() * width;
          meteor.y = Math.random() * height * 0.2;
          meteor.length = Math.random() * 120 + 80;
          meteor.speed = Math.random() * 10 + 10;
          meteor.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
          meteor.opacity = Math.random() * 0.5 + 0.5;
          meteor.segments = 8 + Math.floor(Math.random() * 5);
          meteor.curve = (Math.random() - 0.5) * 0.1;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[-1]" />;
}
