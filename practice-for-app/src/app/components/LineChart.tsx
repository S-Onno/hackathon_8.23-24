'use client';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: 'black',
      },
    },
  },
  scales: {
    x: {
      ticks: { color: 'black' },
      grid: { color: 'rgba(255,255,255,0.1)' },
    },
    y: {
      ticks: { color: 'black' },
      grid: { color: 'rgba(255,255,255,0.1)' },
    },
  },
};

export default function LineChart() {
  const [mode, setMode] = useState<'today' | 'week' | 'month'>('week');

  function formatHours(hours: number) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}時間${m}分`;
  }

  const chartData = {
    today: {
      labels: ['8/18'],
      datasets: [
        {
          label: '今日の学習時間',
          data: [7],
        },
      ],
    },
    week: {
      labels: ['8/12', '8/13', '8/14', '8/15', '8/16', '8/17', '8/18'],
      datasets: [
        {
          label: '今週の学習時間',
          data: [2, 4, 3, 5, 6, 4, 7],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    },
    month: {
      labels: ['8/01', '8/08', '8/15', '8/22'],
      datasets: [
        {
          label: '今月の学習時間',
          data: [12, 18, 24, 30],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl">
      <div className="flex gap-2 mb-4">
        {['today', 'week', 'month'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`px-4 py-2 rounded ${mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {m === 'today' ? '今日' : m === 'week' ? '今週' : '今月'}
          </button>
        ))}
      </div>

      {mode === 'today' && (
        <div className="text-center text-lg font-semibold text-blue-600 mb-2">
          今日の学習時間：{formatHours(chartData.today.datasets[0].data[0])}
        </div>
      )}

      {mode !== 'today' && (
        <Line data={chartData[mode]} options={options} />
      )}
    </div>
  );
}