import NavButton from "./components/NavButton";
import NightStarCanvas from "./components/StarCanvas";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black text-white flex flex-col items-center justify-center px-4">
      <NightStarCanvas />
      <h1 className="text-5xl font-bold mb-4 tracking-wide">Universe</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        あなたの学びが、惑星を育てる。  
        宇宙をテーマにした学習アプリで、努力を可視化しよう。
      </p>
      <div className="flex gap-4">
        <NavButton href="/login">ログイン</NavButton>
        <NavButton href="/signup">新規登録</NavButton>
      </div>
    </main>
  );
}
