// src/app/word-list/page.tsx
//このファイルは、単語カードのリストを表示するためのコンポーネントです。


'use client';
import { useEffect, useState } from 'react';
import { WordCard } from '@/types/card';

import NightStarCanvas from "../components/StarCanvas";
import NavigationBar from '../components/NavigationBar';


export default function CardListPage() {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------- Inline Style (CSS 不使用) ----------
  const palette = {
    bg: '#0d1117',
    panel: '#161b22',
    panelAlt: '#1f252e',
    border: '#30363d',
    text: '#e6edf3',
    sub: '#8b949e',
    green: '#2ea043',
    blue: '#0969da',
    orange: '#d29922',
    red: '#f85149',
    gray: '#6e7681'
  } as const;

  // 画面中央配置用（ナビ下から全高確保）
  const mainStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0, // NavigationBar の高さ分オフセット（必要なら調整）
    boxSizing: 'border-box'
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px 80px',
    color: palette.text,
    fontFamily: 'system-ui, sans-serif',
    width: '100%',
    boxSizing: 'border-box'
  };

  const panelStyle: React.CSSProperties = {
    background: palette.panel,
    border: `1px solid ${palette.border}`,
    borderRadius: 14,
    padding: 24,
    boxShadow: '0 4px 16px -4px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,0.02)',
    backdropFilter: 'blur(4px)'
  };

  const headingStyle: React.CSSProperties = {
    margin: '0 0 24px',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '.5px',
    textAlign: 'center'
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '.6px',
    color: palette.sub
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: `1px solid ${palette.border}`,
    background: palette.panelAlt,
    outline: 'none',
    fontSize: 14,
    color: palette.text,
    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)'
  };

  const buttonBase: React.CSSProperties = {
    padding: '10px 18px',
    borderRadius: 10,
    border: 'none',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    letterSpacing: '.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 2px 4px rgba(0,0,0,.4)',
    transition: 'transform .12s, box-shadow .2s, filter .2s'
  };

  const buttonVariants = {
    add: { background: palette.green, color: '#fff' },
    update: { background: palette.blue, color: '#fff' },
    cancel: { background: palette.gray, color: '#fff' },
    edit: { background: palette.orange, color: '#fff' },
    delete: { background: palette.red, color: '#fff' }
  } as const;

  const cardListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  };

  const cardStyle = (isEditing: boolean): React.CSSProperties => ({
    background: isEditing ? 'linear-gradient(135deg,#1d2733,#18212b)' : palette.panel,
    border: `1px solid ${isEditing ? palette.blue : palette.border}`,
    borderRadius: 16,
    padding: '18px 20px 14px',
    position: 'relative',
    boxShadow: isEditing ? '0 0 0 1px rgba(9,105,218,.4), 0 6px 18px -6px rgba(0,0,0,.55)' : '0 4px 14px -6px rgba(0,0,0,.55)',
    transition: 'box-shadow .25s, border-color .25s'
  });

  const qaPill: React.CSSProperties = {
    background: palette.panelAlt,
    borderRadius: 10,
    padding: '6px 10px',
    fontSize: 14,
    lineHeight: 1.5,
    border: `1px solid ${palette.border}`,
    wordBreak: 'break-word'
  };

  const pillLabel: React.CSSProperties = { opacity: .75, marginRight: 6 };

  const actionRow: React.CSSProperties = {
    marginTop: 10,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  };

  const smallTag: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 10,
    fontSize: 11,
    fontWeight: 600,
    color: palette.sub,
    letterSpacing: '.5px'
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/cards');
        const data = await res.json();
        setCards(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await fetch('/api/cards', {
          method: 'PUT',
          body: JSON.stringify({ id: editId, question, answer }),
        });
      } else {
        await fetch('/api/cards', {
          method: 'POST',
          body: JSON.stringify({ question, answer }),
        });
      }
      setQuestion('');
      setAnswer('');
      setEditId(null);
      const res = await fetch('/api/cards');
      setCards(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: WordCard) => {
    setEditId(card.id);
    setQuestion(card.question);
    setAnswer(card.answer);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除してよろしいですか？')) return;
    setLoading(true);
    try {
      await fetch('/api/cards', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      const res = await fetch('/api/cards');
      setCards(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center tracking-wide mt-30 ">単語帳</h2>
      <NavigationBar />
      <NightStarCanvas />
      <div style={mainStyle}>
        <div style={containerStyle}>
          <div style={{ ...panelStyle, width: '100%', maxWidth: 640 }}>
          <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputWrapperStyle}>
            <label style={labelStyle}>質問</label>
            <input
              style={inputStyle}
              placeholder="例: apple"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div style={inputWrapperStyle}>
            <label style={labelStyle}>答え</label>
            <input
              style={inputStyle}
              placeholder="例: りんご"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <button type="submit" disabled={loading} style={{ ...buttonBase, ...(editId ? buttonVariants.update : buttonVariants.add), opacity: loading ? .6 : 1 }}>
              {loading ? '送信中...' : editId ? '更新' : '追加'}
            </button>
            {editId && (
              <button type="button" disabled={loading} style={{ ...buttonBase, ...buttonVariants.cancel }}
                onClick={() => { setEditId(null); setQuestion(''); setAnswer(''); }}>
                キャンセル
              </button>
            )}
          </div>
            </form>
            {loading && (
              <div style={{ fontSize: 12, color: palette.sub, marginBottom: 12 }}>更新中...</div>
            )}
            <ul style={cardListStyle}>
          {cards.map(card => {
            const isEditing = editId === card.id;
            return (
              <li key={card.id} style={cardStyle(isEditing)}>
                {isEditing && <span style={smallTag}>編集中</span>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={qaPill}><span style={pillLabel}>Q</span>{card.question}</div>
                  <div style={qaPill}><span style={pillLabel}>A</span>{card.answer}</div>
                </div>
                <div style={actionRow}>
                  <button type="button" style={{ ...buttonBase, ...buttonVariants.edit }} onClick={() => handleEdit(card)}>編集</button>
                  <button type="button" style={{ ...buttonBase, ...buttonVariants.delete }} onClick={() => handleDelete(card.id)}>削除</button>
                </div>
              </li>
            );
          })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
