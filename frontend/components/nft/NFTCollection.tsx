'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, StarIcon, ShoppingBagIcon, ArrowsUpDownIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useNFTAchievements } from '../../hooks/useNFTAchievements'
import { useAccount } from 'wagmi'

export function NFTCollection() {
  const [nftCollection, setNftCollection] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isLoading, setIsLoading] = useState(true)

  const { getPlayerAchievements, loading, isConnected } = useNFTAchievements()
  const { isConnected: walletConnected } = useAccount()

  useEffect(() => {
    if (walletConnected && isConnected) {
      loadNFTCollection()
    }
  }, [walletConnected, isConnected])

  const loadNFTCollection = async () => {
    try {
      setIsLoading(true)
      console.log('🖼️ Loading NFT collection from blockchain...')
      
      const achievements = await getPlayerAchievements()
      
      // Convert blockchain achievements to frontend format
      const formattedNFTs = achievements.map((nft, index) => ({
        id: nft.tokenId,
        name: nft.achievement.name,
        image: '/api/placeholder/300/300',
        rarity: getAchievementRarity(nft.achievement.achievementType, nft.achievement.requirement),
        chain: 'ZetaChain', // All minted on ZetaChain initially
        earned: getEarnedDescription(nft.achievement.achievementType),
        stats: getAchievementStats(nft.achievement),
        value: calculateNFTValue(nft.achievement),
        achievement: nft.achievement
      }))
      
      console.log('✅ NFT collection loaded:', formattedNFTs)
      setNftCollection(formattedNFTs)
    } catch (error) {
      console.error('Failed to load NFT collection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAchievementRarity = (type: number, requirement: number): string => {
    if (requirement >= 100) return 'Legendary'
    if (requirement >= 50) return 'Epic'
    if (requirement >= 10) return 'Rare'
    return 'Common'
  }

  const getEarnedDescription = (type: number): string => {
    switch (type) {
      case 0: return 'Prediction Milestone'
      case 1: return 'Social Achievement'
      case 2: return 'AI Following Reward'
      default: return 'Special Achievement'
    }
  }

  const getAchievementStats = (achievement: any) => {
    switch (achievement.achievementType) {
      case 0: // Predictions
        return { predictions: achievement.requirement, accuracy: 85 }
      case 1: // Social
        return { posts: achievement.requirement, likes: achievement.requirement * 10 }
      case 2: // AI Following
        return { aiFollows: achievement.requirement, accuracy: 92 }
      default:
        return { level: 1, points: achievement.requirement }
    }
  }

  const calculateNFTValue = (achievement: any): string => {
    const baseValue = achievement.requirement * 0.01
    return `${baseValue.toFixed(2)} ETH`
  }

  const rarityColors = {
    'Legendary': 'border-yellow-500/50 bg-yellow-500/10',
    'Epic': 'border-purple-500/50 bg-purple-500/10',
    'Rare': 'border-blue-500/50 bg-blue-500/10',
    'Common': 'border-gray-500/50 bg-gray-500/10'
  }

  const chainColors = {
    'ZetaChain': 'bg-primary-500/20 text-primary-300',
    'Ethereum': 'bg-blue-500/20 text-blue-300',
    'Polygon': 'bg-purple-500/20 text-purple-300',
    'BSC': 'bg-yellow-500/20 text-yellow-300'
  }

  const filteredNFTs = nftCollection.filter(nft => {
    if (filter === 'all') return true
    return nft.rarity.toLowerCase() === filter
  })

  if (!walletConnected) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 text-center">
        <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Connect your wallet to view your NFT collection</p>
      </div>
    )
  }

  if (isLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-dark-700/30 rounded-xl overflow-hidden">
                <div className="aspect-square bg-gray-600"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-8 bg-gray-600 rounded"></div>
                    <div className="h-8 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{nftCollection.length}</p>
          <p className="text-sm text-gray-400">Total NFTs</p>
        </div>
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {nftCollection.filter(nft => nft.rarity === 'Legendary').length}
          </p>
          <p className="text-sm text-gray-400">Legendary</p>
        </div>
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {nftCollection.reduce((sum, nft) => sum + parseFloat(nft.value), 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">Total Value (ETH)</p>
        </div>
        <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-4 text-center">
          <button 
            onClick={loadNFTCollection}
            disabled={loading}
            className="text-primary-400 hover:text-primary-300 font-medium disabled:opacity-50"
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Rarities</option>
              <option value="legendary">Legendary</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="common">Common</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="rarity">By Rarity</option>
              <option value="value">By Value</option>
              <option value="name">By Name</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {filteredNFTs.length} of {nftCollection.length} NFTs
        </div>
      </div>

      {/* NFT Grid */}
      {filteredNFTs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${rarityColors[nft.rarity as keyof typeof rarityColors]}`}
            >
              {/* NFT Image */}
              <div className="relative aspect-square">
                <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <TrophyIcon className="h-20 w-20 text-gray-400" />
                </div>
                
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    nft.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    nft.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                    nft.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                  }`}>
                    {nft.rarity}
                  </span>
                </div>

                {/* Chain Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${chainColors[nft.chain as keyof typeof chainColors]}`}>
                    {nft.chain}
                  </span>
                </div>

                {/* Token ID */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-dark-800/80 text-gray-300">
                    #{nft.id}
                  </span>
                </div>
              </div>

              {/* NFT Details */}
              <div className="p-6">
                <h3 className="font-semibold text-white mb-2">{nft.name}</h3>
                <p className="text-sm text-gray-400 mb-4">Earned from: {nft.earned}</p>

                {/* Achievement Details */}
                <div className="bg-dark-700/30 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Achievement Progress</p>
                  <p className="text-sm text-white font-medium">
                    Requirement: {nft.achievement.requirement} {getEarnedDescription(nft.achievement.achievementType).toLowerCase()}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {Object.entries(nft.stats).map(([key, value]) => (
                    <div key={key} className="bg-dark-700/50 rounded-lg p-2">
                      <p className="text-gray-400 capitalize">{key}:</p>
                      <p className="text-white font-semibold">{String(value)}{key.includes('accuracy') ? '%' : ''}</p>
                    </div>
                  ))}
                </div>

                {/* Value */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Estimated Value</p>
                    <p className="font-semibold text-green-400">{nft.value}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Owned</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ShoppingBagIcon className="h-4 w-4 inline mr-1" />
                    List for Sale
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ArrowsUpDownIcon className="h-4 w-4 inline mr-1" />
                    Transfer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Achievement NFTs Yet</h3>
          <p className="text-gray-400 mb-6">Complete milestones to earn your first NFT achievement!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-dark-700/30 border border-dark-600 rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium text-white text-sm mb-1">First Prediction</h4>
              <p className="text-xs text-gray-400">Make your first AI-guided prediction</p>
            </div>
            <div className="bg-dark-700/30 border border-dark-600 rounded-lg p-4">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium text-white text-sm mb-1">Social Starter</h4>
              <p className="text-xs text-gray-400">Create your first post</p>
            </div>
            <div className="bg-dark-700/30 border border-dark-600 rounded-lg p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-medium text-white text-sm mb-1">AI Follower</h4>
              <p className="text-xs text-gray-400">Follow AI recommendations 5 times</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}