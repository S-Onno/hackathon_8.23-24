import Image from "next/image";
import NavButton from "./components/NavButton";
import NightStarCanvas from "./components/StarCanvas";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full">
      <NightStarCanvas />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black px-4 text-white">
        <h1 className="mb-4 text-5xl font-bold tracking-wide">
          <Image
            src="/_images/BigUniverselogo.png"
            alt="Universe"
            width={300}
            height={200}
            priority
          />
        </h1>
        <p className="mb-8 max-w-md text-center text-lg">
          あなたの学びが、惑星を育てる。宇宙をテーマにした学習アプリで、努力を可視化しよう。
        </p>

        <div className="flex gap-4">
          <NavButton
            href="/login"
            className="hover:scale-110 hover:bg-blue-500"
          >
            ログイン
          </NavButton>
          <NavButton
            href="/signup"
            className="hover:scale-110 hover:bg-green-500"
          >
            新規登録
          </NavButton>
        </div>
      </main>
    </div>
  );
}
