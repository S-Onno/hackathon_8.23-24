'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudyCard from '../../components/StudyCard';
import NavigationBar from '../../components/NavigationBar';

export default function FriendPage() {
  const { id } = useParams();
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/friends/${id}`)
        .then((res) => res.json())
        .then((data) => setFriendData(data));
    }
  }, [id]);

  if (!friendData) return <div className="text-white p-10">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pt-20 p-10 flex flex-col items-center">
      <NavigationBar />
      <h1 className="text-2xl mb-6">{friendData.name} さんの学習状況</h1>
      <StudyCard
        name={friendData.name}
        today={friendData.today}
        week={friendData.week}
        month={friendData.month}
      />
    </div>
  );
}