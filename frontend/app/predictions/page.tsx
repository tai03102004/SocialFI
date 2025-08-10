'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,  
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { PredictionCard } from '../../components/predictions/PredictionCard'

interface prediction {
  id: number
  asset: string
  currentPrice: number
  predictedPrice: number
  confidence: number
  timeFrame: string
  status: string
  createdAt: string
  potentialReward: number,
  actualPrice: number | null
}

interface PredictionCard {
  prediction: prediction
}

const mockPredictions = [
  {
    id: 1,
    asset: 'BTC',
    currentPrice: 45240,
    predictedPrice: 47000,
    confidence: 85,
    timeFrame: '24h',
    status: 'pending' as 'pending',
    createdAt: '2 hours ago',
    potentialReward: 45
  },
  {
    id: 2,
    asset: 'ETH',
    currentPrice: 2840,
    predictedPrice: 2950,
    confidence: 72,
    timeFrame: '12h',
    status: 'correct' as 'correct',
    createdAt: '1 day ago',
    potentialReward: 32,
    actualPrice: 2960
  },
  {
    id: 3,
    asset: 'BNB',
    currentPrice: 245,
    predictedPrice: 240,
    confidence: 60,
    timeFrame: '6h',
    status: 'incorrect' as 'incorrect',
    createdAt: '2 days ago',
    potentialReward: 18,
    actualPrice: 250
  }
]

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [predictions, setPredictions] = useState(mockPredictions)

  const tabs = [
    { id: 'active', label: 'Active', icon: '🟢' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'all', label: 'All History', icon: '📊' }
  ]

  const filteredPredictions = predictions.filter(p => {
    if (activeTab === 'active') return p.status === 'pending'
    if (activeTab === 'completed') return p.status !== 'pending'
    return true
  })

  const handleCreatePrediction = (newPrediction: any) => {
    setPredictions([newPrediction, ...predictions])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            <span className="text-gradient">Price Predictions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Predict cryptocurrency prices and earn rewards for accurate forecasts
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Create Prediction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <CreatePrediction onCreatePrediction={handleCreatePrediction} /> */}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-2"
            >
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1
                      ${activeTab === tab.id 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                      }
                    `}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-600 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative flex items-center space-x-2">
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Predictions List */}
            <div className="space-y-6">
              {filteredPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <PredictionCard prediction={prediction} />
                </motion.div>
              ))}

              {filteredPredictions.length === 0 && (
                <div className="text-center py-12">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No predictions in this category yet</p>
                  <p className="text-gray-500 text-sm">Start making predictions to see them here!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Prediction Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* <PredictionStats /> */}
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* <LeaderboardWidget /> */}
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Prediction Tips
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400">💡</span>
                  <p className="text-gray-300">Higher confidence = higher rewards but more risk</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400">📊</span>
                  <p className="text-gray-300">Use AI assistant for market analysis</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-400">🔥</span>
                  <p className="text-gray-300">Maintain streaks for bonus multipliers</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-400">⏰</span>
                  <p className="text-gray-300">Shorter timeframes = faster rewards</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
