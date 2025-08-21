// src/app/word-list/page.tsx
//このファイルは、単語カードのリストを表示するためのコンポーネントです。


'use client';
import { useEffect, useState } from 'react';
import { WordCard } from '@/types/card';
import BackToTopButton from '../components/BackTop';

export default function CardListPage() {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(setCards);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    fetch('/api/cards').then(res => res.json()).then(setCards);
  };

  const handleEdit = (card: WordCard) => {
    setEditId(card.id);
    setQuestion(card.question);
    setAnswer(card.answer);
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/cards', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    fetch('/api/cards').then(res => res.json()).then(setCards);
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>暗記カード一覧</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="質問"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
        <input
          placeholder="答え"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          required
        />
        <button type="submit">{editId ? '更新' : '追加'}</button>
        {editId && <button onClick={() => { setEditId(null); setQuestion(''); setAnswer(''); }}>キャンセル</button>}
      </form>
      <ul>
        {cards.map(card => (
          <li key={card.id} style={{ marginBottom: 10 }}>
            <b>Q:</b> {card.question} <br />
            <b>A:</b> {card.answer} <br />
            <button onClick={() => handleEdit(card)}>編集</button>
            <button onClick={() => handleDelete(card.id)}>削除</button>
          </li>
        ))}
      </ul>
      <div className="mb-2 w-full flex justify-start">
        <BackToTopButton />
      </div>
    </div>
  );
}
