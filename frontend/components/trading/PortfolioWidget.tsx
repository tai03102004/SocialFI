'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  WalletIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { useGameFi, useTokenBalance } from '../../hooks/useEnhancedContract'
import { useAccount } from 'wagmi'

export function PortfolioWidget() {
  const [hideBalances, setHideBalances] = useState(false)
  const [playerStats, setPlayerStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const { getPlayerStats } = useGameFi()
  const { balance: guiBalance } = useTokenBalance()
  const { address } = useAccount()

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const stats = await getPlayerStats()
        setPlayerStats(stats)
      } catch (error) {
        console.error('Failed to load player stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (address) {
      loadStats()
    }
  }, [address, getPlayerStats])

  // Mock portfolio data - in production, get from smart contracts
  const portfolioAssets = [
    { symbol: 'GUI', name: 'GUI Token', balance: guiBalance ? Number(guiBalance) : 0, value: guiBalance ? Number(guiBalance) * 0.1 : 0, change: 5.2 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.00234, value: 105.8, change: 2.1 },
    { symbol: 'ETH', name: 'Ethereum', balance: 0.8456, value: 2401.6, change: -1.4 },
  ]

  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0)
  const totalChange = portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.change / 100), 0)
  const totalChangePercent = totalValue > 0 ? (totalChange / totalValue) * 100 : 0

  if (loading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <WalletIcon className="h-5 w-5 mr-2 text-primary-400" />
          Portfolio
        </h3>
        
        <button
          onClick={() => setHideBalances(!hideBalances)}
          className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
        >
          {hideBalances ? (
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
          ) : (
            <EyeIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Total Portfolio Value */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Total Value</span>
          <div className={`flex items-center space-x-1 ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalChangePercent >= 0 ? (
              <ArrowTrendingUpIcon className="h-3 w-3" />
            ) : (
              <ArrowTrendingDownIcon className="h-3 w-3" />
            )}
            <span className="text-xs">
              {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-bold text-white">
            {hideBalances ? '••••••' : `$${totalValue.toLocaleString()}`}
          </p>
          <span className={`text-sm ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {hideBalances ? '••••' : `${totalChangePercent >= 0 ? '+' : ''}$${Math.abs(totalChange).toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Assets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Assets</h4>
        
        {portfolioAssets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{asset.symbol.slice(0, 2)}</span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-white">{asset.symbol}</p>
                <p className="text-xs text-gray-400">{asset.name}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {hideBalances ? '••••••' : `${asset.balance.toLocaleString()}`}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-400">
                  {hideBalances ? '••••' : `$${asset.value.toFixed(2)}`}
                </p>
                <span className={`text-xs ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trading Stats */}
      {playerStats && (
        <div className="mt-6 pt-4 border-t border-dark-600">
          <h4 className="text-sm font-medium text-gray-400 mb-3">Trading Performance</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{Number(playerStats.accuracy)}%</p>
              <p className="text-xs text-gray-400">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{Number(playerStats.totalPredictions)}</p>
              <p className="text-xs text-gray-400">Trades</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}