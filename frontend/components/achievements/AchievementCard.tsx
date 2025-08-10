'use client'

import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Achievement {
  id: number
  name: string
  description: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  target: number
  reward: number
  unlocked: boolean
  unlockedAt?: string
}

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/50'
      case 'rare': return 'border-blue-500/50'
      case 'epic': return 'border-purple-500/50'
      case 'legendary': return 'border-yellow-500/50'
      default: return 'border-gray-500/50'
    }
  }

  const getRarityStars = (rarity: string) => {
    switch (rarity) {
      case 'common': return 1
      case 'rare': return 2
      case 'epic': return 3
      case 'legendary': return 5
      default: return 1
    }
  }

  const progressPercentage = Math.min((achievement.progress / achievement.target) * 100, 100)
  const stars = getRarityStars(achievement.rarity)

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-dark-800/50 backdrop-blur-sm border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        achievement.unlocked 
          ? `${getRarityBorder(achievement.rarity)} shadow-lg` 
          : 'border-dark-600 hover:border-dark-500'
      } ${achievement.unlocked && achievement.rarity === 'legendary' ? 'animate-pulse' : ''}`}
    >
      {/* Rarity Indicator */}
      <div className="absolute top-3 right-3 flex items-center space-x-1">
        {[...Array(stars)].map((_, i) => (
          <StarSolidIcon key={i} className={`h-3 w-3 ${getRarityColor(achievement.rarity).includes('yellow') ? 'text-yellow-400' : 'text-gray-400'}`} />
        ))}
      </div>

      {/* Achievement Icon */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex items-center justify-center ${
          achievement.unlocked ? '' : 'grayscale opacity-50'
        }`}>
          {achievement.unlocked ? (
            <TrophyIcon className="h-8 w-8 text-white" />
          ) : (
            <LockClosedIcon className="h-8 w-8 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
              {achievement.name}
            </h3>
            {achievement.unlocked && (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            )}
          </div>
          
          <p className={`text-sm leading-relaxed ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {!achievement.unlocked && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{achievement.progress}/{achievement.target}</span>
          </div>
          <div className="w-full bg-dark-600 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Reward & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">
            +{achievement.reward} GUI
          </span>
        </div>

        {achievement.unlocked ? (
          <div className="text-xs text-green-400 flex items-center space-x-1">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Unlocked {achievement.unlockedAt}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% Complete
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
          achievement.unlocked 
            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
            : 'bg-dark-600 text-gray-400'
        }`}>
          {achievement.category}
        </span>
      </div>

      {/* Legendary Glow Effect */}
      {achievement.unlocked && achievement.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 animate-pulse pointer-events-none" />
      )}
    </motion.div>
  )
}
