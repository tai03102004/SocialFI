'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrophyIcon, 
  SparklesIcon, 
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { AchievementCard } from '../../components/achievements/AchievementCard'
import { AchievementStats } from '../../components/achievements/AchievementStats'
import { Tabs } from '../../components/ui/Tabs'
import { useAchievements } from '../../hooks/useAchievements'
import { useAccount } from 'wagmi'

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  
  const { 
    achievements, 
    stats, 
    loading, 
    error,
    getAchievementsByRarity,
    getNextAchievements,
    refetch 
  } = useAchievements()
  
  const { isConnected } = useAccount()

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

  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'unlocked' && !achievement.unlocked) return false
    if (activeTab === 'locked' && achievement.unlocked) return false
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false
    return true
  })

  // Get rarity breakdown for stats
  const rarityBreakdown = rarityFilters.slice(1).map(filter => {
    const rarityAchievements = getAchievementsByRarity(filter.id)
    return {
      rarity: filter.label,
      count: rarityAchievements.length,
      unlocked: rarityAchievements.filter(a => a.unlocked).length,
      color: filter.color
    }
  })

  // Get next milestone
  const nextAchievements = getNextAchievements(1)
  const nextMilestone = nextAchievements.length > 0 ? {
    name: nextAchievements[0].name,
    progress: nextAchievements[0].progress,
    target: nextAchievements[0].target,
    reward: nextAchievements[0].reward
  } : undefined

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your wallet to view your achievements and progress</p>
          </div>
        </div>
      </div>
    )
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
          
          {/* Refresh Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={refetch}
            disabled={loading}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="text-gray-400 mt-4">Loading achievements from blockchain...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <TrophyIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg">{error}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Filters & Stats Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Achievement Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AchievementStats 
                  stats={stats} 
                  rarityBreakdown={rarityBreakdown}
                  nextMilestone={nextMilestone}
                />
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

              {/* Next Achievement Preview */}
              {nextMilestone && (
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
                      <p className="font-medium text-white">{nextMilestone.name}</p>
                      <p className="text-sm text-purple-300">
                        {nextMilestone.progress}/{nextMilestone.target} progress
                      </p>
                    </div>
                    
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${(nextMilestone.progress / nextMilestone.target) * 100}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-purple-300">
                      {nextMilestone.target - nextMilestone.progress} more to unlock +{nextMilestone.reward} GUI!
                    </p>
                  </div>
                </motion.div>
              )}
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
              {filteredAchievements.length > 0 ? (
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
              ) : (
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
                    { name: 'Predictions', icon: '📈', count: achievements.filter(a => a.category === 'prediction').length, color: 'from-blue-500 to-cyan-500' },
                    { name: 'Social', icon: '👥', count: achievements.filter(a => a.category === 'social').length, color: 'from-purple-500 to-pink-500' },
                    { name: 'AI Alignment', icon: '🤖', count: achievements.filter(a => a.category === 'ai').length, color: 'from-green-500 to-emerald-500' },
                    { name: 'Trading', icon: '💰', count: achievements.filter(a => a.category === 'trading').length, color: 'from-yellow-500 to-orange-500' }
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
        )}
      </div>
    </div>
  )
}