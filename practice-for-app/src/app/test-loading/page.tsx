/**
 * テスト用地球ぐるぐるローディング画面
 */
"use client";

import Image from "next/image";
import NightStarCanvas from "../components/StarCanvas";

export default function Loading() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* 星の背景（いちばん下のレイヤー） */}
      <NightStarCanvas />

      {/* 黒のグラデーションを画面全体にかける */}
      <main className="absolute inset-0 bg-gradient-to-b from-black flex flex-col items-center justify-center text-white px-4">
        <div className="animate-spin-slow">
          <Image src="/_images/earthilust.png" alt="Earth" width={150} height={150} />
        </div>
        <p className="mt-4 text-lg">Loading...</p>

        <style jsx>{`
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
