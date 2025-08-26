/**
 * ローディング画面
 **/
// src/app/loading.tsx
/**
 * ローディング画面
 **/
"use client";

import Image from "next/image";
import NightStarCanvas from "./components/StarCanvas";
import { useState, useEffect } from "react";

const image1 = "/_images/earthilust.png";
const image2 = "/_images/creature1.png";

export default function Loading() {
  // useStateを使って、クライアント側で画像を決定
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    // クライアント側でのみ実行
    const randomImage = Math.random() > 0.1 ? image1 : image2;
    setSelectedImage(randomImage);
  }, []); // 空の依存配列でコンポーネントマウント時に一度だけ実行

  // 画像がまだ選ばれていない場合は何も表示しない
  if (!selectedImage) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* 星の背景（いちばん下のレイヤー） */}
      <NightStarCanvas />

      {/* 黒のグラデーションを画面全体にかける */}
      <main className="absolute inset-0 bg-gradient-to-b from-black flex flex-col items-center justify-center text-white px-4">
        <div className="animate-spin-slow">
          <Image 
            src={selectedImage} 
            alt="ランダムに選ばれた画像" 
            width={150} 
            height={150} 
          />
        </div>
        <p className="text-white mt-4 text-lg">Loading...</p>

        <style jsx>{`
          /* ゆっくり回転するアニメーション */
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </div>
  );
}
//3秒待機
// async function fetchArticles() {
//   await new Promise((resolve)=> setTimeout(resolve, 3000))
//   return articles
// }