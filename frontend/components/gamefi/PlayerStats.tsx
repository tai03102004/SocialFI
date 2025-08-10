'use client'

import { motion } from 'framer-motion'
import { UserIcon, TrophyIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export function PlayerStats() {
  const stats = {
    level: 12,
    experience: 2400,
    experienceToNext: 3000,
    rank: 247,
    accuracy: 75.6,
    streak: 7,
    totalRewards: 2847
  }

  const experiencePercentage = (stats.experience / stats.experienceToNext) * 100

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <UserIcon className="h-5 w-5 mr-2 text-primary-400" />
        Player Profile
      </h3>

      {/* Level & Experience */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{stats.level}</span>
            </div>
            <div>
              <p className="font-semibold text-white">Level {stats.level}</p>
              <p className="text-sm text-gray-400">GameFi Player</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Global Rank</p>
            <p className="font-bold text-primary-400">#{stats.rank}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Experience</span>
            <span className="text-white">{stats.experience}/{stats.experienceToNext} XP</span>
          </div>
        </div>
        
        <div className="w-full bg-dark-600 rounded-full h-3">
          <motion.div
            className="h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${experiencePercentage}%` }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Accuracy</span>
          </div>
          <p className="text-xl font-bold text-green-400">{stats.accuracy}%</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">Streak</span>
          </div>
          <p className="text-xl font-bold text-orange-400">{stats.streak} days</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 col-span-2">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Total Rewards</span>
          </div>
          <p className="text-xl font-bold text-yellow-400">{stats.totalRewards} GUI</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-6 pt-6 border-t border-dark-600">
        <h4 className="text-sm font-semibold text-white mb-3">Recent Achievements</h4>
        <div className="space-y-2">
          {[
            { name: 'Prediction Master', reward: '+100 GUI', time: '2h ago' },
            { name: 'Quiz Streak', reward: '+50 GUI', time: '1d ago' }
          ].map((achievement, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{achievement.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">{achievement.reward}</span>
                <span className="text-gray-500">{achievement.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
