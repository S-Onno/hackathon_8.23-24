import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
        404
      </p>
      <h1 className="mb-4 text-3xl font-bold">ページが見つかりません</h1>
      <p className="mb-8 max-w-md text-slate-300">
        URLが変更されたか、ページが削除された可能性があります。
      </p>
      <Link
        href="/"
        className="rounded bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
      >
        トップへ戻る
      </Link>
    </main>
  );
}
