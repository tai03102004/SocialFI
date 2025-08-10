'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, SparklesIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Milestone {
  id: number
  name: string
  description: string
  progress: number
  target: number
  reward: string
  chain: string
  rarity: string
}

interface MintingProgressProps {
  milestones: Milestone[]
}

export function MintingProgress({ milestones }: MintingProgressProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-500 to-orange-500'
      case 'Epic': return 'from-purple-500 to-pink-500'
      case 'Rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
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

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
        Auto-Mint Progress
      </h3>

      <div className="space-y-6">
        {milestones.map((milestone, index) => {
          const progressPercent = (milestone.progress / milestone.target) * 100
          const isCompleted = milestone.progress >= milestone.target

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-xl p-6 transition-all duration-300 ${
                isCompleted 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-dark-600 bg-dark-700/30 hover:border-primary-500/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRarityColor(milestone.rarity)} flex items-center justify-center`}>
                      <TrophyIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{milestone.name}</h4>
                      <p className="text-sm text-gray-400">{milestone.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {isCompleted ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  ) : (
                    <ClockIcon className="h-8 w-8 text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{milestone.progress}/{milestone.target}</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${getRarityColor(milestone.rarity)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>

              {/* Reward Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${getChainColor(milestone.chain)}`}>
                    {milestone.chain}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full border ${
                    milestone.rarity === 'Legendary' ? 'border-yellow-500/50 text-yellow-400' :
                    milestone.rarity === 'Epic' ? 'border-purple-500/50 text-purple-400' :
                    milestone.rarity === 'Rare' ? 'border-blue-500/50 text-blue-400' :
                    'border-gray-500/50 text-gray-400'
                  }`}>
                    {milestone.rarity}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{milestone.reward}</p>
                  {isCompleted ? (
                    <p className="text-xs text-green-400">Ready to claim!</p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      {milestone.target - milestone.progress} more to go
                    </p>
                  )}
                </div>
              </div>

              {/* Mint Button */}
              {isCompleted && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-4 py-3 bg-gradient-to-r ${getRarityColor(milestone.rarity)} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Mint NFT Now
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Auto-Mint Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">How Auto-Mint Works</span>
        </div>
        <div className="text-xs text-blue-200 space-y-1">
          <p>• NFTs are automatically minted when you complete milestones</p>
          <p>• Each NFT is unique and reflects your achievement stats</p>
          <p>• Cross-chain compatibility via ZetaChain Universal Smart Contracts</p>
          <p>• Gas fees are automatically deducted from your GUI token balance</p>
        </div>
      </div>
    </div>
  )
}
