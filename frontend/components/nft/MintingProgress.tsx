'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrophyIcon, SparklesIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useNFTAchievements } from '../../hooks/useNFTAchievements'
import { useGameFi } from '../../hooks/useEnhancedContract'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface Milestone {
  id: number
  name: string
  description: string
  progress: number
  target: number
  reward: string
  chain: string
  rarity: string
  achievementId?: number
  completed?: boolean
}

interface MintingProgressProps {
  milestones?: Milestone[] // ✅ Add optional milestones prop
}

export function MintingProgress({ milestones: propMilestones }: MintingProgressProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mintingAchievement, setMintingAchievement] = useState<number | null>(null)

  const { getPlayerStats } = useGameFi()
  const { getAchievement, hasAchievement, mintAchievement, loading: nftLoading, isConnected } = useNFTAchievements()
  const { address, isConnected: walletConnected } = useAccount()

  useEffect(() => {
    if (walletConnected && isConnected) {
      loadMilestones()
    } else if (propMilestones) {
      setMilestones(propMilestones.map(m => ({ ...m, completed: false, achievementId: m.id })))
      setIsLoading(false)
    }
  }, [walletConnected, isConnected, propMilestones])

  const loadMilestones = async () => {
    try {
      setIsLoading(true)
      console.log('🎯 Loading achievement milestones...')

      // ✅ If prop milestones are provided, use them as base
      if (propMilestones && propMilestones.length > 0) {
        // Get player stats to update progress
        try {
          const playerStats = await getPlayerStats()
          
          if (playerStats) {
            // Update progress based on real stats
            const updatedMilestones = await Promise.all(
              propMilestones.map(async (milestone, index) => {
                const achievementId = milestone.achievementId || index + 1
                
                // Calculate real progress based on milestone type
                let realProgress = milestone.progress
                
                if (milestone.name.includes('prediction')) {
                  realProgress = Number(playerStats.totalPredictions)
                } else if (milestone.name.includes('correct')) {
                  realProgress = Number(playerStats.correctPredictions)
                } else if (milestone.name.includes('accuracy')) {
                  realProgress = Number(playerStats.accuracy)
                }
                
                const completed = await hasAchievement(achievementId).catch(() => false)
                
                return {
                  ...milestone,
                  progress: Math.min(realProgress, milestone.target),
                  achievementId,
                  completed
                }
              })
            )
            
            setMilestones(updatedMilestones)
          } else {
            // No stats available, use prop milestones as-is
            setMilestones(propMilestones.map((m, i) => ({ 
              ...m, 
              completed: false, 
              achievementId: m.achievementId || i + 1 
            })))
          }
        } catch (error) {
          console.warn('Could not load player stats, using prop milestones:', error)
          setMilestones(propMilestones.map((m, i) => ({ 
            ...m, 
            completed: false, 
            achievementId: m.achievementId || i + 1 
          })))
        }
      } else {
        // ✅ Original logic for dynamic milestones
        const playerStats = await getPlayerStats()
        
        if (!playerStats) {
          console.log('No player stats found')
          setMilestones([])
          return
        }

        // Define available achievements
        const achievementDefinitions = [
          {
            id: 1,
            achievementId: 1,
            name: 'First Prediction',
            description: 'Make your first AI-guided prediction',
            target: 1,
            getProgress: (stats: any) => Number(stats.totalPredictions),
            reward: 'Starter NFT',
            chain: 'ZetaChain',
            rarity: 'Common'
          },
          {
            id: 2,
            achievementId: 2,
            name: 'Social Starter',
            description: 'Create your first post',
            target: 1,
            getProgress: (stats: any) => 0, // TODO: Implement social stats
            reward: 'Social Badge NFT',
            chain: 'ZetaChain',
            rarity: 'Common'
          },
          {
            id: 3,
            achievementId: 3,
            name: 'AI Follower',
            description: 'Follow AI recommendations 5 times',
            target: 5,
            getProgress: (stats: any) => Number(stats.aiFollowScore) / 20,
            reward: 'AI Companion NFT',
            chain: 'ZetaChain',
            rarity: 'Rare'
          },
          {
            id: 4,
            achievementId: 4,
            name: 'Prediction Master',
            description: 'Make 50 correct predictions',
            target: 50,
            getProgress: (stats: any) => Number(stats.correctPredictions),
            reward: 'Master Predictor NFT',
            chain: 'Ethereum',
            rarity: 'Epic'
          },
          {
            id: 5,
            achievementId: 5,
            name: 'Accuracy Legend',
            description: 'Achieve 90% prediction accuracy',
            target: 90,
            getProgress: (stats: any) => Number(stats.accuracy),
            reward: 'Legendary Oracle NFT',
            chain: 'ZetaChain',
            rarity: 'Legendary'
          }
        ]

        // Check completion status and calculate progress
        const milestonesWithProgress = await Promise.all(
          achievementDefinitions.map(async (def) => {
            const progress = def.getProgress(playerStats)
            const completed = await hasAchievement(def.achievementId).catch(() => false)
            
            return {
              ...def,
              progress: Math.min(progress, def.target),
              completed
            }
          })
        )

        console.log('✅ Milestones loaded:', milestonesWithProgress)
        setMilestones(milestonesWithProgress)
      }
    } catch (error) {
      console.error('Failed to load milestones:', error)
      // ✅ Fallback to prop milestones if loading fails
      if (propMilestones) {
        setMilestones(propMilestones.map((m, i) => ({ 
          ...m, 
          completed: false, 
          achievementId: m.achievementId || i + 1 
        })))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleMintAchievement = async (milestone: Milestone) => {
    if (!address || milestone.progress < milestone.target || !milestone.achievementId) return

    try {
      setMintingAchievement(milestone.id)
      
      await mintAchievement(address, milestone.achievementId)
      
      // Reload milestones to update completion status
      await loadMilestones()
      
    } catch (error) {
      console.error('Failed to mint achievement:', error)
      toast.error('Failed to mint NFT. Please try again.')
    } finally {
      setMintingAchievement(null)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-500 to-orange-500'
      case 'Epic': return 'from-purple-500 to-pink-500'
      case 'Rare': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getChainColor = (chain: string) => {
    switch (chain) {
      case 'ZetaChain': return 'bg-primary-500/20 text-primary-300'
      case 'Ethereum': return 'bg-blue-500/20 text-blue-300'
      case 'Polygon': return 'bg-purple-500/20 text-purple-300'
      case 'BSC': return 'bg-yellow-500/20 text-yellow-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  }

  if (!walletConnected) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 text-center">
        <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your wallet to view auto-mint progress</p>
        
        {/* ✅ Show milestone preview even without wallet */}
        {propMilestones && propMilestones.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-4">Preview of available achievements:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {propMilestones.slice(0, 4).map((milestone) => (
                <div key={milestone.id} className="bg-dark-700/30 border border-dark-600 rounded-lg p-3">
                  <p className="text-sm font-medium text-white">{milestone.name}</p>
                  <p className="text-xs text-gray-400">{milestone.reward}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getChainColor(milestone.chain)}`}>
                    {milestone.chain}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
          Auto-Mint Progress
        </h3>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dark-600 rounded-xl p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-600 rounded mb-4"></div>
              <div className="h-8 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <SparklesIcon className="h-5 w-5 mr-2 text-purple-400" />
          Auto-Mint Progress
        </h3>
        <button 
          onClick={loadMilestones}
          disabled={isLoading}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? '🔄' : '🔄 Refresh'}
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-8">
          <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No achievements available</p>
          <p className="text-gray-500 text-sm">Complete activities to unlock achievements</p>
        </div>
      ) : (
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const progressPercent = (milestone.progress / milestone.target) * 100
            const isCompleted = milestone.completed
            const canMint = milestone.progress >= milestone.target && !isCompleted
            const isMinting = mintingAchievement === milestone.id

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-xl p-6 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : canMint
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-dark-600 bg-dark-700/30 hover:border-primary-500/50'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getRarityColor(milestone.rarity)} flex items-center justify-center`}>
                        <TrophyIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{milestone.name}</h4>
                        <p className="text-sm text-gray-400">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {isCompleted ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-400" />
                    ) : canMint ? (
                      <SparklesIcon className="h-8 w-8 text-yellow-400 animate-pulse" />
                    ) : (
                      <ClockIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{milestone.progress}/{milestone.target}</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full bg-gradient-to-r ${getRarityColor(milestone.rarity)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Reward Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${getChainColor(milestone.chain)}`}>
                      {milestone.chain}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${
                      milestone.rarity === 'Legendary' ? 'border-yellow-500/50 text-yellow-400' :
                      milestone.rarity === 'Epic' ? 'border-purple-500/50 text-purple-400' :
                      milestone.rarity === 'Rare' ? 'border-blue-500/50 text-blue-400' :
                      'border-gray-500/50 text-gray-400'
                    }`}>
                      {milestone.rarity}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{milestone.reward}</p>
                    {isCompleted ? (
                      <p className="text-xs text-green-400">Claimed!</p>
                    ) : canMint ? (
                      <p className="text-xs text-yellow-400">Ready to mint!</p>
                    ) : (
                      <p className="text-xs text-gray-400">
                        {milestone.target - milestone.progress} more to go
                      </p>
                    )}
                  </div>
                </div>

                {/* Mint Button */}
                {canMint && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMintAchievement(milestone)}
                    disabled={isMinting || nftLoading}
                    className={`w-full mt-4 py-3 bg-gradient-to-r ${getRarityColor(milestone.rarity)} text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isMinting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Minting NFT...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <SparklesIcon className="h-5 w-5" />
                        <span>Mint Achievement NFT</span>
                      </div>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Auto-Mint Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <SparklesIcon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">How Auto-Mint Works</span>
        </div>
        <div className="text-xs text-blue-200 space-y-1">
          <p>• NFTs are minted when you complete achievement milestones</p>
          <p>• Each NFT is unique and reflects your progress and stats</p>
          <p>• Cross-chain compatibility via ZetaChain Universal Smart Contracts</p>
          <p>• Achievement data is permanently stored on-chain</p>
        </div>
      </div>
    </div>
  )
}