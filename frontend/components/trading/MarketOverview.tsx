'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const mockMarketData = {
  btcPrice: 45240,
  btcChange24h: 2.34,
  ethPrice: 2840,
  ethChange24h: -1.23,
  fearGreedIndex: 65,
  totalMarketCap: 1800000000000,
}

const chartData = {
  labels: Array.from({ length: 24 }, (_, i) => `${23 - i}h`),
  datasets: [
    {
      label: 'BTC Price',
      data: Array.from({ length: 24 }, () => 
        mockMarketData.btcPrice + (Math.random() - 0.5) * 2000
      ),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
    {
      label: 'ETH Price',
      data: Array.from({ length: 24 }, () => 
        mockMarketData.ethPrice + (Math.random() - 0.5) * 200
      ),
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ],
}

const chartOptions = {
  responsive: true,
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
      display: false,
    },
    y: {
      display: false,
    },
  },
  maintainAspectRatio: false,
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState(mockMarketData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchMarketData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market-data`)
      if (response.ok) {
        const data = await response.json()
        setMarketData(data)
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMarketCap = (cap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(cap)
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Market Overview</h3>
        <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-400 font-medium">Live</span>
        </div>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-dark-700/50 border border-dark-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">₿</span>
              </div>
              <span className="font-medium text-white">Bitcoin</span>
            </div>
            <div className="flex items-center space-x-1">
              {marketData.btcChange24h >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                marketData.btcChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketData.btcChange24h >= 0 ? '+' : ''}{marketData.btcChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatPrice(marketData.btcPrice)}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-dark-700/50 border border-dark-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">Ξ</span>
              </div>
              <span className="font-medium text-white">Ethereum</span>
            </div>
            <div className="flex items-center space-x-1">
              {marketData.ethChange24h >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                marketData.ethChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketData.ethChange24h >= 0 ? '+' : ''}{marketData.ethChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatPrice(marketData.ethPrice)}</p>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Total Market Cap</p>
          <p className="text-xl font-bold text-white">{formatMarketCap(marketData.totalMarketCap)}</p>
        </div>
        
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Fear & Greed Index</p>
          <div className="flex items-center space-x-2">
            <p className="text-xl font-bold text-white">{marketData.fearGreedIndex}</p>
            <span className={`text-sm px-2 py-1 rounded-full ${
              marketData.fearGreedIndex > 70 ? 'bg-red-500/20 text-red-400' :
              marketData.fearGreedIndex > 50 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {marketData.fearGreedIndex > 70 ? 'Greed' :
               marketData.fearGreedIndex > 50 ? 'Neutral' : 'Fear'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
