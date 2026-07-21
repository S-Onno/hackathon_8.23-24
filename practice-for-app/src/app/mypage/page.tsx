'use client';

import { useCallback, useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import NavigationBar from '../components/NavigationBar';
import ProfileCard from '../components/ProfileCard';
import RadarChart from '../components/RadarChart';
import StarCanvas from '../components/StarCanvas';
import type { StudyLogsResponse } from '@/types/study-log';
import { fetchStudyLogs, isAbortError } from '@/utils/study-log';

type LoadState = 'loading' | 'ready' | 'error';

function formatDuration(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}時間${minutes}分`;
  if (minutes > 0) return `${minutes}分`;
  return `${seconds}秒`;
}

export default function MyPage() {
  const [data, setData] = useState<StudyLogsResponse | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudyLogs() {
      setLoadState('loading');
      setErrorMessage('');

      try {
        const nextData = await fetchStudyLogs(controller.signal);
        setData(nextData);
        setLoadState('ready');
      } catch (error) {
        if (isAbortError(error)) return;
        setData(null);
        setErrorMessage(error instanceof Error ? error.message : '学習記録の取得に失敗しました');
        setLoadState('error');
      }
    }

    void loadStudyLogs();
    return () => controller.abort();
  }, [requestVersion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] p-4 pt-20 text-white">
      <NavigationBar />
      <StarCanvas />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
        <h1 className="mb-6 mt-8 text-center text-3xl font-bold tracking-wide">マイページ</h1>

        <div className="flex w-full flex-col items-center gap-8 xl:flex-row xl:items-start">
          <ProfileCard />

          <div className="flex w-full flex-1 flex-col gap-6">
            {loadState === 'loading' && (
              <p role="status" className="rounded-lg bg-white/10 p-8 text-center">
                学習記録を読み込んでいます…
              </p>
            )}

            {loadState === 'error' && (
              <div role="alert" className="rounded-lg bg-red-950/70 p-6 text-center">
                <p>{errorMessage}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-4 rounded bg-white px-4 py-2 font-semibold text-red-800"
                >
                  再試行
                </button>
              </div>
            )}

            {loadState === 'ready' && data && data.logs.length === 0 && (
              <div className="rounded-lg bg-white/10 p-8 text-center">
                <h2 className="text-xl font-semibold">学習記録はまだありません</h2>
                <p className="mt-2 text-white/80">学習タイマーを使うと、ここに集計結果が表示されます。</p>
              </div>
            )}

            {loadState === 'ready' && data && data.logs.length > 0 && (
              <>
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="学習時間の集計">
                  {[
                    ['今日', data.summary.todaySeconds],
                    ['今週', data.summary.weekSeconds],
                    ['今月', data.summary.monthSeconds],
                  ].map(([label, seconds]) => (
                    <div key={label} className="rounded-lg bg-white p-4 text-center text-gray-900 shadow-md">
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="mt-1 text-xl font-bold text-blue-700">{formatDuration(Number(seconds))}</p>
                    </div>
                  ))}
                </section>

                <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row">
                  <LineChart summary={data.summary} />
                  <RadarChart bySubject={data.summary.bySubject} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
