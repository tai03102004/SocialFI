'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { ChartBarIcon } from '@heroicons/react/24/outline'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
interface TradingChartProps {
  pair: string,
  marketData?: any
}

export function TradingChart({ pair }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState('1H')

  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D', '1W']

  // Mock chart data
  const chartData = {
    labels: Array.from({ length: 50 }, (_, i) => i),
    datasets: [
      {
        label: pair,
        data: Array.from({ length: 50 }, (_, i) => {
          const base = 45000 + Math.sin(i * 0.3) * 2000
          return base + (Math.random() - 0.5) * 1000
        }),
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(71, 85, 105, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    },
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-6 w-6 text-primary-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{pair}</h3>
            <p className="text-sm text-gray-400">Price Chart</p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 bg-dark-700/50 p-1 rounded-lg">
          {timeframes.map((tf) => (
            <motion.button
              key={tf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                timeframe === tf
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-dark-600">
        <div>
          <p className="text-xs text-gray-400">24h High</p>
          <p className="text-sm font-semibold text-green-400">$47,240</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">24h Low</p>
          <p className="text-sm font-semibold text-red-400">$43,180</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">24h Volume</p>
          <p className="text-sm font-semibold text-white">28.5K BTC</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Market Cap</p>
          <p className="text-sm font-semibold text-white">$890B</p>
        </div>
      </div>
    </div>
  )
}
