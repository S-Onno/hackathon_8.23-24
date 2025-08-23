"use client"

import React, { useState, useEffect } from "react";

interface TypingTextProps {
    text: string;
    speed?: number; // 1文字あたりの表示速度(ms)
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= text.length) {
                clearInterval(interval);
                return;
            }
            const nextChar = text[index];
            if (nextChar !== undefined) {
                setDisplayedText((prev) => prev + nextChar);
                index++;
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    // カーソルの点滅
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500); // 0.5秒ごとに点滅

        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <p className="text-lg mb-8 text-center max-w-md whitespace-pre-wrap">
            {displayedText}
            <span className={`${showCursor ? "opacity-100" : "opacity-0"} inline-block w-1 bg-white`}>&nbsp;</span>
        </p>
    );
};

export default TypingText;
