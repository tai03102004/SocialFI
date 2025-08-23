'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useNFTAchievements } from '../../hooks/useNFTAchievements'
import { useAccount } from 'wagmi'

export function RecentMints() {
  const [recentMints, setRecentMints] = useState<any[]>([])
  const [globalStats, setGlobalStats] = useState({
    today: 0,
    thisWeek: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const { getPlayerAchievements, loading } = useNFTAchievements()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    loadRecentMints()
    // Set up interval to simulate live updates
    const interval = setInterval(loadRecentMints, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [isConnected])

  const loadRecentMints = async () => {
    try {
      setIsLoading(true)
      console.log('📡 Loading recent NFT mints...')

      let userMints: any[] = []
      
      // Load user's own achievements if connected
      if (isConnected && address) {
        try {
          const achievements = await getPlayerAchievements()
          
          userMints = achievements.map((achievement, index) => ({
            id: achievement.tokenId,
            name: achievement.achievement.name,
            type: getAchievementType(achievement.achievement.achievementType),
            chain: 'ZetaChain',
            rarity: getAchievementRarity(achievement.achievement.achievementType, achievement.achievement.requirement),
            mintedAt: getMockTimestamp(index), // Mock timestamp since we don't have real mint time
            trigger: getAchievementTrigger(achievement.achievement),
            value: calculateNFTValue(achievement.achievement),
            isOwn: true,
            achievement: achievement.achievement
          }))
        } catch (error) {
          console.error('Error loading user achievements:', error)
        }
      }

      // Generate mock recent mints from other users to simulate network activity
      const mockNetworkMints = generateMockNetworkActivity()
      
      // Combine and sort by recency
      const allMints = [...userMints, ...mockNetworkMints]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10) // Show only 10 most recent

      setRecentMints(allMints)

      // Calculate global stats
      const now = new Date()
      const todayMints = allMints.filter(mint => {
        const mintDate = new Date(mint.timestamp)
        return mintDate.toDateString() === now.toDateString()
      }).length

      const thisWeekMints = allMints.filter(mint => {
        const mintDate = new Date(mint.timestamp)
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return mintDate >= weekAgo
      }).length

      setGlobalStats({
        today: todayMints,
        thisWeek: thisWeekMints,
        total: userMints.length + 1289 // Add mock total
      })

      console.log('✅ Recent mints loaded:', allMints.length)
    } catch (error) {
      console.error('Failed to load recent mints:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAchievementType = (type: number): string => {
    switch (type) {
      case 0: return 'Prediction NFT'
      case 1: return 'Social NFT'
      case 2: return 'AI Following NFT'
      default: return 'Achievement NFT'
    }
  }

  const getAchievementRarity = (type: number, requirement: number): string => {
    if (requirement >= 100) return 'Legendary'
    if (requirement >= 50) return 'Epic'
    if (requirement >= 10) return 'Rare'
    return 'Common'
  }

  const getAchievementTrigger = (achievement: any): string => {
    switch (achievement.achievementType) {
      case 0: 
        return `${achievement.requirement} correct predictions`
      case 1:
        return `${achievement.requirement} social interactions`
      case 2:
        return `${achievement.requirement} AI recommendations followed`
      default:
        return `Completed ${achievement.name} challenge`
    }
  }

  const calculateNFTValue = (achievement: any): string => {
    const baseValue = achievement.requirement * 0.01
    const typeMultiplier = achievement.achievementType === 0 ? 1.5 : 
                          achievement.achievementType === 1 ? 1.2 : 
                          achievement.achievementType === 2 ? 1.3 : 1
    
    const rarityMultiplier = achievement.requirement >= 100 ? 2 : 
                            achievement.requirement >= 50 ? 1.5 : 
                            achievement.requirement >= 10 ? 1.2 : 1
    
    const finalValue = baseValue * typeMultiplier * rarityMultiplier
    return `${finalValue.toFixed(3)} ETH`
  }

  const getMockTimestamp = (index: number): string => {
    const now = new Date()
    const minutesAgo = (index + 1) * 15 // Each older by 15 minutes
    return new Date(now.getTime() - minutesAgo * 60000).toISOString()
  }

  const generateMockNetworkActivity = () => {
    const mockMints = [
      {
        id: 9001,
        name: 'Market Prophet #456',
        type: 'Prediction NFT',
        chain: 'ZetaChain',
        rarity: 'Epic',
        mintedAt: '2 min ago',
        trigger: '25 consecutive correct predictions',
        value: '1.2 ETH',
        isOwn: false,
        timestamp: new Date(Date.now() - 2 * 60000).toISOString()
      },
      {
        id: 9002,
        name: 'Community Leader #89',
        type: 'Social NFT',
        chain: 'ZetaChain',
        rarity: 'Rare',
        trigger: '500 helpful community interactions',
        value: '0.6 ETH',
        isOwn: false,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        mintedAt: '5 min ago'
      },
      {
        id: 9003,
        name: 'AI Whisperer #234',
        type: 'AI Following NFT',
        chain: 'ZetaChain',
        rarity: 'Legendary',
        trigger: '100% AI recommendation accuracy',
        value: '2.5 ETH',
        isOwn: false,
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        mintedAt: '8 min ago'
      },
      {
        id: 9004,
        name: 'Quiz Genius #123',
        type: 'Knowledge NFT',
        chain: 'ZetaChain',
        rarity: 'Epic',
        trigger: 'Perfect quiz streak (14 days)',
        value: '1.8 ETH',
        isOwn: false,
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        mintedAt: '15 min ago'
      },
      {
        id: 9005,
        name: 'Early Bird #67',
        type: 'Special NFT',
        chain: 'ZetaChain',
        rarity: 'Common',
        trigger: 'Joined platform in beta',
        value: '0.3 ETH',
        isOwn: false,
        timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
        mintedAt: '22 min ago'
      }
    ]

    return mockMints
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Epic': return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'Rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Prediction NFT': return '🎯'
      case 'Social NFT': return '👥'
      case 'AI Following NFT': return '🤖'
      case 'Knowledge NFT': return '🧠'
      case 'Special NFT': return '✨'
      default: return '🏆'
    }
  }

  if (isLoading || loading) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-600 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-600 rounded-full w-16 animate-pulse"></div>
        </div>
        
        <div className="space-y-4 max-h-96">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-dark-700/30 rounded-lg p-4 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-600 rounded w-full mb-2"></div>
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
          <SparklesIcon className="h-5 w-5 mr-2 text-green-400" />
          Recent Auto-Mints
        </h3>
        <div className="flex items-center space-x-2 bg-green-500/20 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentMints.length > 0 ? (
          recentMints.map((mint, index) => (
            <motion.div
              key={`${mint.id}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className={`border rounded-lg p-4 transition-all duration-300 ${
                mint.isOwn 
                  ? 'bg-primary-500/10 border-primary-500/30' 
                  : 'bg-dark-700/30 border-dark-600 hover:border-primary-500/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-lg flex items-center justify-center text-lg">
                    {getTypeIcon(mint.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-white text-sm">{mint.name}</h4>
                      {mint.isOwn && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          Yours
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{mint.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <ClockIcon className="h-3 w-3" />
                    <span>{mint.mintedAt}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getChainColor(mint.chain)}`}>
                    {mint.chain}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getRarityColor(mint.rarity)}`}>
                    {mint.rarity}
                  </span>
                </div>
                
                <p className="text-xs text-gray-300 leading-relaxed">
                  <strong>Trigger:</strong> {mint.trigger}
                </p>
              </div>

              {/* Value */}
              <div className="flex items-center justify-between pt-3 border-t border-dark-600">
                <div className="text-xs text-gray-400">
                  Estimated Value
                </div>
                <div className="text-sm font-semibold text-green-400">
                  {mint.value}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-white font-semibold mb-2">No Recent Mints</h4>
            <p className="text-gray-400 text-sm mb-4">
              {isConnected 
                ? "Complete achievements to see your NFT mints here!" 
                : "Connect your wallet to see your recent NFT mints"
              }
            </p>
          </div>
        )}
      </div>

      {/* Global Stats */}
      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-purple-400">{globalStats.today}</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-400">{globalStats.thisWeek}</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-400">{globalStats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
        </div>
      </div>

      {/* Auto-Mint Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
          <TrophyIcon className="h-4 w-4 mr-1" />
          Live Auto-Minting Network
        </h4>
        <ul className="text-xs text-blue-200 space-y-1">
          <li>• Real-time NFT minting based on blockchain achievements</li>
          <li>• Cross-chain distribution via ZetaChain Universal Smart Contracts</li>
          <li>• {isConnected ? 'Your achievements' : 'User achievements'} are automatically detected and minted</li>
          <li>• Network stats update every 30 seconds</li>
        </ul>
      </div>
    </div>
  )
}