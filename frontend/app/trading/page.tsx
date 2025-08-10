'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,  
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { MarketOverview } from '../../components/trading/MarketOverview'
import { TradingChart } from '../../components/trading/TradingChart'
import { OrderBook } from '../../components/trading/OrderBook'
import { TradingForm } from '../../components/trading/TradingForm'

export default function TradingPage() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')

  const tradingPairs = [
    { symbol: 'BTC/USDT', price: 45240, change: 2.34 },
    { symbol: 'ETH/USDT', price: 2840, change: -1.23 },
    { symbol: 'BNB/USDT', price: 245, change: 3.45 },
    { symbol: 'ADA/USDT', price: 0.48, change: 5.67 },
    { symbol: 'SOL/USDT', price: 98.5, change: -2.1 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white"
            >
              <span className="text-gradient">Trading Terminal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mt-2"
            >
              Cross-chain trading powered by ZetaChain
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Markets Open</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <MarketOverview />
        </motion.div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel - Pairs & Portfolio */}
          <div className="xl:col-span-3 space-y-6">
            {/* Trading Pairs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-400" />
                Markets
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tradingPairs.map((pair) => (
                  <motion.button
                    key={pair.symbol}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedPair(pair.symbol)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedPair === pair.symbol
                        ? 'bg-primary-600/20 border border-primary-500/50'
                        : 'hover:bg-dark-700/50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{pair.symbol}</p>
                      <p className="text-xs text-gray-400">${pair.price.toLocaleString()}</p>
                    </div>
                    
                    <div className={`flex items-center space-x-1 ${
                      pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.change >= 0 ? (
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {pair.change >= 0 ? '+' : ''}{pair.change}%
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* <PortfolioWidget /> */}
            </motion.div>
          </div>

          {/* Center Panel - Chart & Order Book */}
          <div className="xl:col-span-6 space-y-6">
            {/* Trading Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TradingChart pair={selectedPair} />
            </motion.div>

            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <OrderBook pair={selectedPair} />
            </motion.div>
          </div>

          {/* Right Panel - Trading Form & History */}
          <div className="xl:col-span-3 space-y-6">
            {/* Trading Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TradingForm pair={selectedPair} />
            </motion.div>

            {/* Trading History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {/* <TradingHistory /> */}
            </motion.div>

            {/* Trading Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
            >
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                Trading Tips
              </h4>
              
              <div className="space-y-2 text-sm text-blue-200">
                <p>• Use stop-loss to manage risk</p>
                <p>• Cross-chain trades via ZetaChain</p>
                <p>• Earn rewards for successful trades</p>
                <p>• Connect with AI for market insights</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
