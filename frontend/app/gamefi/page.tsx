'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RocketLaunchIcon, 
  TrophyIcon, 
  SparklesIcon, 
  GiftIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  FireIcon,
  CurrencyDollarIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { PlayerStats } from '../../components/gamefi/PlayerStats'
import { DailyQuests } from '../../components/gamefi/DailyQuests'
import { ActiveChallenges } from '../../components/gamefi/ActiveChallenges'
import { LeaderboardMini } from '../../components/gamefi/LeaderboardMini'
import { RecentRewards } from '../../components/gamefi/RecentRewards'
import { GameMode } from '../../components/gamefi/GameMode'

export default function GameFiPage() {
  const [playerLevel, setPlayerLevel] = useState(12)
  const [totalRewards, setTotalRewards] = useState(2847)
  const [currentStreak, setCurrentStreak] = useState(7)
  const [activeBoosts, setActiveBoosts] = useState(2)

  const gameModes = [
    {
      id: 'prediction',
      title: 'Price Predictions',
      description: 'Predict crypto prices and earn rewards for accuracy',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500',
      reward: '50 GUI',
      difficulty: 'Medium',
      players: '12.5K',
      href: '/predictions'
    },
    {
      id: 'quiz',
      title: 'Daily Quiz',
      description: 'Test your crypto knowledge and earn tokens',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      reward: '25 GUI',
      difficulty: 'Easy',
      players: '8.3K',
      href: '/quiz'
    },
    {
      id: 'social',
      title: 'Social Challenges',
      description: 'Create content and engage with the community',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-pink-500',
      reward: '35 GUI',
      difficulty: 'Easy',
      players: '15.7K',
      href: '/social'
    },
    {
      id: 'achievements',
      title: 'NFT Achievements',
      description: 'Unlock rare NFT badges by completing milestones',
      icon: TrophyIcon,
      color: 'from-yellow-500 to-orange-500',
      reward: 'NFT',
      difficulty: 'Hard',
      players: '4.2K',
      href: '/achievements'
    }
  ]

  const quickStats = [
    { label: 'Player Level', value: playerLevel, icon: RocketLaunchIcon, color: 'text-blue-400' },
    { label: 'Total Rewards', value: `${totalRewards} GUI`, icon: CurrencyDollarIcon, color: 'text-yellow-400' },
    { label: 'Current Streak', value: `${currentStreak} days`, icon: FireIcon, color: 'text-orange-400' },
    { label: 'Active Boosts', value: activeBoosts, icon: BoltIcon, color: 'text-purple-400' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            <span className="text-gradient">GameFi Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Play, predict, earn, and compete in the ultimate crypto gaming experience
          </motion.p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-white`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <RocketLaunchIcon className="h-6 w-6 mr-3 text-primary-400" />
              Game Modes
            </h2>
            <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">All Games Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <GameMode mode={mode} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Player Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <PlayerStats />
            </motion.div>

            {/* Daily Quests */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <DailyQuests />
            </motion.div>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Active Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <ActiveChallenges />
            </motion.div>

            {/* Recent Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <RecentRewards />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Leaderboard Mini */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <LeaderboardMini />
            </motion.div>

            {/* Power-ups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <BoltIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Power-ups
              </h3>

              <div className="space-y-4">
                {[
                  { name: '2x Rewards', description: 'Double rewards for 1 hour', cost: '100 GUI', active: true },
                  { name: 'Lucky Streak', description: 'Protect streak for 24h', cost: '150 GUI', active: false },
                  { name: 'AI Hint', description: 'Get AI prediction help', cost: '50 GUI', active: true },
                  { name: 'Extra Life', description: 'Second chance on quiz', cost: '75 GUI', active: false }
                ].map((powerup, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      powerup.active 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-dark-600 bg-dark-700/30 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white text-sm">{powerup.name}</h4>
                        <p className="text-xs text-gray-400">{powerup.description}</p>
                      </div>
                      <div className="text-right">
                        {powerup.active ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Active</span>
                        ) : (
                          <span className="text-xs text-yellow-400 font-medium">{powerup.cost}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <GiftIcon className="h-4 w-4 inline mr-2" />
                Shop Power-ups
              </motion.button>
            </motion.div>

            {/* Season Pass */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
                Season Pass
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-purple-300">Season 1 Progress</span>
                    <span className="text-white">Level 12/50</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-3">
                    <motion.div
                      className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '24%' }}
                      transition={{ duration: 1.5, delay: 1.5 }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-purple-300 mb-2">Next Reward: Legendary NFT</p>
                  <p className="text-xs text-purple-400">Complete 3 more challenges</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View Season Rewards
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
