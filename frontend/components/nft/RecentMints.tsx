'use client'

import { motion } from 'framer-motion'
import { SparklesIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'

const recentMints = [
  {
    id: 1,
    name: 'Prediction Master #247',
    type: 'Achievement NFT',
    chain: 'ZetaChain',
    rarity: 'Epic',
    mintedAt: '2 min ago',
    trigger: '10 correct predictions in a row',
    value: '0.8 ETH'
  },
  {
    id: 2,
    name: 'Social Butterfly Badge',
    type: 'Social NFT',
    chain: 'Polygon',
    rarity: 'Rare',
    mintedAt: '15 min ago',
    trigger: '100 likes received',
    value: '0.3 ETH'
  },
  {
    id: 3,
    name: 'Quiz Genius Trophy',
    type: 'Knowledge NFT',
    chain: 'Ethereum',
    rarity: 'Legendary',
    mintedAt: '1 hour ago',
    trigger: 'Perfect quiz streak (7 days)',
    value: '2.1 ETH'
  },
  {
    id: 4,
    name: 'Trading Sensei Card',
    type: 'Trading NFT',
    chain: 'BSC',
    rarity: 'Epic',
    mintedAt: '2 hours ago',
    trigger: '50 successful trades',
    value: '1.2 ETH'
  },
  {
    id: 5,
    name: 'Community Leader Pin',
    type: 'Social NFT',
    chain: 'ZetaChain',
    rarity: 'Rare',
    mintedAt: '4 hours ago',
    trigger: 'Helped 25 new users',
    value: '0.6 ETH'
  }
]

export function RecentMints() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Epic': return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'Rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ZetaChain': return 'bg-primary-500/20 text-primary-300'
      case 'Ethereum': return 'bg-blue-500/20 text-blue-300'
      case 'Polygon': return 'bg-purple-500/20 text-purple-300'
      case 'BSC': return 'bg-yellow-500/20 text-yellow-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Achievement NFT': return '🏆'
      case 'Social NFT': return '👥'
      case 'Knowledge NFT': return '🧠'
      case 'Trading NFT': return '📊'
      default: return '✨'
    }
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-green-400" />
          Recent Auto-Mints
        </h3>
        <div className="flex items-center space-x-2 bg-green-500/20 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentMints.map((mint, index) => (
          <motion.div
            key={mint.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="bg-dark-700/30 border border-dark-600 rounded-lg p-4 hover:border-primary-500/50 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-lg flex items-center justify-center text-lg">
                  {getTypeIcon(mint.type)}
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{mint.name}</h4>
                  <p className="text-xs text-gray-400">{mint.type}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <ClockIcon className="h-3 w-3" />
                  <span>{mint.mintedAt}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getChainColor(mint.chain)}`}>
                  {mint.chain}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(mint.rarity)}`}>
                  {mint.rarity}
                </span>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Trigger:</strong> {mint.trigger}
              </p>
            </div>

            {/* Value */}
            <div className="flex items-center justify-between pt-3 border-t border-dark-600">
              <div className="text-xs text-gray-400">
                Estimated Value
              </div>
              <div className="text-sm font-semibold text-green-400">
                {mint.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Stats */}
      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-purple-400">47</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-400">312</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">1,289</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
        </div>
      </div>

      {/* Auto-Mint Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
          <TrophyIcon className="h-4 w-4 mr-1" />
          How Auto-Minting Works
        </h4>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• Complete milestones to trigger automatic NFT minting</li>
          <li>• NFTs are minted cross-chain via ZetaChain smart contracts</li>
          <li>• Each NFT contains your achievement data and stats</li>
          <li>• Rarity determined by difficulty and achievement type</li>
        </ul>
      </div>
    </div>
  )
}
