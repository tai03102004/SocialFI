'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useAIOracle } from '../../hooks/useEnhancedContract'

interface CreatePredictionProps {
  onCreatePrediction: (data: {
    asset: string
    predictedPrice: string
    confidence: number
    timeFrame: string
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CreatePrediction({ onCreatePrediction, onCancel, loading }: CreatePredictionProps) {
  const [formData, setFormData] = useState({
    asset: 'BTC',
    predictedPrice: '',
    confidence: 50,
    timeFrame: '24h'
  })
  const [aiData, setAiData] = useState<any>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const { getAllAIData } = useAIOracle()

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'BNB' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'SOL', name: 'Solana' }
  ]

  const timeFrames = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' }
  ]

  const handleGetAIInsight = async () => {
    try {
      setLoadingAI(true)
      const data = await getAllAIData(formData.asset)
      setAiData(data)
      
      if (data?.market) {
        const aiPrice = Number(data.market.predictedPrice) / 100
        setFormData(prev => ({ ...prev, predictedPrice: aiPrice.toString() }))
      }
    } catch (error) {
      console.error('Failed to get AI data:', error)
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.predictedPrice || formData.confidence < 1 || formData.confidence > 100) {
      return
    }

    try {
      await onCreatePrediction(formData)
    } catch (error) {
      console.error('Failed to create prediction:', error)
    }
  }

  const currentPrice = aiData?.market ? Number(aiData.market.currentPrice) / 100 : null
  const predictedPrice = parseFloat(formData.predictedPrice)
  const priceChange = currentPrice && predictedPrice ? 
    ((predictedPrice - currentPrice) / currentPrice) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Create Prediction</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Asset Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Asset
          </label>
          <select
            value={formData.asset}
            onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {assets.map(asset => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </div>

        {/* AI Insight Button */}
        <div>
          <button
            type="button"
            onClick={handleGetAIInsight}
            disabled={loadingAI}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-all disabled:opacity-50"
          >
            <SparklesIcon className={`h-5 w-5 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? 'Getting AI Insight...' : 'Get AI Insight'}</span>
          </button>
        </div>

        {/* AI Data Display */}
        {aiData?.market && (
          <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-2 text-primary-400" />
              AI Analysis for {formData.asset}
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Current Price</p>
                <p className="text-white font-semibold">
                  ${(Number(aiData.market.currentPrice) / 100).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">AI Prediction</p>
                <p className="text-primary-400 font-semibold">
                  ${(Number(aiData.market.predictedPrice) / 100).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">AI Confidence</p>
                <p className="text-white font-semibold">{Number(aiData.market.confidence)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Outlook</p>
                <p className={`font-semibold ${
                  aiData.market.outlook === 'BULLISH' ? 'text-green-400' : 
                  aiData.market.outlook === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {aiData.market.outlook}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Price Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Predicted Price (USD)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.predictedPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, predictedPrice: e.target.value }))}
            placeholder="Enter your price prediction"
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          
          {currentPrice && predictedPrice && (
            <p className={`text-sm mt-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% vs current price
            </p>
          )}
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confidence: {formData.confidence}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={formData.confidence}
            onChange={(e) => setFormData(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
            className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* Time Frame */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Time Frame
          </label>
          <select
            value={formData.timeFrame}
            onChange={(e) => setFormData(prev => ({ ...prev, timeFrame: e.target.value }))}
            className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {timeFrames.map(tf => (
              <option key={tf.value} value={tf.value}>
                {tf.label}
              </option>
            ))}
          </select>
        </div>

        {/* Potential Reward */}
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Potential Reward</span>
            <span className="text-lg font-semibold text-primary-400">
              {Math.floor(formData.confidence * 0.5)} GUI
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Based on {formData.confidence}% confidence level
          </p>
        </div>

        {/* Submit */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-dark-600 hover:bg-dark-500 rounded-lg text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.predictedPrice}
            className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Prediction'}
          </button>
        </div>
      </form>
    </div>
  )
}