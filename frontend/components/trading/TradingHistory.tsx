'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { useGameFi } from '../../hooks/useEnhancedContract'

interface Trade {
  id: string
  pair: string
  side: 'buy' | 'sell'
  amount: number
  price: number
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  pnl?: number
}

export function TradingHistory() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(false)

  const { getPlayerStats } = useGameFi()

  // Mock trading history - in production, fetch from smart contract events
  const mockTrades: Trade[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      side: 'buy',
      amount: 0.001,
      price: 45240,
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000),
      pnl: 15.2
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      side: 'sell',
      amount: 0.5,
      price: 2840,
      status: 'completed',
      timestamp: new Date(Date.now() - 7200000),
      pnl: -8.5
    },
    {
      id: '3',
      pair: 'BNB/USDT',
      side: 'buy',
      amount: 2.0,
      price: 245,
      status: 'pending',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]

  useEffect(() => {
    setTrades(mockTrades)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-400" />
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <ClockIcon className="h-5 w-5 mr-2 text-primary-400" />
        Recent Trades
      </h3>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-dark-700/30 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : trades.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {trades.map((trade, index) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-dark-700/30 rounded-lg hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(trade.status)}
                  <span className="text-sm font-medium text-white">{trade.pair}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    trade.side === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {trade.side.toUpperCase()}
                  </span>
                </div>
                
                {trade.pnl && (
                  <div className={`flex items-center space-x-1 ${
                    trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.pnl >= 0 ? (
                      <ArrowTrendingUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                <div>
                  <p>Amount</p>
                  <p className="text-white font-medium">{trade.amount}</p>
                </div>
                <div>
                  <p>Price</p>
                  <p className="text-white font-medium">${trade.price.toLocaleString()}</p>
                </div>
                <div>
                  <p>Time</p>
                  <p className="text-white font-medium">
                    {trade.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-dark-600">
                <p className="text-xs text-gray-400">
                  Total: ${(trade.amount * trade.price).toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No trading history yet</p>
          <p className="text-gray-500 text-sm">Your trades will appear here</p>
        </div>
      )}
    </motion.div>
  )
}