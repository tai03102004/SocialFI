'use client'

import { motion } from 'framer-motion'
import { UserPlusIcon } from '@heroicons/react/24/outline'

const suggestedUsers = [
  {
    id: 1,
    username: 'CryptoWhale',
    address: '0xabcd...1234',
    followers: '12.5K',
    avatar: '/api/placeholder/40/40',
    verified: true,
  },
  {
    id: 2,
    username: 'NFTCollector',
    address: '0xefgh...5678',
    followers: '8.2K',
    avatar: '/api/placeholder/40/40',
    verified: false,
  },
  {
    id: 3,
    username: 'DeFiMaster',
    address: '0xijkl...9012',
    followers: '15.7K',
    avatar: '/api/placeholder/40/40',
    verified: true,
  },
]

export function SuggestedUsers() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <UserPlusIcon className="h-5 w-5 mr-2 text-secondary-400" />
        Suggested for You
      </h3>
      
      <div className="space-y-4">
        {suggestedUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="font-medium text-white text-sm">{user.username}</p>
                  {user.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400">{user.followers} followers</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1 rounded-lg font-medium transition-colors"
            >
              Follow
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-secondary-400 hover:text-secondary-300 text-sm font-medium transition-colors">
        Show more suggestions
      </button>
    </div>
  )
}
