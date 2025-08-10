'use client'

import { motion } from 'framer-motion'
import { GiftIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

const dailyQuests = [
  {
    id: 1,
    title: 'Make 3 Predictions',
    description: 'Submit 3 price predictions today',
    progress: 2,
    target: 3,
    reward: 50,
    completed: false
  },
  {
    id: 2,
    title: 'Complete Daily Quiz',
    description: 'Answer 5 quiz questions correctly',
    progress: 5,
    target: 5,
    reward: 25,
    completed: true
  },
  {
    id: 3,
    title: 'Social Engagement',
    description: 'Like and comment on 10 posts',
    progress: 7,
    target: 10,
    reward: 35,
    completed: false
  },
  {
    id: 4,
    title: 'Login Streak',
    description: 'Maintain your daily login streak',
    progress: 1,
    target: 1,
    reward: 15,
    completed: true
  }
]

export function DailyQuests() {
  const completedQuests = dailyQuests.filter(quest => quest.completed).length
  const totalQuests = dailyQuests.length

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <GiftIcon className="h-5 w-5 mr-2 text-primary-400" />
          Daily Quests
        </h3>
        <div className="flex items-center space-x-2 bg-primary-500/20 px-3 py-1 rounded-full">
          <span className="text-sm text-primary-300">{completedQuests}/{totalQuests}</span>
        </div>
      </div>

      <div className="space-y-4">
        {dailyQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all ${
              quest.completed 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-dark-600 bg-dark-700/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {quest.completed ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                ) : (
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm mb-1 ${
                  quest.completed ? 'text-green-300' : 'text-white'
                }`}>
                  {quest.title}
                </h4>
                <p className="text-xs text-gray-400 mb-3">{quest.description}</p>
                
                {!quest.completed && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{quest.progress}/{quest.target}</span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  quest.completed 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  +{quest.reward} GUI
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Bonus */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-300">Complete All Quests</p>
            <p className="text-xs text-purple-400">Bonus reward for 100% completion</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-300">+100 GUI</p>
            <p className="text-xs text-purple-400">Bonus</p>
          </div>
        </div>
      </div>
    </div>
  )
}
