'use client'

import { motion } from 'framer-motion'
import { GiftIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline'

const recentRewards = [
  {
    id: 1,
    type: 'prediction',
    title: 'Correct BTC Prediction',
    amount: 75,
    time: '5 min ago',
    icon: SparklesIcon,
    color: 'text-blue-400'
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Quiz Streak Achievement',
    amount: 100,
    time: '1 hour ago',
    icon: TrophyIcon,
    color: 'text-yellow-400'
  },
  {
    id: 3,
    type: 'daily',
    title: 'Daily Login Bonus',
    amount: 25,
    time: '2 hours ago',
    icon: GiftIcon,
    color: 'text-green-400'
  },
  {
    id: 4,
    type: 'social',
    title: 'Social Engagement Reward',
    amount: 35,
    time: '4 hours ago',
    icon: SparklesIcon,
    color: 'text-purple-400'
  },
  {
    id: 5,
    type: 'quiz',
    title: 'Perfect Quiz Score',
    amount: 50,
    time: '6 hours ago',
    icon: SparklesIcon,
    color: 'text-emerald-400'
  }
]

export function RecentRewards() {
  const totalToday = recentRewards.reduce((sum, reward) => sum + reward.amount, 0)

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <GiftIcon className="h-5 w-5 mr-2 text-green-400" />
          Recent Rewards
        </h3>
        <div className="text-right">
          <p className="text-lg font-bold text-green-400">+{totalToday}</p>
          <p className="text-xs text-gray-400">Today</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {recentRewards.map((reward, index) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center`}>
              <reward.icon className={`h-5 w-5 ${reward.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm">{reward.title}</p>
              <p className="text-xs text-gray-400">{reward.time}</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-green-400">+{reward.amount}</p>
              <p className="text-xs text-gray-400">GUI</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-400">247</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">1,056</p>
            <p className="text-xs text-gray-400">This Month</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">2,847</p>
            <p className="text-xs text-gray-400">All Time</p>
          </div>
        </div>
      </div>
    </div>
  )
}
