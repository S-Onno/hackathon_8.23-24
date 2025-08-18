// app/page.tsx
import NightStarCanvas from "../components/StarCanvas";

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* 流星・星空キャンバス */}
      <NightStarCanvas />

      {/* ページのメインコンテンツ */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-center">
           rutyaboshi
        </h1>
      </div>
    </main>
  );
}
