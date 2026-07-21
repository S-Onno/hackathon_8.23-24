"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormWrapper from "@/app/components/FormWrapper";
import NightStarCanvas from "@/app/components/StarCanvas";

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
  return "登録に失敗しました。時間をおいて再度お試しください。";
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") ?? "",
    );
    if (password !== passwordConfirmation) {
      setError("確認用パスワードが一致しません。");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          email: formData.get("email"),
          password,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(responseErrorMessage(payload));
        return;
      }

      router.replace("/top");
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
          新規登録
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            autoComplete="username"
            placeholder="ユーザー名"
            minLength={2}
            maxLength={50}
            required
            disabled={submitting}
            className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="メールアドレス"
            maxLength={254}
            required
            disabled={submitting}
            className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="パスワード（8文字以上）"
            minLength={8}
            maxLength={128}
            required
            disabled={submitting}
            className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            placeholder="パスワード（確認）"
            minLength={8}
            maxLength={128}
            required
            disabled={submitting}
            className="w-full rounded border border-white/20 bg-transparent px-4 py-2 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-white/30 bg-transparent py-2 text-white transition duration-200 hover:border-transparent hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "登録中..." : "登録"}
          </button>
          <Link
            href="/login"
            className="block w-full rounded border border-white/30 bg-transparent py-2 text-center text-white transition duration-200 hover:border-transparent hover:bg-blue-400"
          >
            会員の方はこちら
          </Link>
        </form>
      </FormWrapper>
    </main>
  );
}
