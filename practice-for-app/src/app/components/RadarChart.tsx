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

export default function RadarChart() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">学習バランス</h2>
      <Radar data={learningData} options={options} />
    </div>
  )
}