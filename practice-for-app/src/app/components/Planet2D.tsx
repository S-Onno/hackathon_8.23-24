import React, { useRef, useEffect } from 'react';

type Planet2DProps = {
  size: number;        // 惑星の半径
  ringCount: number;   // わっかの数
};

const Planet2D: React.FC<Planet2DProps> = ({ size, ringCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // クリア
    ctx.clearRect(0, 0, width, height);

    // 背景（夕焼け風）
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ff4500');
    gradient.addColorStop(1, '#ffa500');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 惑星（円）
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fillStyle = '#66ccff'; // 水色
    ctx.fill();
    ctx.closePath();

    // わっか（リング）
    for (let i = 0; i < ringCount; i++) {
      ctx.beginPath();
      const innerRadius = size + 5 + i * 5;
      const outerRadius = innerRadius + 5;
      ctx.strokeStyle = '#a0d468'; // 黄緑
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.arc(centerX, centerY, (innerRadius + outerRadius) / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
  }, [size, ringCount]);

  return <canvas ref={canvasRef} width={500} height={500} style={{ display: 'block', margin: '0 auto' }} />;
};

export default Planet2D;
