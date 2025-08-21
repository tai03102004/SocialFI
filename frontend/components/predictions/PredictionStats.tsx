'use client'

import { motion } from 'framer-motion'
import { 
  TrophyIcon,
  ChartBarIcon,
  FireIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useGameFi } from '../../hooks/useEnhancedContract'
import { useEffect, useState } from 'react'

interface PredictionStatsProps {
  predictions: any[]
}

export function PredictionStats({ predictions }: PredictionStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { getPlayerStats } = useGameFi()

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const playerStats = await getPlayerStats()
        setStats(playerStats)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [getPlayerStats])

  if (loading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
            <div className="h-4 bg-dark-600 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const accuracy = stats ? Number(stats.accuracy) : 0
  const totalPredictions = stats ? Number(stats.totalPredictions) : predictions.length
  const correctPredictions = stats ? Number(stats.correctPredictions) : predictions.filter(p => p.status === 'correct').length
  const score = stats ? Number(stats.score) : 0

  const statsData = [
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: TrophyIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Total Predictions',
      value: totalPredictions.toString(),
      icon: ChartBarIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Current Streak',
      value: '0', // Would need to calculate from recent predictions
      icon: FireIcon,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    {
      label: 'Total Score',
      value: score.toString(),
      icon: CurrencyDollarIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-4 text-center`}
          >
            <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress to Next Level</span>
          <span className="text-white">{score}/1000</span>
        </div>
        <div className="w-full bg-dark-600 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((score / 1000) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}