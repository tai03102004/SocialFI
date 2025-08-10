'use client'

import { motion } from 'framer-motion'
import { 
  PhotoIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  StarIcon,
  FireIcon,
  GiftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export function NFTStats() {
  const stats = {
    totalNFTs: 18,
    totalValue: '12.4 ETH',
    totalValueUSD: '$21,080',
    rarityBreakdown: {
      legendary: 2,
      epic: 5,
      rare: 8,
      common: 3
    },
    chainDistribution: {
      zetachain: 7,
      ethereum: 4,
      polygon: 4,
      bsc: 3
    },
    monthlyMints: 8,
    totalRewards: 2847
  }

  const rarityData = [
    { name: 'Legendary', count: stats.rarityBreakdown.legendary, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { name: 'Epic', count: stats.rarityBreakdown.epic, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { name: 'Rare', count: stats.rarityBreakdown.rare, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { name: 'Common', count: stats.rarityBreakdown.common, color: 'text-gray-400', bg: 'bg-gray-500/20' }
  ]

  const chainData = [
    { name: 'ZetaChain', count: stats.chainDistribution.zetachain, color: 'text-primary-400', emoji: '⚡' },
    { name: 'Ethereum', count: stats.chainDistribution.ethereum, color: 'text-blue-400', emoji: '🔷' },
    { name: 'Polygon', count: stats.chainDistribution.polygon, color: 'text-purple-400', emoji: '🟣' },
    { name: 'BSC', count: stats.chainDistribution.bsc, color: 'text-yellow-400', emoji: '🟡' }
  ]

  const achievements = [
    { title: 'First NFT Minted', date: '2 months ago', icon: '🎉' },
    { title: 'Legendary Collector', date: '1 month ago', icon: '🏆' },
    { title: 'Cross-Chain Master', date: '2 weeks ago', icon: '🌉' },
    { title: 'Trading Expert', date: '1 week ago', icon: '📊' }
  ]

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <PhotoIcon className="h-5 w-5 mr-2 text-primary-400" />
        NFT Portfolio
      </h3>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <PhotoIcon className="h-4 w-4 text-primary-400" />
            <span className="text-sm text-gray-400">Total NFTs</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalNFTs}</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Total Value</span>
          </div>
          <p className="text-xl font-bold text-green-400">{stats.totalValue}</p>
          <p className="text-xs text-gray-500">{stats.totalValueUSD}</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">This Month</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats.monthlyMints}</p>
          <p className="text-xs text-gray-400">New mints</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <GiftIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Rewards</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.totalRewards.toLocaleString()}</p>
          <p className="text-xs text-gray-400">GUI earned</p>
        </div>
      </div>

      {/* Rarity Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
          <StarIcon className="h-4 w-4 mr-2 text-yellow-400" />
          By Rarity
        </h4>
        <div className="space-y-3">
          {rarityData.map((rarity, index) => (
            <motion.div
              key={rarity.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${rarity.bg}`}></div>
                <span className={`text-sm font-medium ${rarity.color}`}>
                  {rarity.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white font-semibold">{rarity.count}</span>
                <div className="w-16 bg-dark-600 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${rarity.bg.replace('/20', '/60')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(rarity.count / stats.totalNFTs) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chain Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
          <ChartBarIcon className="h-4 w-4 mr-2 text-blue-400" />
          By Blockchain
        </h4>
        <div className="space-y-3">
          {chainData.map((chain, index) => (
            <motion.div
              key={chain.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-dark-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{chain.emoji}</span>
                <span className={`text-sm font-medium ${chain.color}`}>
                  {chain.name}
                </span>
              </div>
              <span className="text-sm text-white font-semibold">{chain.count}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center">
          <TrophyIcon className="h-4 w-4 mr-2 text-yellow-400" />
          Milestones
        </h4>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 bg-dark-700/30 rounded-lg"
            >
              <span className="text-lg">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-400">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-lg p-4">
        <h4 className="text-sm font-medium text-primary-300 mb-3">Portfolio Performance</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-400">Avg. Mint Value</p>
            <p className="text-white font-semibold">0.69 ETH</p>
          </div>
          <div>
            <p className="text-gray-400">Best Performer</p>
            <p className="text-green-400 font-semibold">+340%</p>
          </div>
          <div>
            <p className="text-gray-400">Collection Score</p>
            <p className="text-primary-400 font-semibold">8.7/10</p>
          </div>
          <div>
            <p className="text-gray-400">Rarity Score</p>
            <p className="text-yellow-400 font-semibold">247</p>
          </div>
        </div>
      </div>
    </div>
  )
}
