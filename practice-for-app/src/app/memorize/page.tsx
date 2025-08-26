'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { WordCard } from '@/types/card';
import NightStarCanvas from "../components/StarCanvas";
import NavigationBar from '../components/NavigationBar';

export default function QuizPage() {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revealing, setRevealing] = useState(false);

  // -------- パレット / 共通スタイル --------
  const palette = {
    bg: '#0d1117', panel: '#161b22', panelAlt: '#1f252e', border: '#30363d', text: '#e6edf3', sub: '#8b949e', green: '#2ea043', blue: '#0969da', orange: '#d29922', red: '#f85149', gray: '#6e7681'
  } as const;

  const containerStyle: React.CSSProperties = { 
    maxWidth: 680,
    margin: '0 auto',
    padding: '80px 28px 120px',
    color: palette.text,
    fontFamily: 'system-ui, sans-serif' 
  };
  const panelStyle: React.CSSProperties = { background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 16, padding: 32, boxShadow: '0 4px 18px -4px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)' };
  const headingStyle: React.CSSProperties = { margin: '0 0 18px', fontSize: 26, fontWeight: 700, letterSpacing: '.5px' };
  const subInfoStyle: React.CSSProperties = { marginBottom: 20, fontSize: 14, color: palette.sub, display: 'flex', gap: 20, flexWrap: 'wrap' };
  const buttonBase: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', letterSpacing: '.5px', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(0,0,0,.4)', transition: 'transform .12s, box-shadow .2s', color: '#fff' };
  const buttonVariants = { primary: { background: palette.blue }, toggle: { background: palette.orange }, neutral: { background: palette.gray }, next: { background: palette.green }, danger: { background: palette.red } } as const;
  const cardShell: React.CSSProperties = { background: palette.panelAlt, border: `1px solid ${palette.border}`, borderRadius: 18, padding: '28px 26px 24px', marginBottom: 24, position: 'relative', boxShadow: '0 6px 18px -8px rgba(0,0,0,.55)', transition: 'border-color .25s, box-shadow .25s' };
  const qaText: React.CSSProperties = { fontSize: 22, fontWeight: 600, letterSpacing: '.4px', lineHeight: 1.4, wordBreak: 'break-word' };
  const answerBox: React.CSSProperties = { marginTop: 20, padding: '14px 16px', background: '#1e2732', border: `1px solid ${palette.border}`, borderRadius: 12, fontSize: 18, lineHeight: 1.5, color: palette.text, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' };
  const hintStyle: React.CSSProperties = { marginTop: 24, fontSize: 12, letterSpacing: '.5px', color: palette.sub };
  const emptyStyle: React.CSSProperties = { textAlign: 'center', padding: '80px 20px', background: palette.panelAlt, border: `1px solid ${palette.border}`, borderRadius: 16, color: palette.sub };
  const flexRow: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap' };
  const tagStyle: React.CSSProperties = { position: 'absolute', top: 10, right: 14, fontSize: 11, fontWeight: 600, color: palette.sub, letterSpacing: '.5px' };

  const fetchCards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cards');
      const data: WordCard[] = await res.json();
      setCards(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchCards(); }, [fetchCards]);

  const nextCard = useCallback(() => {
    if (cards.length === 0) {
      setCurrentIndex(null); setShowAnswer(false); return;
    }
    const idx = Math.floor(Math.random() * cards.length);
    setCurrentIndex(idx); setShowAnswer(false); setRevealing(false);
    requestAnimationFrame(() => setRevealing(true));
  }, [cards]);

  useEffect(() => {
    if (cards.length > 0 && currentIndex === null) nextCard();
  }, [cards, currentIndex, nextCard]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space') { e.preventDefault(); setShowAnswer(s => !s); }
      if (e.key === 'ArrowRight') { nextCard(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextCard]);

  const current = currentIndex === null ? null : cards[currentIndex];

  return (
    <>
      <h2 className="text-3xl font-bold text-center tracking-wide mt-30 mb-4">暗記クイズ</h2>
      <NavigationBar />
      <NightStarCanvas />
      <div style={containerStyle}>
        <div style={panelStyle}>
          <div style={subInfoStyle}>
            <span>出題数: {cards.length}</span>
            <span>現在: {current ? `${currentIndex! + 1}/${cards.length}` : '-'}</span>
          </div>

          {loading && (
            <div style={{ marginBottom: 24, fontSize: 13, color: palette.sub }}>読み込み中...</div>
          )}

          {!loading && cards.length === 0 && (
            <div style={emptyStyle}>カードが登録されていません。</div>
          )}

          {!loading && current && (
            <>
              <div style={{ ...cardShell, border: `1px solid ${showAnswer ? palette.blue : palette.border}`, boxShadow: showAnswer ? '0 0 0 1px rgba(9,105,218,.4), 0 6px 20px -6px rgba(0,0,0,.6)' : cardShell.boxShadow }}>
                <span style={tagStyle}>QID: {current.id}</span>
                <div style={{ ...qaText, opacity: revealing ? 1 : 0, transform: `translateY(${revealing ? 0 : 6}px)`, transition: 'opacity .45s ease, transform .45s ease' }}>
                  Q: {current.question}
                </div>
                {showAnswer && (
                  <div style={{ ...answerBox, opacity: showAnswer ? 1 : 0, transform: `translateY(${showAnswer ? 0 : 4}px)`, transition: 'opacity .35s ease, transform .35s ease' }}>
                    A: {current.answer}
                  </div>
                )}
              </div>
              <div style={flexRow}>
                {!showAnswer ? (
                  <button style={{ ...buttonBase, ...buttonVariants.toggle }} onClick={() => setShowAnswer(true)}>回答を表示</button>
                ) : (
                  <button style={{ ...buttonBase, ...buttonVariants.neutral }} onClick={() => setShowAnswer(false)}>回答を隠す</button>
                )}
                <button style={{ ...buttonBase, ...buttonVariants.next }} onClick={nextCard}>次の問題</button>
                <button style={{ ...buttonBase, ...buttonVariants.primary }} onClick={() => { void fetchCards(); }}>再取得</button>
              </div>
              <div style={hintStyle}>Space: 回答切替 / → : 次の問題</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
