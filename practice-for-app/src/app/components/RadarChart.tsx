'use client'

import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { learningData } from '@/app/dummy_data/learningData'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const options = {
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 2,
      },
      pointLabels: {
        font: {
          size: 14,
        },
      },
    },
  },
}

const backgroundPlugin = {
  id: 'customBackground',
  beforeDraw: (chart: any) => {
    const ctx = chart.ctx;
    const { width, height } = chart;
    ctx.save();

    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ffffff'); // 深い紫
    gradient.addColorStop(0.5, '#ffffff'); // 青紫
    gradient.addColorStop(1, '#ffffff'); // 黒に近い紫

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  },
};

export default function RadarChart() {
  return (
    <div className="max-w-md w-full p-4 bg-white rounded-lg backdrop-blur-md">
      <h2 className="text-xl font-bold mb-4 text-center text-black">今日の学習バランス</h2>
      <div className="relative h-64 w-full">
      <Radar
        data={learningData}
        options={options}
        plugins={[backgroundPlugin]}
      />
      </div>
    </div>
  );
}