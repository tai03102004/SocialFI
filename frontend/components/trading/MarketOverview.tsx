'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

const marketData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 45240, change: 2.34, volume: '28.5B' },
  { symbol: 'ETH', name: 'Ethereum', price: 2840, change: -1.23, volume: '15.2B' },
  { symbol: 'BNB', name: 'BNB', price: 245, change: 3.45, volume: '2.8B' },
  { symbol: 'ADA', name: 'Cardano', price: 0.48, change: 5.67, volume: '1.2B' },
  { symbol: 'SOL', name: 'Solana', price: 98.5, change: -2.1, volume: '800M' }
]

export function MarketOverview() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Market Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {marketData.map((coin, index) => (
          <motion.div
            key={coin.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 hover:bg-dark-600/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-white">{coin.symbol}</h4>
                <p className="text-xs text-gray-400">{coin.name}</p>
              </div>
              <div className={`flex items-center ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.change >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(coin.change)}%</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-bold text-white">${coin.price.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Vol: {coin.volume}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
