'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface TradingPair {
  symbol: string
  price: number
  change: number
  volume: string
  confidence?: number
  outlook?: string
}

interface MarketOverviewProps {
  tradingPairs: TradingPair[]
  onPairSelect: (pair: string) => void
  loading?: boolean
}

export function MarketOverview({ tradingPairs, onPairSelect, loading }: MarketOverviewProps) {
  if (loading && tradingPairs.length === 0) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-dark-600 rounded mb-2"></div>
              <div className="h-6 bg-dark-600 rounded mb-2"></div>
              <div className="h-3 bg-dark-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const displayPairs = tradingPairs.length > 0 ? tradingPairs : [
    { symbol: 'BTC/USDT', price: 45240, change: 2.34, volume: '28.5B' },
    { symbol: 'ETH/USDT', price: 2840, change: -1.23, volume: '15.2B' },
    { symbol: 'BNB/USDT', price: 245, change: 3.45, volume: '2.8B' },
    { symbol: 'ADA/USDT', price: 0.48, change: 5.67, volume: '1.2B' },
    { symbol: 'SOL/USDT', price: 98.5, change: -2.1, volume: '800M' }
  ]

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Market Overview</h3>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-purple-300">AI Enhanced</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayPairs.map((pair, index) => (
          <motion.div
            key={pair.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onPairSelect(pair.symbol)}
            className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 hover:bg-dark-600/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                  {pair.symbol.replace('/USDT', '')}
                </h4>
                <p className="text-xs text-gray-400">{pair.symbol.split('/')[1]}</p>
              </div>
              <div className={`flex items-center ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pair.change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(pair.change).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-bold text-white">${pair.price.toLocaleString()}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Vol: {pair.volume}</p>
                {pair.confidence && (
                  <div className="flex items-center space-x-1">
                    <SparklesIcon className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-purple-300">{pair.confidence}%</span>
                  </div>
                )}
              </div>
              
              {pair.outlook && (
                <div className="pt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pair.outlook === 'BULLISH' ? 'bg-green-500/20 text-green-300' :
                    pair.outlook === 'BEARISH' ? 'bg-red-500/20 text-red-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    AI: {pair.outlook}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}