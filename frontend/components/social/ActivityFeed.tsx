'use client'

import { motion } from 'framer-motion'
import { 
  UserIcon, 
  TrophyIcon, 
  HeartIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    type: 'achievement',
    user: 'CryptoMaster',
    action: 'unlocked the "Oracle" achievement',
    timestamp: '2 minutes ago',
    icon: TrophyIcon,
    color: 'text-yellow-400',
  },
  {
    id: 2,
    type: 'prediction',
    user: 'TradeWizard',
    action: 'made a successful BTC prediction',
    timestamp: '5 minutes ago',
    icon: ChartBarIcon,
    color: 'text-blue-400',
  },
  {
    id: 3,
    type: 'social',
    user: 'GameFiGuru',
    action: 'liked your post about DeFi',
    timestamp: '8 minutes ago',
    icon: HeartIcon,
    color: 'text-red-400',
  },
  {
    id: 4,
    type: 'follow',
    user: 'BlockchainBob',
    action: 'started following you',
    timestamp: '12 minutes ago',
    icon: UserIcon,
    color: 'text-green-400',
  },
  {
    id: 5,
    type: 'comment',
    user: 'NFTCollector',
    action: 'commented on your prediction',
    timestamp: '15 minutes ago',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-400',
  },
]

interface ActivityFeedProps {
  limit?: number
}

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const displayActivities = activities.slice(0, limit)

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 absolute top-6 max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {displayActivities.slice(0,3).map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 hover:bg-dark-700/30 rounded-lg transition-colors"
          >
            <div className={`w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-medium text-primary-400">{activity.user}</span>
                {' '}
                {/* <span className="text-gray-300">{activity.action}</span> */}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
        View all activity
      </button>
    </div>
  )
}
