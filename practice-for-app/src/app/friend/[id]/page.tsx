'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudyCard from '../../components/StudyCard';
import NavigationBar from '../../components/NavigationBar';
import StudyLogsBar from '../../components/StudyLogsBar';
import BackTopButton from '../../components/BackTop';

export default function FriendPage() {
  const params = useParams();
  const id = params?.id as string; // 型安全に取得

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

      <h1 className="text-2xl font-semibold mb-2">{friendData.name} さんの惑星</h1>

      {friendData.message && (
        <div className="mt-2 px-4 py-2 bg-indigo-700 rounded-lg text-white text-sm shadow-md max-w-md text-center">
          {friendData.message}
        </div>
      )}

      <div className="mt-4" />

      {friendData.profile && (
        <div className="mt-12 w-full max-w-md bg-gray-800 rounded-lg p-4 text-white shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">プロフィール</h2>
          <p><span className="font-semibold">名前:</span> {friendData.profile.name}</p>
          <p><span className="font-semibold">目標:</span> {friendData.profile.goal}</p>
          <p><span className="font-semibold">好きな科目:</span> {friendData.profile.favoriteSubject}</p>
        </div>
      )}

      <div className="mt-12" />

      {friendData.studyLogs?.length > 0 && (
        <StudyLogsBar logs={friendData.studyLogs} />
      )}

      <div className="mt-20 w-full">
        <div className="flex-1 min-w-[140px] bg-indigo-700 rounded-md p-4 text-sm text-center shadow-sm">
          <h2 className="text-lg font-semibold mb-4">学習推移</h2>
          <StudyCard
            name={friendData.name}
            today={friendData.today}
            week={friendData.week}
            month={friendData.month}
          />
        </div>
      </div>

      <div className="mt-12" />

      {friendData.lastStudyDate && (
        <div className="mt-2 text-sm text-gray-300">
          最終学習日：{friendData.lastStudyDate}
        </div>
      )}

      <div className="mb-2 w-full flex justify-start">
        <BackTopButton />
      </div>
    </div>
  );
}