'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, StarIcon } from '@heroicons/react/24/outline'

const leaderboard = [
  { rank: 1, username: 'CryptoKing', score: 2847, avatar: '👑' },
  { rank: 2, username: 'GameFiGuru', score: 2634, avatar: '🎮' },
  { rank: 3, username: 'PredictionAce', score: 2521, avatar: '🚀' },
  { rank: 4, username: 'QuizMaster', score: 2398, avatar: '🧠' },
  { rank: 5, username: 'SocialBee', score: 2287, avatar: '🐝' }
]

export function LeaderboardMini() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Top Players
        </h3>
        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              player.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
              player.rank === 2 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/50' :
              player.rank === 3 ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' :
              'bg-dark-600 text-white'
            }`}>
              {player.rank}
            </div>
            
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-lg">
              {player.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{player.username}</p>
              <div className="flex items-center space-x-1">
                <StarIcon className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-gray-400">{player.score} pts</span>
              </div>
            </div>

            {player.rank <= 3 && (
              <div className="text-right">
                <TrophyIcon className={`h-4 w-4 ${
                  player.rank === 1 ? 'text-yellow-400' :
                  player.rank === 2 ? 'text-gray-400' :
                  'text-amber-400'
                }`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-primary-300 mb-1">Your Rank: #247</p>
          <p className="text-xs text-primary-400">Keep playing to climb the leaderboard!</p>
        </div>
      </div>
    </div>
  )
}
