"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "My Page", href: "/mypage" },
  { label: "学習記録", href: "/study" },
  { label: "フレンド", href: "/friends" },
  { label: "単語帳", href: "/word-list" },
  { label: "暗記クイズ", href: "/memorize" },
] as const;

export default function NavigationBar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to log out:", error);
      setLogoutError("ログアウトできませんでした");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 flex min-h-20 items-center gap-4 overflow-x-auto bg-white px-4 py-3 shadow-md sm:px-6"
      aria-label="メインナビゲーション"
    >
      <Link href="/top" className="shrink-0" aria-label="Universeホーム">
        <Image
          src="/_images/Universelogobutton.png"
          alt="Universe"
          width={120}
          height={40}
          priority
        />
      </Link>

      <div className="flex min-w-max flex-1 items-center justify-center gap-4 sm:gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-semibold text-gray-800 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className="rounded border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
        {logoutError && (
          <span role="alert" className="text-xs text-red-700">
            {logoutError}
          </span>
        )}
      </div>
    </nav>
  );
}
