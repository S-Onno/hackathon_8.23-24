'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type ErrorWithStatus = Error & {
  digest?: string;
  status?: number;
};

type ErrorPageProps = {
  error: ErrorWithStatus;
  reset: () => void;
};

function getStatus(error: ErrorWithStatus) {
  if (typeof error.status === 'number' && error.status >= 100 && error.status < 600) {
    return error.status;
  }

  const statusInMessage = /status:(\d{3})/.exec(error.message);
  return statusInMessage ? Number(statusInMessage[1]) : 500;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const status = getStatus(error);

  useEffect(() => {
    console.error('Captured error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 px-4 py-12 text-white flex items-center justify-center">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-indigo-950/90 p-8 text-center shadow-2xl">
        <div className="mb-3 text-6xl" role="img" aria-label="エラー">❌</div>
        <h1 className="mb-3 text-2xl font-extrabold">エラーが発生しました</h1>
        <p className="mb-4 text-lg text-red-300">ステータス: {status}</p>
        <p className="mb-2 break-words text-sm text-gray-200">
          {error.message || '不明なエラーです。'}
        </p>
        {error.digest && (
          <p className="mb-5 text-xs text-gray-400">Trace ID: {error.digest}</p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
          >
            再試行
          </button>
          <Link
            href="/"
            className="rounded-lg bg-slate-600 px-5 py-3 font-semibold hover:bg-slate-500"
          >
            ホームへ
          </Link>
          <a
            href="https://github.com/S-Onno/hackathon_8.23-24/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
          >
            Issues
          </a>
        </div>
      </section>
    </main>
  );
}
