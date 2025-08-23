// このファイルは Next.js (App Router) のグローバルエラーハンドリング用コンポーネント。
// app ディレクトリ直下に `error.tsx` を配置すると、サーバ / クライアント双方のレンダリング中に
// 投げられた例外をキャッチしてこの UI が表示される。`reset()` を呼ぶと再レンダリングを試行。
'use client';

import React, { useEffect, useState } from 'react';

// 独自に HTTP ステータス番号や digest (Next.js が生成する一意なトレース ID) を持たせるための型拡張
type ErrorWithStatus = Error & { status?: number; digest?: string };

export default function GlobalError({
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
        // 画面全体を中央寄せしつつダークなグラデーション背景
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom,#000,#1e1b4b)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          // ガラスモーフィズム風の半透明カード
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 16,
          padding: '28px 32px',
          backdropFilter: 'blur(6px)'
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: 16 }}>
            エラーが発生しました
          </h1>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            <p style={{ margin: 0, marginBottom: 8 }}>
              <strong>HTTPステータス:</strong>{' '}
              {/* 抽出したステータス番号を強調表示 */}
              <span style={{ fontSize: 20, fontWeight: 600, color: '#fca5a5' }}>{status}</span>
            </p>
            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
              <strong>メッセージ:</strong><br />
              {/* エラーメッセージが無い場合はフォールバック */}
              {error.message || '不明なエラー'}
            </p>
            {error.digest && (
              <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
                {/* Next.js が内部で生成する digest (追跡用 ID) */}
                Trace ID: {error.digest}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button
              onClick={() => reset()}
              style={{
                // reset() で対象ツリーを再レンダリングし再試行
                flex: 1,
                background: '#2563eb',
                border: 'none',
                padding: '10px 14px',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              再試行
            </button>
            <a
              href="/"
              style={{
                flex: 1,
                textAlign: 'center',
                background: '#475569',
                padding: '10px 14px',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 600,
                textDecoration: 'none'
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
