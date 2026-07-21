'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import type { StudyLogSummary } from '@/types/study-log';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CHART_MODES = ['today', 'week', 'month'] as const;
type ChartMode = (typeof CHART_MODES)[number];

const MODE_LABELS: Record<ChartMode, string> = {
  today: '今日',
  week: '今週',
  month: '今月',
};

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#111827' },
    },
  },
  scales: {
    x: {
      ticks: { color: '#374151' },
      grid: { color: 'rgba(107,114,128,0.15)' },
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#374151' },
      grid: { color: 'rgba(107,114,128,0.15)' },
      title: { display: true, text: '時間', color: '#374151' },
    },
  },
};

function formatDuration(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) return `${hours}時間${minutes}分`;
  if (minutes > 0) return `${minutes}分`;
  return `${seconds}秒`;
}

function formatDate(date: string): string {
  const [year, month, day] = date.slice(0, 10).split('-');
  if (!year || !month || !day) return date;
  return `${Number(month)}/${Number(day)}`;
}

type LineChartProps = {
  summary: StudyLogSummary;
};

export default function LineChart({ summary }: LineChartProps) {
  const [mode, setMode] = useState<ChartMode>('week');

  const displayedDaily = useMemo(
    () =>
      mode === 'today'
        ? []
        : [
            ...(mode === 'week' ? summary.dailyWeek : summary.dailyMonth),
          ].sort((a, b) => a.date.localeCompare(b.date)),
    [mode, summary.dailyMonth, summary.dailyWeek],
  );
  const totalSeconds =
    mode === 'today'
      ? summary.todaySeconds
      : mode === 'week'
        ? summary.weekSeconds
        : summary.monthSeconds;

  const chartData: ChartData<'line'> = {
    labels: displayedDaily.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: `${MODE_LABELS[mode]}の学習時間`,
        data: displayedDaily.map((item) => item.durationSeconds / 3600),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <section className="w-full max-w-2xl rounded-lg bg-white p-4 text-gray-900 shadow-md">
      <div className="mb-4 flex flex-wrap gap-2" aria-label="表示期間">
        {CHART_MODES.map((chartMode) => (
          <button
            key={chartMode}
            type="button"
            onClick={() => setMode(chartMode)}
            aria-pressed={mode === chartMode}
            className={`rounded px-4 py-2 ${
              mode === chartMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {MODE_LABELS[chartMode]}
          </button>
        ))}
      </div>

      <p className="mb-3 text-center text-lg font-semibold text-blue-700">
        {MODE_LABELS[mode]}の合計: {formatDuration(totalSeconds)}
      </p>

      {mode === 'today' ? null : displayedDaily.length > 0 ? (
        <div className="h-72">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p className="py-20 text-center text-gray-500">日別の学習データはありません</p>
      )}
    </section>
  );
}
