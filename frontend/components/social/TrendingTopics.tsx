'use client'

import { motion } from 'framer-motion'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const trendingTopics = [
  { tag: '#Bitcoin', posts: '12.5K', trend: '+15%' },
  { tag: '#GameFi', posts: '8.2K', trend: '+23%' },
  { tag: '#ZetaChain', posts: '5.7K', trend: '+45%' },
  { tag: '#DeFi', posts: '9.1K', trend: '+8%' },
  { tag: '#NFTs', posts: '6.3K', trend: '+12%' },
]

export function TrendingTopics() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-primary-400" />
        Trending Topics
      </h3>
      
      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <motion.div
            key={topic.tag}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-3 hover:bg-dark-700/50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <div>
              <p className="font-medium text-primary-400">{topic.tag}</p>
              <p className="text-sm text-gray-400">{topic.posts} posts</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-400">{topic.trend}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
        Show more trends
      </button>
    </div>
  )
}
