// 地球ぐるぐるローディング
"use client";

import Image from "next/image";
import earthImg from "../_images/earth.png"; // ここは地球画像のパスに合わせてください

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-spin-slow">
        <Image src={earthImg} alt="Earth" width={150} height={150} />
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
    </div>
  );
}
