/**
 * ログインページです！
 */
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-indigo-900 to-purple-900 text-white px-4">
      <div className="max-w-md w-full bg-white text-black p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
      <form className="space-y-4">
        <input type="email" placeholder="メールアドレス" className="w-full px-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
        <input type="password" placeholder="パスワード" className="w-full px-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">ログイン</button>
      </form>
      <p className="mt-4 text-sm text-center">アカウントをお持ちないですか？{" "}
        <Link href="/signup" className="items-center">
          <button className="px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition">
            新規登録
          </button>
        </Link>
      </p>
      </div>
    </main>
  );
}
