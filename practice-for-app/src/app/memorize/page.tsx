'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { WordCard } from '@/types/card';
import NightStarCanvas from "../components/StarCanvas";




export default function QuizPage() {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // 初回取得
  useEffect(() => { void fetchCards(); }, [fetchCards]);

  // ランダムに次の問題を選ぶ
  const nextCard = useCallback(() => {
    if (cards.length === 0) {
      setCurrentIndex(null);
      setShowAnswer(false);
      return;
    }
    const idx = Math.floor(Math.random() * cards.length);
    setCurrentIndex(idx);
    setShowAnswer(false);
  }, [cards]);

  // カード取得後に自動で一題出す
  useEffect(() => {
    if (cards.length > 0 && currentIndex === null) nextCard();
  }, [cards, currentIndex, nextCard]);

  // キーボード操作: Spaceで表示切替、→で次へ
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space') { e.preventDefault(); setShowAnswer(s => !s); }
      if (e.key === 'ArrowRight') { nextCard(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextCard]);

  if (loading) return <div style={{ padding: 20 }}>読み込み中...</div>;
  if (cards.length === 0) return <div style={{ padding: 20 }}>カードが登録されていません。</div>;

  const current = currentIndex === null ? null : cards[currentIndex];

  return (
     <div className="relative w-full min-h-screen">
      <NightStarCanvas /> 
    
    <div style={{ maxWidth: 640, margin: 'auto', padding: 20 }}>
      <h2>単語クイズ</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>出題数:</strong> {cards.length}
        {' '}<strong>（現在）:</strong> {current ? `${currentIndex! + 1}/${cards.length}` : '-'}
      </div>

      {current ? (
        <>
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12 }}>
            <div className="quiz-question"><b>Q:</b> {current.question}</div>
            {showAnswer ? <div className="quiz-answer" style={{ marginTop: 8 }}><b>A:</b> {current.answer}</div> : null}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {!showAnswer ? (
              <button className="btn btn-primary" onClick={() => setShowAnswer(true)}>回答を表示</button>
            ) : (
              <button className="btn btn-ghost" onClick={() => setShowAnswer(false)}>回答を隠す</button>
            )}
            <button className="btn btn-primary" onClick={nextCard}>次の問題</button>
            <button className="btn" onClick={() => { void fetchCards(); }}>カードを再取得</button>
          </div>

          <div style={{ marginTop: 20, color: '#666' }}>
            ショートカットキー | 回答表示: Space = 回答切替, → = 次の問題
          </div>
        </>
      ) : (
  <div>問題が選ばれていません。<button className="btn btn-primary" onClick={nextCard}>次の問題を出す</button></div>
      )}
    </div>
    </div>
  );
}
