'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, UserIcon } from '@heroicons/react/24/outline'

interface LeaderboardEntry {
  rank: number
  address: string
  accuracy: number
  predictions: number
  score: number
}

export function LeaderboardWidget() {
  // Mock data - in production, fetch from smart contract
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, address: '0x1234...5678', accuracy: 89, predictions: 45, score: 1250 },
    { rank: 2, address: '0x2345...6789', accuracy: 85, predictions: 38, score: 1180 },
    { rank: 3, address: '0x3456...7890', accuracy: 82, predictions: 42, score: 1150 },
    { rank: 4, address: '0x4567...8901', accuracy: 78, predictions: 35, score: 1020 },
    { rank: 5, address: '0x5678...9012', accuracy: 75, predictions: 28, score: 980 }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
        Top Predictors
      </h3>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-dark-700/30 rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-white w-8">
                {getRankIcon(entry.rank)}
              </span>
              
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300 font-mono">
                  {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-white">{entry.accuracy}%</p>
              <p className="text-xs text-gray-400">{entry.score} pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dark-600 text-center">
        <p className="text-xs text-gray-400">
          Make accurate predictions to climb the leaderboard!
        </p>
      </div>
    </motion.div>
  )
}