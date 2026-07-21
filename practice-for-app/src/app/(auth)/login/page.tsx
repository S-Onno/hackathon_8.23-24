"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormWrapper from "@/app/components/FormWrapper";
import NightStarCanvas from "@/app/components/StarCanvas";
import { safeRedirectPath } from "@/utils/safe-redirect";

function responseErrorMessage(payload: unknown): string {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error !== null &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }
  return "ログインに失敗しました。時間をおいて再度お試しください。";
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(responseErrorMessage(payload));
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.replace(safeRedirectPath(requestedPath));
      router.refresh();
    } catch {
      setError("通信に失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-black px-4 text-white">
      <NightStarCanvas />
      <FormWrapper>
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          ログイン
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="sr-only">メールアドレス</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="メールアドレス"
              required
              disabled={submitting}
              className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="sr-only">パスワード</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="パスワード"
              required
              disabled={submitting}
              className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-white/30 bg-transparent py-2 text-white transition duration-200 hover:border-transparent hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "ログイン中..." : "ログイン"}
          </button>
          <Link
            href="/signup"
            className="block w-full rounded border border-white/30 bg-transparent py-2 text-center text-white transition duration-200 hover:border-transparent hover:bg-green-400"
          >
            初めての方はこちら
          </Link>
        </form>
      </FormWrapper>
    </main>
  );
}
