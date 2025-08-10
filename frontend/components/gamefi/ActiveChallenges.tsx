'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline'

const activeChallenges = [
  {
    id: 1,
    title: 'Weekly Prediction Challenge',
    description: 'Get 80% accuracy on 20 predictions this week',
    progress: 15,
    target: 20,
    accuracy: 73.3,
    reward: 500,
    timeLeft: '3 days',
    participants: 234,
    difficulty: 'Hard'
  },
  {
    id: 2,
    title: 'Quiz Master Marathon',
    description: 'Complete 10 daily quizzes in a row',
    progress: 7,
    target: 10,
    accuracy: 85.7,
    reward: 300,
    timeLeft: '5 days',
    participants: 156,
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Social Influencer',
    description: 'Get 100 likes on your posts this month',
    progress: 67,
    target: 100,
    accuracy: 67,
    reward: 250,
    timeLeft: '12 days',
    participants: 89,
    difficulty: 'Easy'
  }
]

export function ActiveChallenges() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
        Active Challenges
      </h3>

      <div className="space-y-6">
        {activeChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-dark-600 rounded-lg p-5 bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-white">{challenge.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{challenge.description}</p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-yellow-400">+{challenge.reward}</p>
                <p className="text-xs text-gray-400">GUI Reward</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{challenge.progress}/{challenge.target}</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-3">
                <motion.div
                  className="h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${challenge.accuracy}%` }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-gray-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>{challenge.timeLeft} left</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <UsersIcon className="h-4 w-4" />
                  <span>{challenge.participants} participants</span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
