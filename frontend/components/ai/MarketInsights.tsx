'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface MarketInsight {
  sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  recommendation: string
  keyFactors: string[]
  predictedPriceRange: {
    asset: string
    low: number
    high: number
    timeframe: string
  }
  riskLevel: 'low' | 'medium' | 'high'
}

export function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/market-insight`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch market insights:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
    // Refresh every 5 minutes
    const interval = setInterval(fetchInsights, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      default: return 'text-red-400'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    return sentiment === 'bullish' ? ArrowTrendingUpIcon : 
           sentiment === 'bearish' ? ArrowTrendingDownIcon : 
           ExclamationTriangleIcon
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ChartBarIcon className="h-5 w-5 mr-2 text-primary-400" />
          Market Insights
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchInsights}
          disabled={loading}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Refresh'}
        </motion.button>
      </div>

      {loading && !insights ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary-400/20 border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Analyzing market...</p>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          {/* Sentiment */}
          <div className="flex items-center justify-between p-4 bg-dark-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              {(() => {
                const SentimentIcon = getSentimentIcon(insights.sentiment)
                return <SentimentIcon className={`h-6 w-6 ${getSentimentColor(insights.sentiment)}`} />
              })()}
              <div>
                <p className="text-sm text-gray-400">Market Sentiment</p>
                <p className={`font-semibold capitalize ${getSentimentColor(insights.sentiment)}`}>
                  {insights.sentiment}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Confidence</p>
              <p className="font-semibold text-white">{insights.confidence}%</p>
            </div>
          </div>

          {/* Price Range Prediction */}
          <div className="p-4 bg-dark-700/30 rounded-lg">
            <h4 className="font-medium text-white mb-3">Price Prediction</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{insights.predictedPriceRange.asset}</span>
                <span className="text-sm text-gray-400">{insights.predictedPriceRange.timeframe}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">
                  ${insights.predictedPriceRange.low.toLocaleString()} - ${insights.predictedPriceRange.high.toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${getRiskColor(insights.riskLevel)}`}>
                  {insights.riskLevel.toUpperCase()} RISK
                </span>
              </div>
            </div>
          </div>

          {/* Key Factors */}
          <div>
            <h4 className="font-medium text-white mb-3">Key Factors</h4>
            <div className="space-y-2">
              {insights.keyFactors.slice(0, 3).map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 mt-2"></div>
                  <span className="text-gray-300">{factor}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="font-medium text-blue-300 mb-2 flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              AI Recommendation
            </h4>
            <p className="text-sm text-blue-200 leading-relaxed">
              {insights.recommendation}
            </p>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <ClockIcon className="h-3 w-3" />
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">Failed to load market insights</p>
          <button 
            onClick={fetchInsights}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium mt-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
