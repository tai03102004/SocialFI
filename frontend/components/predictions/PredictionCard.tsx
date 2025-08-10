'use client'

import { motion } from 'framer-motion'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Prediction {
  id: number
  asset: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  timeFrame: string
  status: 'pending' | 'correct' | 'incorrect'
  createdAt: string
  potentialReward: number
  actualPrice?: number
}

interface PredictionCardProps {
  prediction: Prediction
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const isUpward = prediction.predictedPrice > prediction.currentPrice
  const priceDifference = Math.abs(prediction.predictedPrice - prediction.currentPrice)
  const percentageChange = (priceDifference / prediction.currentPrice) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'text-green-400'
      case 'incorrect': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return CheckCircleIcon
      case 'incorrect': return XCircleIcon
      default: return ClockIcon
    }
  }

  const StatusIcon = getStatusIcon(prediction.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">{prediction.asset}</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{prediction.asset}/USDT</h3>
            <p className="text-xs text-gray-400">{prediction.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${getStatusColor(prediction.status)}`} />
          <span className={`text-sm font-medium capitalize ${getStatusColor(prediction.status)}`}>
            {prediction.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Current Price</p>
          <p className="font-semibold text-white">${prediction.currentPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Predicted Price</p>
          <div className="flex items-center space-x-1">
            {isUpward ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
            )}
            <p className="font-semibold text-white">${prediction.predictedPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {prediction.actualPrice && (
        <div className="mb-4 p-3 bg-dark-700/50 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Actual Result</p>
          <p className="font-semibold text-white">${prediction.actualPrice.toLocaleString()}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-xs text-gray-400">Confidence</p>
            <div className="flex items-center space-x-2">
              <div className="w-12 bg-dark-600 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-white font-medium">{prediction.confidence}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-400">Time Frame</p>
            <p className="text-xs font-medium text-white">{prediction.timeFrame}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Reward</p>
          <div className="flex items-center space-x-1">
            <CurrencyDollarIcon className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-yellow-400">{prediction.potentialReward}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dark-600">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Change: {isUpward ? '+' : '-'}{percentageChange.toFixed(2)}%
          </span>
          <span className="text-gray-400">
            ID: #{prediction.id}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
