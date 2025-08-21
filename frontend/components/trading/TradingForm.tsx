'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useTokenBalance } from '../../hooks/useEnhancedContract'
import toast from 'react-hot-toast'

interface TradingFormProps {
  pair: string
  marketData?: any
  onTrade: (data: {
    pair: string
    side: 'buy' | 'sell'
    amount: string
    price?: string
    orderType: 'market' | 'limit'
  }) => Promise<void>
  loading?: boolean
}

export function TradingForm({ pair, marketData, onTrade, loading }: TradingFormProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [total, setTotal] = useState('')

  const { balance: guiBalance } = useTokenBalance()

  // Update price when market data changes
  useEffect(() => {
    if (marketData?.market && orderType === 'limit') {
      const currentPrice = Number(marketData.market.currentPrice) / 100
      setPrice(currentPrice.toString())
    }
  }, [marketData, orderType])

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
    
    if (!amount || (orderType === 'limit' && !price)) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    try {
      await onTrade({
        pair,
        side,
        amount,
        price: orderType === 'limit' ? price : undefined,
        orderType
      })
      
      // Reset form
      setAmount('')
      setTotal('')
    } catch (error) {
      console.error('Trade error:', error)
    }
  }

  const currentPrice = marketData?.market ? Number(marketData.market.currentPrice) / 100 : 0
  const aiPrice = marketData?.market ? Number(marketData.market.predictedPrice) / 100 : 0
  const aiConfidence = marketData?.market ? Number(marketData.market.confidence) : 0

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Place Order</h3>

      {/* AI Insight Banner */}
      {marketData?.market && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <SparklesIcon className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">AI Market Insight</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Price:</span>
              <span className="text-white">${currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">AI Prediction:</span>
              <span className="text-primary-400">${aiPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span className="text-white">{aiConfidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Outlook:</span>
              <span className={`${
                marketData.market.outlook === 'BULLISH' ? 'text-green-400' :
                marketData.market.outlook === 'BEARISH' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {marketData.market.outlook}
              </span>
            </div>
          </div>
        </div>
      )}

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
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full input-field pr-16"
                placeholder="0.00"
                step="0.01"
              />
              {aiPrice && Math.abs(parseFloat(price) - aiPrice) / aiPrice > 0.05 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" title="Price differs significantly from AI prediction" />
                </div>
              )}
            </div>
            
            {aiPrice && (
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-400">AI suggests: ${aiPrice.toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => setPrice(aiPrice.toString())}
                  className="text-primary-400 hover:text-primary-300"
                >
                  Use AI Price
                </button>
              </div>
            )}
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount ({pair.split('/')[0]})
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
              onClick={() => {
                // Calculate based on available balance
                const maxAmount = side === 'buy' ? 
                  (guiBalance ? Number(guiBalance) / (parseFloat(price) || 1) : 0) :
                  0 // Would need to get actual token balance
                
                const percentage = parseInt(percent) / 100
                const calculatedAmount = (maxAmount * percentage).toFixed(6)
                handleAmountChange(calculatedAmount)
              }}
              className="py-2 px-3 text-xs bg-dark-700 text-gray-300 rounded hover:bg-dark-600 hover:text-white transition-colors"
            >
              {percent}
            </motion.button>
          ))}
        </div>

        {/* Balance Info */}
        <div className="bg-dark-700/30 rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Available GUI:</span>
            <span className="text-white">{guiBalance ? Number(guiBalance).toLocaleString() : '0'}</span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !amount}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `${side === 'buy' ? 'Buy' : 'Sell'} ${pair.split('/')[0]}`
          )}
        </motion.button>
      </form>

      {/* Trading Warning */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-300">
          ⚠️ This is a demo trading interface. Actual trades will create predictions on the blockchain.
        </p>
      </div>
    </div>
  )
}