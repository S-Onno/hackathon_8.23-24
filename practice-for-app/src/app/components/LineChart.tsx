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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const data = {
  labels: ['8/12', '8/13', '8/14', '8/15', '8/16', '8/17', '8/18'],
  datasets: [
    {
      label: '学習時間（時間）',
      data: [2, 4, 3, 5, 6, 4, 7],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
};

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
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl">
      <Line data={data} options={options} />
    </div>
  );
}