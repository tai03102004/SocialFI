'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AcademicCapIcon, FireIcon, TrophyIcon, StarIcon } from '@heroicons/react/24/outline'
import { useGameFiQuiz } from '../../hooks/useGameFiQuiz'

export function QuizStats() {
  const { getQuizStats, loading, isConnected } = useGameFiQuiz()
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestStreak: 0,
    totalRewards: 0,
    accuracy: 0,
    rank: 0,
    canTakeQuiz: true
  })

  useEffect(() => {
    loadStats()
  }, [isConnected])

  const loadStats = async () => {
    if (!isConnected) return

    try {
      const quizStats = await getQuizStats()
      if (quizStats) {
        setStats({
          ...quizStats,
          rank: Math.max(1, 100 - Math.floor(quizStats.averageScore / 10)) // Mock rank calculation
        })
      }
    } catch (error) {
      console.error('Failed to load quiz stats:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quiz Statistics</h3>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Connect wallet to view stats</p>
          <div className="w-12 h-12 mx-auto bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <AcademicCapIcon className="h-5 w-5 mr-2 text-primary-400" />
        Quiz Statistics
      </h3>

      {loading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-8 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-green-400">{stats.averageScore}%</p>
                </div>
                <StarIcon className="h-8 w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Best Streak</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.bestStreak}</p>
                </div>
                <FireIcon className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Quizzes</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalQuizzes}</p>
                </div>
                <AcademicCapIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Rewards</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.totalRewards}</p>
                </div>
                <TrophyIcon className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Cooldown Status */}
          {!stats.canTakeQuiz && (
            <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <FireIcon className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-orange-300">Quiz cooldown active - 24 hours remaining</span>
              </div>
            </div>
          )}

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Quiz Accuracy</span>
                <span className="text-sm text-white">{stats.accuracy}%</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.accuracy}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Global Rank</span>
                <span className="text-sm text-white">#{stats.rank}</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - (stats.rank / 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}