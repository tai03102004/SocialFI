'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,  
  TrophyIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { PredictionCard } from '../../components/predictions/PredictionCard'
import { CreatePrediction } from '../../components/predictions/CreatePrediction'
import { PredictionStats } from '../../components/predictions/PredictionStats'
import { LeaderboardWidget } from '../../components/predictions/LeaderboardWidget'
import { useGameFi, useAIOracle, formatPrice, formatTimeAgo } from '../../hooks/useEnhancedContract'
import { useAccount } from 'wagmi'

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
  player: string
  aiPredictedPrice: number
  aiConfidence: number
  timestamp: bigint
  resolved: boolean
  playerCorrect: boolean
  aiCorrect: boolean
}

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { makeAIPrediction, getPlayerStats } = useGameFi()
  const { getAllAIData } = useAIOracle()
  const { address, isConnected } = useAccount()

  const tabs = [
    { id: 'active', label: 'Active', icon: '🟢' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'all', label: 'All History', icon: '📊' }
  ]

  // ✅ Load predictions from blockchain
  const loadPredictions = async () => {
    if (!isConnected || !address) return

    try {
      setLoading(true)
      setError(null)

      // Get player stats to get prediction count
      const stats = await getPlayerStats()
      if (!stats) return

      const totalPredictions = Number(stats.totalPredictions)
      console.log('Total predictions:', totalPredictions)

      // For now, use mock data since we need to implement getPrediction function
      // In production, you would loop through prediction IDs and fetch each one
      const mockPredictions: Prediction[] = [
        {
          id: 1,
          asset: 'BTC',
          currentPrice: 45240,
          predictedPrice: 47000,
          confidence: 85,
          timeFrame: '24h',
          status: 'pending',
          createdAt: '2 hours ago',
          potentialReward: 45,
          player: address,
          aiPredictedPrice: 46500,
          aiConfidence: 78,
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
          resolved: false,
          playerCorrect: false,
          aiCorrect: false
        },
        {
          id: 2,
          asset: 'ETH',
          currentPrice: 2840,
          predictedPrice: 2950,
          confidence: 72,
          timeFrame: '12h',
          status: 'correct',
          createdAt: '1 day ago',
          potentialReward: 32,
          actualPrice: 2960,
          player: address,
          aiPredictedPrice: 2920,
          aiConfidence: 65,
          timestamp: BigInt(Math.floor(Date.now() / 1000) - 86400),
          resolved: true,
          playerCorrect: true,
          aiCorrect: true
        }
      ]

      setPredictions(mockPredictions)
    } catch (error) {
      console.error('Failed to load predictions:', error)
      setError('Failed to load predictions')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Create new prediction
  const handleCreatePrediction = async (data: {
    asset: string
    predictedPrice: string
    confidence: number
    timeFrame: string
  }) => {
    if (!isConnected) {
      throw new Error('Please connect your wallet')
    }

    try {
      setLoading(true)

      // Get AI data for comparison
      const aiData = await getAllAIData(data.asset)
      console.log('AI Data:', aiData)

      // Make prediction on blockchain
      const tx = await makeAIPrediction(
        data.predictedPrice,
        data.asset,
        data.confidence
      )

      console.log('Prediction transaction:', tx)

      // Create prediction object for UI
      const newPrediction: Prediction = {
        id: Date.now(),
        asset: data.asset,
        currentPrice: aiData?.market ? Number(aiData.market.currentPrice) / 100 : 0,
        predictedPrice: parseFloat(data.predictedPrice),
        confidence: data.confidence,
        timeFrame: data.timeFrame,
        status: 'pending',
        createdAt: 'Just now',
        potentialReward: Math.floor(data.confidence * 0.5),
        player: address!,
        aiPredictedPrice: aiData?.market ? Number(aiData.market.predictedPrice) / 100 : 0,
        aiConfidence: aiData?.market ? Number(aiData.market.confidence) : 0,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        resolved: false,
        playerCorrect: false,
        aiCorrect: false
      }

      setPredictions(prev => [newPrediction, ...prev])
      setShowCreateForm(false)

      // Refresh predictions from blockchain
      await loadPredictions()
    } catch (error) {
      console.error('Failed to create prediction:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected) {
      loadPredictions()
    }
  }, [isConnected, address])

  const filteredPredictions = predictions.filter(p => {
    if (activeTab === 'active') return p.status === 'pending'
    if (activeTab === 'completed') return p.status !== 'pending'
    return true
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your wallet to start making predictions and earn rewards</p>
          </div>
        </div>
      </div>
    )
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

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center space-x-4 mt-6"
          >
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Prediction</span>
            </button>
            
            <button
              onClick={loadPredictions}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </motion.div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Create Prediction Modal */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <div className="bg-dark-800 border border-dark-600 rounded-xl p-6 max-w-md w-full">
                  <CreatePrediction 
                    onCreatePrediction={handleCreatePrediction}
                    onCancel={() => setShowCreateForm(false)}
                    loading={loading}
                  />
                </div>
              </motion.div>
            )}

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
                      <span className="text-xs opacity-75">
                        ({filteredPredictions.length})
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Predictions List */}
            <div className="space-y-6">
              {loading && predictions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  <p className="text-gray-400 mt-4">Loading predictions from blockchain...</p>
                </div>
              ) : filteredPredictions.length > 0 ? (
                filteredPredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <PredictionCard prediction={prediction} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    {activeTab === 'active' ? 'No active predictions' : 
                     activeTab === 'completed' ? 'No completed predictions' : 
                     'No predictions yet'}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {activeTab === 'active' ? 'Create your first prediction to get started!' :
                     'Start making predictions to see them here!'}
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    Create Prediction
                  </button>
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
              <PredictionStats predictions={predictions} />
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <LeaderboardWidget />
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
                <div className="flex items-start space-x-2">
                  <span className="text-yellow-400">🤖</span>
                  <p className="text-gray-300">Compare your predictions with AI insights</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}