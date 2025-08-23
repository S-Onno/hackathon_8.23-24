'use client';

import React, { useEffect, useState } from 'react';

type ErrorWithStatus = Error & { status?: number; digest?: string };

export default function GlobalError({
  error,
  reset,
}: {
  error: ErrorWithStatus;
  reset: () => void;
}) {
  const [status, setStatus] = useState<number>(500);

  useEffect(() => {
    const s = (error as any).status;
    if (typeof s === 'number' && s >= 100 && s < 600) {
      setStatus(s);
    } else {
      // message 内に "status:404" のような形で埋め込んでいる場合の簡易抽出
      const m = /status:(\d{3})/.exec(error.message);
      if (m) setStatus(parseInt(m[1], 10));
    }
    console.error('Captured error:', error);
  }, [error]);

  return (
    <html>
      <body style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom,#000,#1e1b4b)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
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
              <span style={{ fontSize: 20, fontWeight: 600, color: '#fca5a5' }}>{status}</span>
            </p>
            <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
              <strong>メッセージ:</strong><br />
              {error.message || '不明なエラー'}
            </p>
            {error.digest && (
              <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
                Trace ID: {error.digest}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <button
              onClick={() => reset()}
              style={{
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
