//"use client"

import NavButton from "./components/NavButton";
import NightStarCanvas from "./components/StarCanvas";

export default function HomePage() {
    return (
        <div className="relative w-full min-h-screen">
            {/* 下層の背景コンポーネント */}
            <NightStarCanvas />

            {/* 上層のコンテンツ */}
            <main className="min-h-screen bg-gradient-to-b from-black text-white flex flex-col items-center justify-center px-4">
                <h1 className="text-5xl font-bold mb-4 tracking-wide">Universe</h1>

                <p className="text-lg mb-8 text-center max-w-md">
                あなたの学びが、惑星を育てる。
                宇宙をテーマにした学習アプリで、努力を可視化しよう。
                </p>
                
                <div className="flex gap-4">
                    <NavButton
                        href="/login"
                        className="px-6 py-2 rounded hover:bg-blue-400 hover:scale-125 transform transition duration-200"
                    >
                        ログイン
                    </NavButton>

                    <NavButton
                        href="/signup"
                        className="px-6 py-2 rounded hover:bg-green-400 hover:scale-125 transform transition duration-200"
                    >
                        新規登録
                    </NavButton>
                </div>
            </main>
        </div>
    );
}
