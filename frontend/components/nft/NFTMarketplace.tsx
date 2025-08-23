'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PhotoIcon, 
  HeartIcon,
  ShoppingCartIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { useNFTAchievements } from '../../hooks/useNFTAchievements'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

export function NFTMarketplace() {
  const [allNFTs, setAllNFTs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedChain, setSelectedChain] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [likedNFTs, setLikedNFTs] = useState<Set<number>>(new Set())

  const { getPlayerAchievements, loading } = useNFTAchievements()
  const { isConnected: walletConnected } = useAccount()

  const categories = ['all', 'achievement', 'prediction', 'social', 'ai', 'special']
  const chains = ['all', 'ethereum', 'zetachain', 'polygon', 'bsc']
  const priceRanges = ['all', 'under-1', '1-5', 'over-5']

  useEffect(() => {
    loadMarketplaceNFTs()
  }, [])

  const loadMarketplaceNFTs = async () => {
    try {
      setIsLoading(true)
      console.log('🛒 Loading marketplace NFTs...')

      // Simulate loading from multiple sources/users
      // In a real marketplace, you'd fetch from all users or a marketplace contract
      const mockMarketplaceNFTs = await generateMockMarketplaceData()
      
      // If user is connected, also include their NFTs
      if (walletConnected) {
        try {
          const userAchievements = await getPlayerAchievements()
          const userNFTs = userAchievements.map(achievement => ({
            id: achievement.tokenId,
            name: achievement.achievement.name,
            creator: 'You',
            image: '/api/placeholder/300/300',
            price: calculateNFTPrice(achievement.achievement),
            usdPrice: calculateUSDPrice(calculateNFTPrice(achievement.achievement)),
            chain: 'ZetaChain',
            rarity: getAchievementRarity(achievement.achievement.achievementType, achievement.achievement.requirement),
            likes: Math.floor(Math.random() * 200) + 10,
            views: Math.floor(Math.random() * 1000) + 100,
            timeLeft: null,
            category: getAchievementCategory(achievement.achievement.achievementType),
            isAuction: false,
            isOwned: true,
            achievement: achievement.achievement,
            description: achievement.achievement.description
          }))
          
          // Combine user NFTs with marketplace NFTs
          setAllNFTs([...userNFTs, ...mockMarketplaceNFTs])
        } catch (error) {
          console.error('Error loading user NFTs:', error)
          setAllNFTs(mockMarketplaceNFTs)
        }
      } else {
        setAllNFTs(mockMarketplaceNFTs)
      }

      console.log('✅ Marketplace NFTs loaded')
    } catch (error) {
      console.error('Failed to load marketplace:', error)
      toast.error('Failed to load marketplace')
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockMarketplaceData = async () => {
    // Generate realistic marketplace data based on achievement patterns
    const mockNFTs = [
      {
        id: 1001,
        name: 'Master Predictor #247',
        creator: 'CryptoOracle',
        image: '/api/placeholder/300/300',
        price: '2.5 ETH',
        usdPrice: '$4,250',
        chain: 'Ethereum',
        rarity: 'Legendary',
        likes: 328,
        views: 2134,
        timeLeft: '2d 14h',
        category: 'prediction',
        isAuction: true,
        isOwned: false,
        description: 'Achieved 95% prediction accuracy over 100 trades'
      },
      {
        id: 1002,
        name: 'Social Butterfly #089',
        creator: 'InfluencerKing',
        image: '/api/placeholder/300/300',
        price: '0.8 ETH',
        usdPrice: '$1,360',
        chain: 'ZetaChain',
        rarity: 'Epic',
        likes: 189,
        views: 967,
        timeLeft: null,
        category: 'social',
        isAuction: false,
        isOwned: false,
        description: 'Earned through 1000+ likes and community engagement'
      },
      {
        id: 1003,
        name: 'AI Alignment Expert #034',
        creator: 'TechSavant',
        image: '/api/placeholder/300/300',
        price: '1.2 ETH',
        usdPrice: '$2,040',
        chain: 'Polygon',
        rarity: 'Epic',
        likes: 256,
        views: 1278,
        timeLeft: '1d 8h',
        category: 'ai',
        isAuction: true,
        isOwned: false,
        description: 'Perfect AI recommendation following streak'
      },
      {
        id: 1004,
        name: 'Genesis Achievement #001',
        creator: 'EarlyAdopter',
        image: '/api/placeholder/300/300',
        price: '5.0 ETH',
        usdPrice: '$8,500',
        chain: 'ZetaChain',
        rarity: 'Legendary',
        likes: 445,
        views: 3567,
        timeLeft: '5h 23m',
        category: 'special',
        isAuction: true,
        isOwned: false,
        description: 'First ever achievement minted on the platform'
      },
      {
        id: 1005,
        name: 'Quiz Champion #156',
        creator: 'BrainMaster',
        image: '/api/placeholder/300/300',
        price: '0.3 ETH',
        usdPrice: '$510',
        chain: 'BSC',
        rarity: 'Rare',
        likes: 134,
        views: 890,
        timeLeft: null,
        category: 'achievement',
        isAuction: false,
        isOwned: false,
        description: 'Perfect scores on 50 consecutive quizzes'
      }
    ]

    return mockNFTs
  }

  const getAchievementRarity = (type: number, requirement: number): string => {
    if (requirement >= 100) return 'Legendary'
    if (requirement >= 50) return 'Epic'
    if (requirement >= 10) return 'Rare'
    return 'Common'
  }

  const getAchievementCategory = (type: number): string => {
    switch (type) {
      case 0: return 'prediction'
      case 1: return 'social'
      case 2: return 'ai'
      default: return 'achievement'
    }
  }

  const calculateNFTPrice = (achievement: any): string => {
    const basePrice = achievement.requirement * 0.01
    const rarityMultiplier = achievement.requirement >= 100 ? 2 : 
                            achievement.requirement >= 50 ? 1.5 : 
                            achievement.requirement >= 10 ? 1.2 : 1
    return `${(basePrice * rarityMultiplier).toFixed(2)} ETH`
  }

  const calculateUSDPrice = (ethPrice: string): string => {
    const eth = parseFloat(ethPrice.replace(' ETH', ''))
    return `$${Math.round(eth * 1700).toLocaleString()}`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-yellow-500/50 bg-yellow-500/10'
      case 'Epic': return 'border-purple-500/50 bg-purple-500/10'
      case 'Rare': return 'border-blue-500/50 bg-blue-500/10'
      default: return 'border-gray-500/50 bg-gray-500/10'
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

  const handleLike = (nftId: number) => {
    setLikedNFTs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nftId)) {
        newSet.delete(nftId)
        toast.success('Removed from favorites')
      } else {
        newSet.add(nftId)
        toast.success('Added to favorites')
      }
      return newSet
    })
  }

  const handleBuyNFT = (nft: any) => {
    if (nft.isOwned) {
      toast.error('You already own this NFT')
      return
    }
    
    toast.loading('Initiating purchase...', { id: 'buy' })
    
    // Simulate purchase process
    setTimeout(() => {
      toast.success(`Successfully purchased ${nft.name}!`, { id: 'buy' })
    }, 2000)
  }

  const filteredNFTs = allNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || nft.category.toLowerCase() === selectedCategory
    const matchesChain = selectedChain === 'all' || nft.chain.toLowerCase() === selectedChain
    return matchesSearch && matchesCategory && matchesChain
  })

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'popular':
        return b.likes - a.likes
      case 'ending':
        if (!a.timeLeft && !b.timeLeft) return 0
        if (!a.timeLeft) return 1
        if (!b.timeLeft) return -1
        return a.timeLeft.localeCompare(b.timeLeft)
      default:
        return b.id - a.id
    }
  })

  if (isLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-dark-700/30 rounded-xl overflow-hidden animate-pulse">
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search NFTs, creators..."
              className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {/* Chain Filter */}
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3"
          >
            {chains.map(chain => (
              <option key={chain} value={chain}>
                {chain === 'all' ? 'All Chains' : chain.charAt(0).toUpperCase() + chain.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-3"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="ending">Ending Soon</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{sortedNFTs.length} items found</span>
          <button 
            onClick={loadMarketplaceNFTs}
            disabled={isLoading}
            className="flex items-center space-x-2 hover:text-primary-400 disabled:opacity-50"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Marketplace Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FireIcon className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">🔥 Marketplace Stats</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Total NFTs', value: allNFTs.length.toLocaleString(), change: '+12%' },
            { name: 'Floor Price', value: '0.1 ETH', change: '+5%' },
            { name: 'Total Volume', value: '847 ETH', change: '+18%' },
            { name: 'Active Users', value: '1,234', change: '+8%' }
          ].map((stat, index) => (
            <div key={index} className="bg-dark-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{stat.name}</h4>
              <div className="flex justify-between text-sm">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-green-400">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${getRarityColor(nft.rarity)}`}
          >
            {/* NFT Image */}
            <div className="relative aspect-square">
              <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <div className="text-6xl">
                  {nft.category === 'prediction' ? '🎯' :
                   nft.category === 'social' ? '👥' :
                   nft.category === 'ai' ? '🤖' :
                   nft.category === 'special' ? '✨' : '🏆'}
                </div>
              </div>
              
              {/* Auction Timer */}
              {nft.isAuction && nft.timeLeft && (
                <div className="absolute top-3 left-3 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg px-2 py-1">
                  <div className="flex items-center space-x-1 text-red-300 text-xs">
                    <ClockIcon className="h-3 w-3" />
                    <span>{nft.timeLeft}</span>
                  </div>
                </div>
              )}

              {/* Owned Badge */}
              {nft.isOwned && (
                <div className="absolute top-3 left-3 bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg px-2 py-1">
                  <span className="text-green-300 text-xs font-medium">Owned</span>
                </div>
              )}

              {/* Like Button */}
              <div className="absolute top-3 right-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(nft.id)}
                  className={`backdrop-blur-sm rounded-full p-2 transition-colors ${
                    likedNFTs.has(nft.id) 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-dark-800/80 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                  }`}
                >
                  <HeartIcon className={`h-4 w-4 ${likedNFTs.has(nft.id) ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              {/* Chain Badge */}
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getChainColor(nft.chain)}`}>
                  {nft.chain}
                </span>
              </div>

              {/* Rarity Badge */}
              <div className="absolute bottom-3 right-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  nft.rarity === 'Legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                  nft.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                  nft.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                }`}>
                  {nft.rarity}
                </span>
              </div>
            </div>

            {/* NFT Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white truncate">{nft.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  nft.category === 'prediction' ? 'bg-blue-500/20 text-blue-400' :
                  nft.category === 'social' ? 'bg-purple-500/20 text-purple-400' :
                  nft.category === 'ai' ? 'bg-green-500/20 text-green-400' :
                  nft.category === 'special' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {nft.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-2">by @{nft.creator}</p>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">{nft.description}</p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <HeartIcon className={`h-3 w-3 ${likedNFTs.has(nft.id) ? 'text-red-400' : ''}`} />
                    <span>{nft.likes + (likedNFTs.has(nft.id) ? 1 : 0)}</span>
                  </span>
                  <span>{nft.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400">{nft.isAuction ? 'Current Bid' : 'Price'}</p>
                  <p className="font-semibold text-white">{nft.price}</p>
                  <p className="text-xs text-gray-500">{nft.usdPrice}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyNFT(nft)}
                  disabled={nft.isOwned}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    nft.isOwned 
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : nft.isAuction
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  <ShoppingCartIcon className="h-4 w-4 inline mr-1" />
                  {nft.isOwned ? 'Owned' : nft.isAuction ? 'Place Bid' : 'Buy Now'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  View
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedNFTs.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No NFTs found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          <button 
            onClick={loadMarketplaceNFTs}
            className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Refresh Marketplace
          </button>
        </div>
      )}
    </div>
  )
}