"use client";

import React, { useRef, useEffect } from "react";

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
}

const StarCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // キャンバスをウィンドウサイズに合わせる
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const numStars = 400;
        const stars: Star[] = [];

        const initStars = () => {
            stars.length = 0;
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random(),
                });
            }
        };

        let animationId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();

                // 星をチラチラ光らせる
                star.opacity += (Math.random() - 0.5) * 0.03;
                if (star.opacity > 1) star.opacity = 1;
                if (star.opacity < 0) star.opacity = 0;
            });

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        initStars();
        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div
            className="absolute top-0 left-0 w-full h-full -z-10"
            style={{ background: "linear-gradient(to top, #101035ff, #132446ff)" }} // 暗い紺色グラデーション
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
            />
        </div>
    );
};

export default StarCanvas;
