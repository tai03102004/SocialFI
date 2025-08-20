'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GiftIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useTokenBalance } from '../../hooks/useEnhancedContract'
import { formatTokenAmount } from '../../hooks/useEnhancedContract'

export function RecentRewards() {
  const { balance, loading, refetch } = useTokenBalance()
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  // Mock recent activities - in real app, get from blockchain events
  useEffect(() => {
    // Simulate fetching recent reward activities
    const mockActivities = [
      {
        id: 1,
        type: 'quest',
        title: 'Quest Completed',
        amount: 150,
        time: '5 min ago',
        icon: TrophyIcon,
        color: 'text-yellow-400',
        txHash: '0xabc...123'
      },
      {
        id: 2,
        type: 'prediction',
        title: 'Correct AI Prediction',
        amount: 75,
        time: '1 hour ago',
        icon: SparklesIcon,
        color: 'text-blue-400',
        txHash: '0xdef...456'
      },
      {
        id: 3,
        type: 'daily',
        title: 'Daily Login Bonus',
        amount: 25,
        time: '2 hours ago',
        icon: GiftIcon,
        color: 'text-green-400',
        txHash: '0xghi...789'
      }
    ]
    
    setRecentActivities(mockActivities)
  }, [])

  const totalToday = recentActivities.reduce((sum, reward) => sum + reward.amount, 0)

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <GiftIcon className="h-5 w-5 mr-2 text-green-400" />
          Rewards
        </h3>
        <button 
          onClick={refetch}
          disabled={loading}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium disabled:opacity-50"
        >
          {loading ? '🔄' : '🔄'}
        </button>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-green-300 mb-1">Current GUI Balance</p>
          <p className="text-2xl font-bold text-green-400">
            {loading ? '...' : formatTokenAmount(balance)} GUI
          </p>
        </div>
      </div>

      {/* Today's Earnings */}
      <div className="flex items-center justify-between mb-4 p-3 bg-dark-700/30 rounded-lg">
        <span className="text-gray-400 text-sm">Today's Earnings</span>
        <span className="text-lg font-bold text-green-400">+{totalToday} GUI</span>
      </div>

      {/* Recent Activities */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {recentActivities.map((reward, index) => (
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
              <p className="text-sm font-medium text-white truncate">{reward.title}</p>
              <p className="text-xs text-gray-400">{reward.time}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-green-400">+{reward.amount}</p>
              <p className="text-xs text-gray-400">GUI</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-400">24</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">156</p>
            <p className="text-xs text-gray-400">This Month</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">1,247</p>
            <p className="text-xs text-gray-400">All Time</p>
          </div>
        </div>
      </div>
    </div>
  )
}