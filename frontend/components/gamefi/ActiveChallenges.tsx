'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon, ClockIcon, UsersIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useGameFi } from '../../hooks/useEnhancedContract'
import { formatTokenAmount, formatTimeAgo } from '../../hooks/useEnhancedContract'
import { toast } from 'react-hot-toast'

export function ActiveChallenges() {
  const [quests, setQuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [completingQuest, setCompletingQuest] = useState<number | null>(null)
  
  const { getActiveQuests, completeQuest, loading, error } = useGameFi()

  // Load quests from blockchain
  useEffect(() => {
    loadQuests()
  }, [])

  const loadQuests = async () => {
    try {
      setIsLoading(true)
      console.log('🎯 Loading quests from blockchain...')
      
      const blockchainQuests = await getActiveQuests()
      
      // Convert blockchain data to frontend format
      const formattedQuests = blockchainQuests.map((quest: any) => ({
        id: Number(quest.id),
        title: quest.title,
        description: quest.description,
        questType: quest.questType,
        reward: Number(quest.reward),
        deadline: Number(quest.deadline),
        active: quest.active,
        // Calculate time left
        timeLeft: calculateTimeLeft(Number(quest.deadline)),
        // Mock some additional data for UI
        participants: Math.floor(Math.random() * 500) + 50,
        difficulty: getDifficultyFromReward(Number(quest.reward)),
        progress: 0, // TODO: Implement progress tracking
        target: 1 // TODO: Get from quest data
      }))

      console.log('✅ Loaded quests:', formattedQuests)
      setQuests(formattedQuests)
    } catch (error) {
      console.error('Failed to load quests:', error)
      toast.error('Failed to load quests from blockchain')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteQuest = async (questId: number) => {
    try {
      setCompletingQuest(questId)
      
      console.log(`🎯 Completing quest ${questId}...`)
      await completeQuest(questId)
      
      toast.success('Quest completed! Rewards will be distributed shortly.')
      
      // Reload quests after completion
      setTimeout(() => {
        loadQuests()
      }, 2000)
      
    } catch (error: any) {
      console.error('Failed to complete quest:', error)
      toast.error(error.message || 'Failed to complete quest')
    } finally {
      setCompletingQuest(null)
    }
  }

  // Helper functions
  const calculateTimeLeft = (deadline: number): string => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = deadline - now
    
    if (timeLeft <= 0) return 'Expired'
    
    const days = Math.floor(timeLeft / 86400)
    const hours = Math.floor((timeLeft % 86400) / 3600)
    
    if (days > 0) return `${days} days`
    if (hours > 0) return `${hours} hours`
    return 'Less than 1 hour'
  }

  const getDifficultyFromReward = (reward: number): string => {
    if (reward >= 500) return 'Hard'
    if (reward >= 200) return 'Medium'
    return 'Easy'
  }

  if (isLoading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Active Challenges
        </h3>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dark-600 rounded-lg p-5 bg-dark-700/30 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-full mb-4"></div>
              <div className="h-2 bg-gray-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Active Challenges
        </h3>
        
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Failed to load challenges</p>
          <button 
            onClick={loadQuests}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-400" />
          Active Challenges
        </h3>
        <button 
          onClick={loadQuests}
          disabled={loading}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium disabled:opacity-50"
        >
          {loading ? '🔄' : '🔄 Refresh'}
        </button>
      </div>

      {quests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <h4 className="text-white font-medium mb-2">No Active Challenges</h4>
          <p className="text-gray-400 text-sm">New challenges will appear soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {quests.map((challenge, index) => {
            const isCompleting = completingQuest === challenge.id
            const isExpired = challenge.timeLeft === 'Expired'
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-5 transition-colors ${
                  isExpired 
                    ? 'border-red-600/50 bg-red-900/20' 
                    : 'border-dark-600 bg-dark-700/30 hover:bg-dark-700/50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">{challenge.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        challenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        challenge.questType === 'DAILY' ? 'border-blue-500/50 text-blue-400' :
                        challenge.questType === 'WEEKLY' ? 'border-purple-500/50 text-purple-400' :
                        'border-gray-500/50 text-gray-400'
                      }`}>
                        {challenge.questType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{challenge.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">+{challenge.reward}</p>
                    <p className="text-xs text-gray-400">GUI Reward</p>
                  </div>
                </div>

                {/* Quest Type Info */}
                <div className="mb-4 p-3 bg-dark-800/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Quest Type:</span>
                    <span className="text-white font-medium">{challenge.questType}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <ClockIcon className="h-4 w-4" />
                      <span className={isExpired ? 'text-red-400' : ''}>{challenge.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <UsersIcon className="h-4 w-4" />
                      <span>{challenge.participants} participants</span>
                    </div>
                  </div>
                  
                  {!isExpired && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCompleteQuest(challenge.id)}
                      disabled={isCompleting}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
                    >
                      {isCompleting ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-3 w-3" />
                          <span>Complete Quest</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}