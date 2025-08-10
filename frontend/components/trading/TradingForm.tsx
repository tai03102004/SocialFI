'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface TradingFormProps {
  pair: string
}

export function TradingForm({ pair }: TradingFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState('45240')
  const [amount, setAmount] = useState('')
  const [total, setTotal] = useState('')

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2))
    }
  }

  const handleTotalChange = (value: string) => {
    setTotal(value)
    if (value && price) {
      setAmount((parseFloat(value) / parseFloat(price)).toFixed(6))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`${side.toUpperCase()} order placed successfully!`)
      
      // Reset form
      setAmount('')
      setTotal('')
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Place Order</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type */}
        <div className="flex space-x-1 bg-dark-700/50 p-1 rounded-lg">
          {['limit', 'market'].map((type) => (
            <motion.button
              key={type}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOrderType(type as 'market' | 'limit')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded transition-all ${
                orderType === type
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex space-x-1 bg-dark-700/50 p-1 rounded-lg">
          {['buy', 'sell'].map((s) => (
            <motion.button
              key={s}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSide(s as 'buy' | 'sell')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded transition-all ${
                side === s
                  ? s === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Price Input (for limit orders) */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (USDT)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full input-field"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (BTC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full input-field"
            placeholder="0.00000000"
            step="0.00000001"
          />
        </div>

        {/* Total Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total (USDT)
          </label>
          <input
            type="number"
            value={total}
            onChange={(e) => handleTotalChange(e.target.value)}
            className="w-full input-field"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['25%', '50%', '75%', '100%'].map((percent) => (
            <motion.button
              key={percent}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-3 text-xs bg-dark-700 text-gray-300 rounded hover:bg-dark-600 hover:text-white transition-colors"
            >
              {percent}
            </motion.button>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {pair}
        </motion.button>
      </form>
    </div>
  )
}
