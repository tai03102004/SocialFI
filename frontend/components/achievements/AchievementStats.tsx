'use client'

import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  StarIcon, 
  GiftIcon, 
  ChartBarIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface AchievementStatsProps {
  stats: {
    total: number
    unlocked: number
    totalRewards: number
  }
}

export function AchievementStats({ stats }: AchievementStatsProps) {
  const completionRate = Math.round((stats.unlocked / stats.total) * 100)

  const rarityBreakdown = [
    { rarity: 'Common', count: 12, color: 'text-gray-400' },
    { rarity: 'Rare', count: 8, color: 'text-blue-400' },
    { rarity: 'Epic', count: 5, color: 'text-purple-400' },
    { rarity: 'Legendary', count: 2, color: 'text-yellow-400' }
  ]

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
        Achievement Progress
      </h3>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.unlocked}/{stats.total}
              </p>
            </div>
            <TrophyIcon className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Rewards</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.totalRewards.toLocaleString()}
              </p>
            </div>
            <GiftIcon className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-sm font-bold text-white">{completionRate}%</span>
        </div>
        
        <div className="w-full bg-dark-600 rounded-full h-3">
          <motion.div
            className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end pr-2"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {completionRate > 20 && (
              <SparklesIcon className="h-3 w-3 text-white" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Rarity Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-center">
          <StarIcon className="h-4 w-4 mr-2 text-primary-400" />
          By Rarity
        </h4>
        
        <div className="space-y-2">
          {rarityBreakdown.map((item, index) => (
            <motion.div
              key={item.rarity}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 bg-dark-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.rarity === 'Common' ? 'bg-gray-400' :
                  item.rarity === 'Rare' ? 'bg-blue-400' :
                  item.rarity === 'Epic' ? 'bg-purple-400' :
                  'bg-yellow-400'
                }`} />
                <span className={`text-sm font-medium ${item.color}`}>
                  {item.rarity}
                </span>
              </div>
              <span className="text-sm text-white font-semibold">
                {item.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Streak */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FireIcon className="h-5 w-5 text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Achievement Streak</span>
          </div>
          <span className="text-lg font-bold text-orange-400">7 days</span>
        </div>
        <p className="text-xs text-orange-200 mt-2">
          Keep unlocking achievements to maintain your streak!
        </p>
      </div>

      {/* Next Milestone */}
      <div className="mt-4 p-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <ChartBarIcon className="h-4 w-4 text-primary-400" />
          <span className="text-sm font-medium text-primary-300">Next Milestone</span>
        </div>
        <p className="text-xs text-primary-200">
          Unlock 3 more achievements to reach the "Collector" badge and earn 250 bonus GUI!
        </p>
      </div>
    </div>
  )
}
