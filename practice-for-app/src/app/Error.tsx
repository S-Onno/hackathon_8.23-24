// このファイルは Next.js (App Router) のグローバルエラーハンドリング用コンポーネント。
// app ディレクトリ直下に `error.tsx` を配置すると、サーバ / クライアント双方のレンダリング中に
// 投げられた例外をキャッチしてこの UI が表示される。`reset()` を呼ぶと再レンダリングを試行。
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// 独自に HTTP ステータス番号や digest (Next.js が生成する一意なトレース ID) を持たせるための型拡張
type ErrorWithStatus = Error & { status?: number; digest?: string };

export default function Error({
  error,
  reset,
}: {
  error: ErrorWithStatus;   // 捕捉されたエラーオブジェクト
  reset: () => void;        // 再試行 (同じルートを再レンダリング) するための関数 (Next.js が注入)
}) {
  // 画面に表示する HTTP ステータス番号。初期値は内部エラー扱いで 500
  const [status, setStatus] = useState<number>(500);

  useEffect(() => {
    // error オブジェクトに直接 status プロパティがあればそれを利用 (サーバ側で付与される想定)
    const s = (error as any).status;
    if (typeof s === 'number' && s >= 100 && s < 600) {
      setStatus(s);
    } else {
      // status プロパティが無い場合、message 文字列の中に埋め込まれたパターン "status:404" を正規表現で探す
      const m = /status:(\d{3})/.exec(error.message);
      if (m) setStatus(parseInt(m[1], 10));
    }
    // デバッグ用にコンソールへフルのエラー情報を出力 (本番では Sentry 等に送る想定)
    console.error('Captured error:', error);
  }, [error]);

  return (
    <html>
      <body style={{
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(135deg, #232526 0%, #1e1b4b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#fff',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(30, 27, 75, 0.95)',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          padding: '40px 28px',
          border: '1.5px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* 大きなエラーアイコン */}
          <div style={{ fontSize: 60, marginBottom: 12, color: '#f87171', lineHeight: 1 }}>
            <span role="img" aria-label="error">❌</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, marginBottom: 10, letterSpacing: 1 }}>
            エラーが発生しました
          </h1>
          <div style={{ fontSize: 15, lineHeight: 1.7, width: '100%', textAlign: 'center', marginBottom: 18 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>HTTPステータス:</strong>{' '}
              <span style={{ fontSize: 22, fontWeight: 700, color: '#fca5a5' }}>{status}</span>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 8 }}>
              <strong>メッセージ:</strong><br />
              {error.message || '不明なエラー'}
            </div>
            {error.digest && (
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
                Trace ID: {error.digest}
              </div>
            )}
            <div style={{ marginTop: 10, marginBottom: 0 }}>
              <span style={{ fontSize: 13, color: '#a5b4fc' }}>
                お問い合わせは{' '}
                <Link href="https://github.com/S-Onno/hackathon_8.23-24/issues" style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 600 }}>
                  Issues
                </Link>
                へ
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, width: '100%', marginTop: 18 }}>
            <button
              onClick={() => reset()}
              style={{
                flex: 1,
                background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                border: 'none',
                padding: '12px 0',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.15)',
                transition: 'background 0.2s',
              }}
            >
              再試行
            </button>
            <a
              href="/"
              style={{
                flex: 1,
                textAlign: 'center',
                background: 'linear-gradient(90deg, #475569 0%, #64748b 100%)',
                padding: '12px 0',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                boxShadow: '0 2px 8px 0 rgba(71,85,105,0.12)',
                transition: 'background 0.2s',
              }}
            >
              ホームへ
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
