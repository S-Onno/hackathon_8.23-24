'use client';

import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { SubjectStudySummary } from '@/types/study-log';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const options: ChartOptions<'radar'> = {
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}h`,
      },
      pointLabels: {
        color: '#111827',
        font: { size: 14 },
      },
      grid: { color: 'rgba(107,114,128,0.25)' },
      angleLines: { color: 'rgba(107,114,128,0.25)' },
    },
  },
  plugins: {
    legend: {
      labels: { color: '#111827' },
    },
  },
};

const backgroundPlugin: Plugin<'radar'> = {
  id: 'customBackground',
  beforeDraw: (chart) => {
    const { ctx, width, height } = chart;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  },
};

type RadarChartProps = {
  bySubject: SubjectStudySummary[];
};

export default function RadarChart({ bySubject }: RadarChartProps) {
  if (bySubject.length === 0) {
    return (
      <section className="w-full max-w-md rounded-lg bg-white p-4 text-gray-900">
        <h2 className="text-center text-xl font-bold">科目別の学習バランス</h2>
        <p className="py-20 text-center text-gray-500">科目別の学習データはありません</p>
      </section>
    );
  }

  const data: ChartData<'radar'> = {
    labels: bySubject.map((item) => item.subject),
    datasets: [
      {
        label: '今月の学習時間',
        data: bySubject.map((item) => item.durationSeconds / 3600),
        backgroundColor: 'rgba(37,99,235,0.2)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className="w-full max-w-md rounded-lg bg-white p-4 text-gray-900">
      <h2 className="mb-4 text-center text-xl font-bold">科目別の学習バランス</h2>
      <div className="relative h-72 w-full">
        <Radar data={data} options={options} plugins={[backgroundPlugin]} />
      </div>
    </section>
  );
}
