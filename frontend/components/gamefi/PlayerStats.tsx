'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserIcon, ChartBarIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useGameFi, useTokenBalance } from '../../hooks/useEnhancedContract'
import { formatTokenAmount } from '../../hooks/useEnhancedContract'

export function PlayerStats() {
  const [playerStats, setPlayerStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { getPlayerStats, loading: gameLoading, error } = useGameFi()
  const { balance } = useTokenBalance()

  useEffect(() => {
    loadPlayerStats()
  }, [])

  const loadPlayerStats = async () => {
    try {
      setIsLoading(true)
      console.log('👤 Loading player stats from blockchain...')
      
      const stats = await getPlayerStats()
      
      if (stats) {
        setPlayerStats({
          level: calculateLevel(Number(stats.score)),
          experience: Number(stats.score),
          experienceToNext: calculateExpToNext(Number(stats.score)),
          rank: 247, // TODO: Get real rank from leaderboard
          accuracy: Number(stats.accuracy),
          streak: 7, // TODO: Implement streak tracking
          totalRewards: Number(balance || '0'),
          totalPredictions: Number(stats.totalPredictions),
          correctPredictions: Number(stats.correctPredictions),
          aiFollowScore: Number(stats.aiFollowScore)
        })
        
        console.log('✅ Player stats loaded:', stats)
      } else {
        // Default stats for new players
        setPlayerStats({
          level: 1,
          experience: 0,
          experienceToNext: 1000,
          rank: 999,
          accuracy: 0,
          streak: 0,
          totalRewards: 0,
          totalPredictions: 0,
          correctPredictions: 0,
          aiFollowScore: 0
        })
      }
    } catch (error) {
      console.error('Failed to load player stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions
  const calculateLevel = (score: number): number => {
    return Math.floor(score / 1000) + 1
  }

  const calculateExpToNext = (score: number): number => {
    const currentLevel = calculateLevel(score)
    return currentLevel * 1000
  }

  if (isLoading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-primary-400" />
          Player Profile
        </h3>
        
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-full"></div>
          <div className="h-8 bg-gray-600 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-600 rounded"></div>
            <div className="h-16 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-primary-400" />
          Player Profile
        </h3>
        
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Failed to load player stats</p>
          <button 
            onClick={loadPlayerStats}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const experiencePercentage = (playerStats.experience % 1000) / 10 // Convert to percentage

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-primary-400" />
          Player Profile
        </h3>
        <button 
          onClick={loadPlayerStats}
          disabled={gameLoading}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium disabled:opacity-50"
        >
          {gameLoading ? '🔄' : '🔄'}
        </button>
      </div>

      {/* Level & Experience */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">{playerStats.level}</span>
            </div>
            <div>
              <p className="font-semibold text-white">Level {playerStats.level}</p>
              <p className="text-sm text-gray-400">Rank #{playerStats.rank}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Score</p>
            <p className="font-bold text-primary-400">{playerStats.experience.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress to Level {playerStats.level + 1}</span>
            <span className="text-white">{playerStats.experience % 1000}/1000</span>
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
            <span className="text-xs text-gray-400">Accuracy</span>
          </div>
          <p className="text-xl font-bold text-green-400">{playerStats.accuracy}%</p>
          <p className="text-xs text-gray-400">{playerStats.correctPredictions}/{playerStats.totalPredictions} correct</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-gray-400">Streak</span>
          </div>
          <p className="text-xl font-bold text-orange-400">{playerStats.streak} days</p>
        </div>

        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 col-span-2">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Total Rewards</span>
          </div>
          <p className="text-xl font-bold text-yellow-400">{formatTokenAmount(playerStats.totalRewards)} GUI</p>
        </div>
      </div>

      {/* AI Alignment Score */}
      <div className="mt-6 pt-6 border-t border-dark-600">
        <h4 className="text-sm font-semibold text-white mb-3">AI Alignment Score</h4>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="w-full bg-dark-600 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(playerStats.aiFollowScore, 100)}%` }}
                transition={{ duration: 1.5, delay: 1 }}
              />
            </div>
          </div>
          <span className="ml-3 text-sm font-bold text-purple-400">
            {playerStats.aiFollowScore}/100
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          How well you follow AI predictions
        </p>
      </div>
    </div>
  )
}