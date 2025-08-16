// src/app/memorize/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { WordCard } from '@/types/card';

export default function MemorizePage() {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [current, setCurrent] = useState<WordCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(setCards);
  }, []);

  const nextCard = () => {
    if (cards.length === 0) return;
    const idx = Math.floor(Math.random() * cards.length);
    setCurrent(cards[idx]);
    setShowAnswer(false);
  };

  useEffect(() => {
    if (cards.length > 0) nextCard();
  }, [cards]);

  if (!current) return <div>カードがありません</div>;

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>暗記テスト</h2>
      <div style={{ marginBottom: 20 }}>
        <b>Q:</b> {current.question}
      </div>
      {showAnswer ? (
        <div style={{ marginBottom: 20 }}>
          <b>A:</b> {current.answer}
        </div>
      ) : (
        <button onClick={() => setShowAnswer(true)}>答えを見る</button>
      )}
      <button onClick={nextCard} style={{ marginLeft: 10 }}>次のカード</button>
    </div>
  );
}