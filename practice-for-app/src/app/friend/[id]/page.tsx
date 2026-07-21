'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { FriendDetails } from '@/types/friend';
import StudyCard from '../../components/StudyCard';
import NavigationBar from '../../components/NavigationBar';
import StudyLogsBar from '../../components/StudyLogsBar';
import StarCanvas from '../../components/StarCanvas';

export default function FriendPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [friendData, setFriendData] = useState<FriendDetails | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-found' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFriend() {
      setStatus('loading');
      setFriendData(null);

      try {
        const response = await fetch(`/api/friends/${encodeURIComponent(id)}`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          setStatus('not-found');
          return;
        }

        if (!response.ok) {
          throw new Error(`フレンド情報の取得に失敗しました (${response.status})`);
        }

        const data: FriendDetails = await response.json();
        setFriendData(data);
        setStatus('ready');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to load friend:', error);
        setStatus('error');
      }
    }

    void loadFriend();
    return () => controller.abort();
  }, [id, retryCount]);

  if (status !== 'ready' || !friendData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0f0c29] text-white pt-24 p-10 flex flex-col items-center">
        <NavigationBar />
        <StarCanvas />
        {status === 'loading' && <p role="status">フレンド情報を読み込んでいます...</p>}
        {status === 'not-found' && (
          <div className="text-center" role="alert">
            <h1 className="text-2xl font-bold mb-4">フレンドが見つかりません</h1>
            <Link className="text-blue-300 underline" href="/friends">フレンド一覧へ戻る</Link>
          </div>
        )}
        {status === 'error' && (
          <div className="text-center" role="alert">
            <p className="mb-4">フレンド情報を取得できませんでした。</p>
            <button
              type="button"
              className="rounded bg-indigo-600 px-4 py-2 hover:bg-indigo-500"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              再試行
            </button>
          </div>
        )}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] text-white pt-20 p-10 flex flex-col items-center">
      <NavigationBar />
      <StarCanvas />

      <h1 className="text-3xl font-bold mt-8 mb-4 text-white tracking-wide">{friendData.name} さんの惑星</h1>

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

    </div>
  );
}
