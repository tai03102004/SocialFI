'use client'

import { motion } from 'framer-motion'
import { UsersIcon, StarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface GameModeProps {
  mode: {
    id: string
    title: string
    description: string
    icon: any
    color: string
    reward: string
    difficulty: string
    players: string
    href: string
  }
}

export function GameMode({ mode }: GameModeProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 border-green-400/50'
      case 'medium': return 'text-yellow-400 border-yellow-400/50'
      case 'hard': return 'text-red-400 border-red-400/50'
      default: return 'text-gray-400 border-gray-400/50'
    }
  }

  return (
    <Link href={mode.href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 cursor-pointer h-full"
      >
        {/* Icon & Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center`}>
            <mode.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{mode.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(mode.difficulty)}`}>
                {mode.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {mode.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <UsersIcon className="h-4 w-4" />
            <span>{mode.players} players</span>
          </div>
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">{mode.reward}</span>
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 bg-gradient-to-r ${mode.color} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
        >
          Play Now
        </motion.button>
      </motion.div>
    </Link>
  )
}
