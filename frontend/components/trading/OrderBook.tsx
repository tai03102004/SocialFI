'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface OrderBookProps {
  pair: string
}

// Mock order book data
const sellOrders = [
  { price: 45280, amount: 0.245, total: 11.09 },
  { price: 45270, amount: 0.156, total: 7.06 },
  { price: 45260, amount: 0.892, total: 40.37 },
  { price: 45250, amount: 0.334, total: 15.11 },
  { price: 45240, amount: 0.678, total: 30.67 },
]

const buyOrders = [
  { price: 45230, amount: 0.445, total: 20.13 },
  { price: 45220, amount: 0.823, total: 37.23 },
  { price: 45210, amount: 0.234, total: 10.58 },
  { price: 45200, amount: 0.567, total: 25.63 },
  { price: 45190, amount: 0.789, total: 35.66 },
]

export function OrderBook({ pair }: OrderBookProps) {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Order Book</h3>

      <div className="space-y-4">
        {/* Sell Orders */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Sell Orders</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 pb-2">
              <span>Price (USDT)</span>
              <span className="text-right">Amount (BTC)</span>
              <span className="text-right">Total (USDT)</span>
            </div>
            
            {sellOrders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-red-400 font-medium">{order.price.toLocaleString()}</span>
                <span className="text-white text-right">{order.amount.toFixed(3)}</span>
                <span className="text-gray-300 text-right">{order.total.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="py-3 border-y border-dark-600">
          <div className="text-center">
            <p className="text-lg font-bold text-white">$45,235</p>
            <p className="text-xs text-gray-400">Spread: $10 (0.02%)</p>
          </div>
        </div>

        {/* Buy Orders */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">Buy Orders</span>
            </div>
          </div>
          
          <div className="space-y-1">
            {buyOrders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-3 gap-2 text-xs py-1 hover:bg-green-500/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-green-400 font-medium">{order.price.toLocaleString()}</span>
                <span className="text-white text-right">{order.amount.toFixed(3)}</span>
                <span className="text-gray-300 text-right">{order.total.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
