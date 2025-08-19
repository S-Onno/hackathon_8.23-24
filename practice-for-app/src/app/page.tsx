/**
 * トップページです！
 */
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-bold mb-4 tracking-wide">Universe</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        あなたの学びが、惑星を育てる。 
        宇宙をテーマにした学習アプリで、努力を可視化しよう。
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <button className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
            ログイン
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition">
            新規登録
          </button>
        </Link>
      </div>
    </main>
  );
}