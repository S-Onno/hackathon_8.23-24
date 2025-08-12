import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-indigo-900 to-purple-900 text-white px-4">
      <div className="max-w-md w-full bg-white text-black p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">新規登録</h2>
        <form className="space-y-4">
          <input type="text" placeholder="ユーザー名" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500"></input>
          <input type="email" placeholder="メールアドレス" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500"></input>        
          <input type="password" placeholder="パスワード" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500"></input>
          <input type="password" placeholder="パスワード(確認用)" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500"></input>
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">登録する</button>
        </form>
        <p className="mt-4 text-sm text-center">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/login">
          <button className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
            ログイン
          </button>
          </Link>
        </p>
      </div>
    </main>
  );
}
