"use client";

import { useRouter } from "next/navigation";
import StarCanvas from "../components/StarCanvas";

export default function RegistrationComplete() {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push("/login"); // ログイン画面のパスに合わせて変更
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 px-4">
      <StarCanvas />
      <div className="bg-white text-black rounded-lg p-8 shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">登録ありがとうございました！</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          ログイン画面に戻って、学びの旅を始めましょう ✨
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={handleGoToLogin}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500 transition"
          >
            ログイン画面へ戻る
          </button>
        </div>     
       </div>
    </div>
  );
}