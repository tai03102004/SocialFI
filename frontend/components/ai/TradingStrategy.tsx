'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LightBulbIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export function TradingStrategy() {
  const [strategy, setStrategy] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateStrategy = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerStats: {
            accuracy: 75,
            totalPredictions: 45,
            correctPredictions: 34,
            currentStreak: 3,
            experienceLevel: 'intermediate',
            preferredAsset: 'BTC',
            isPremium: false
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setStrategy(data.strategy)
      } else {
        throw new Error('Failed to generate strategy')
      }
    } catch (error) {
      console.error('Error generating strategy:', error)
      setStrategy('Failed to generate trading strategy. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <LightBulbIcon className="h-5 w-5 mr-2 text-primary-400" />
          Trading Strategy
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateStrategy}
          disabled={loading}
          className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Generating...' : 'Generate'}</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary-400/20 border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Creating personalized strategy...</p>
        </div>
      ) : strategy ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <SparklesIcon className="h-5 w-5 text-green-400" />
              <span className="font-medium text-green-300">Personalized Strategy</span>
            </div>
            
            <div className="text-sm text-green-200 leading-relaxed whitespace-pre-wrap">
              {strategy}
            </div>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationCircleIcon className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p>This is educational content only and not financial advice. Always do your own research and never invest more than you can afford to lose.</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-sm mb-4">Get a personalized trading strategy</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateStrategy}
            className="btn-primary"
          >
            Generate Strategy
          </motion.button>
        </div>
      )}
    </div>
  )
}
