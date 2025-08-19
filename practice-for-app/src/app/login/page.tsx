"use client"

import Link from "next/link";
import NightStarCanvas from "../components/StarCanvas";
import FormWrapper from "../components/FormWrapper";

export default function LoginPage() {
    return (
        <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black text-white px-4">
            {/* 背景 */}
            <NightStarCanvas />

            {/* フォーム枠（共通コンポーネント化） */}
            <FormWrapper>
                <h2 className="text-2xl font-bold mb-6 text-center text-white">ログイン</h2>
                <form className="space-y-6">
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        className="w-full px-4 py-2 border border-white/20 rounded bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        className="w-full px-4 py-2 border border-white/20 rounded bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        className="w-full border border-white/30 text-white py-2 rounded bg-transparent 
                            hover:bg-blue-400 hover:border-transparent
                            transform hover:scale-110 
                            transition duration-200"
                    >
                        ログイン
                    </button>

                    <Link href="/signup">
                        <button
                            type="button"
                            className="w-full border border-white/30 text-white py-2 rounded bg-transparent 
                                hover:bg-green-400 hover:border-transparent
                                transform hover:scale-110 
                                transition duration-200"
                        >
                            初めての方はこちら
                        </button>
                    </Link>
                </form>
            </FormWrapper>
        </main>
    );
}
