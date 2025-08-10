'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  SparklesIcon, 
  StarIcon, 
} from '@heroicons/react/24/outline'
import { AchievementCard } from '../../components/achievements/AchievementCard'
import { AchievementStats } from '../../components/achievements/AchievementStats'
import { Tabs } from '../../components/ui/Tabs'

type Achievement = {
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

const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Make your first price prediction",
    category: "prediction",
    rarity: "common",
    progress: 1,
    target: 1,
    reward: 50,
    unlocked: true,
    unlockedAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Oracle",
    description: "Achieve 80% prediction accuracy with minimum 50 predictions",
    category: "prediction",
    rarity: "epic",
    progress: 47,
    target: 50,
    reward: 500,
    unlocked: false
  },
  {
    id: 3,
    name: "Quiz Master",
    description: "Complete 100 daily quizzes",
    category: "quiz",
    rarity: "rare",
    progress: 23,
    target: 100,
    reward: 200,
    unlocked: false
  },
  {
    id: 4,
    name: "Social Butterfly",
    description: "Make 50 posts and get 500 likes",
    category: "social",
    rarity: "rare",
    progress: 500,
    target: 500,
    reward: 300,
    unlocked: true,
    unlockedAt: "2024-01-10"
  },
  {
    id: 5,
    name: "Diamond Hands",
    description: "Hold positions for 30 days straight",
    category: "trading",
    rarity: "legendary",
    progress: 12,
    target: 30,
    reward: 1000,
    unlocked: false
  }
]

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')

  const tabs = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'unlocked', label: 'Unlocked', icon: '✅' },
    { id: 'locked', label: 'In Progress', icon: '🔒' }
  ]

  const rarityFilters = [
    { id: 'all', label: 'All Rarities', color: 'text-gray-400' },
    { id: 'common', label: 'Common', color: 'text-gray-400' },
    { id: 'rare', label: 'Rare', color: 'text-blue-400' },
    { id: 'epic', label: 'Epic', color: 'text-purple-400' },
    { id: 'legendary', label: 'Legendary', color: 'text-yellow-400' }
  ]

  const filteredAchievements = mockAchievements.filter(achievement => {
    if (activeTab === 'unlocked' && !achievement.unlocked) return false
    if (activeTab === 'locked' && achievement.unlocked) return false
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false
    return true
  })

  const stats = {
    total: mockAchievements.length,
    unlocked: mockAchievements.filter(a => a.unlocked).length,
    totalRewards: mockAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.reward, 0)
  }

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
            <span className="text-gradient">Achievements</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Unlock NFT achievements by completing challenges and milestones
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters & Stats Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Achievement Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AchievementStats stats={stats} />
            </motion.div>

            {/* Rarity Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <StarIcon className="h-5 w-5 mr-2 text-yellow-400" />
                Filter by Rarity
              </h3>
              
              <div className="space-y-2">
                {rarityFilters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRarity(filter.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedRarity === filter.id
                        ? 'bg-primary-600/20 border border-primary-500/50'
                        : 'hover:bg-dark-700/50'
                    }`}
                  >
                    <span className={`font-medium ${filter.color}`}>
                      {filter.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Next Achievement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
                Almost There!
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-white">Oracle Achievement</p>
                  <p className="text-sm text-purple-300">47/50 accurate predictions</p>
                </div>
                
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: '94%' }}
                  />
                </div>
                
                <p className="text-xs text-purple-300">
                  3 more predictions to unlock epic NFT + 500 GUI!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <AchievementCard achievement={achievement} />
                </motion.div>
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No achievements found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            )}

            {/* Achievement Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Achievement Categories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Predictions', icon: '📈', count: 15, color: 'from-blue-500 to-cyan-500' },
                  { name: 'Quiz', icon: '🧠', count: 12, color: 'from-green-500 to-emerald-500' },
                  { name: 'Social', icon: '👥', count: 8, color: 'from-purple-500 to-pink-500' },
                  { name: 'Trading', icon: '💰', count: 10, color: 'from-yellow-500 to-orange-500' }
                ].map((category, index) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-r ${category.color} p-4 rounded-lg text-white`}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">{category.icon}</span>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm opacity-90">{category.count} achievements</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
