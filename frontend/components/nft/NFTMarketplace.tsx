'use client'

import { useState } from 'react'
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

const marketplaceNFTs = [
  {
    id: 1,
    name: 'Legendary Trader #001',
    creator: 'CryptoMaster',
    image: '/api/placeholder/300/300',
    price: '2.5 ETH',
    usdPrice: '$4,250',
    chain: 'Ethereum',
    rarity: 'Legendary',
    likes: 128,
    views: 1234,
    timeLeft: '2d 14h',
    category: 'Achievement',
    isAuction: true
  },
  {
    id: 2,
    name: 'Cyber Dragon Pet',
    creator: 'GameFiGuru',
    image: '/api/placeholder/300/300',
    price: '0.8 ETH',
    usdPrice: '$1,360',
    chain: 'ZetaChain',
    rarity: 'Epic',
    likes: 89,
    views: 567,
    timeLeft: null,
    category: 'Pet',
    isAuction: false
  },
  {
    id: 3,
    name: 'Golden Post NFT',
    creator: 'SocialKing',
    image: '/api/placeholder/300/300',
    price: '0.3 ETH',
    usdPrice: '$510',
    chain: 'Polygon',
    rarity: 'Rare',
    likes: 234,
    views: 890,
    timeLeft: null,
    category: 'Social',
    isAuction: false
  },
  {
    id: 4,
    name: 'Quiz Master Badge',
    creator: 'BrainPower',
    image: '/api/placeholder/300/300',
    price: '1.2 ETH',
    usdPrice: '$2,040',
    chain: 'BSC',
    rarity: 'Epic',
    likes: 156,
    views: 678,
    timeLeft: '1d 8h',
    category: 'Achievement',
    isAuction: true
  },
  {
    id: 5,
    name: 'Prediction Oracle',
    creator: 'FortuneTeller',
    image: '/api/placeholder/300/300',
    price: '3.1 ETH',
    usdPrice: '$5,270',
    chain: 'ZetaChain',
    rarity: 'Legendary',
    likes: 345,
    views: 1567,
    timeLeft: '5h 23m',
    category: 'Trading',
    isAuction: true
  },
  {
    id: 6,
    name: 'Lucky Charm Booster',
    creator: 'CharmMaker',
    image: '/api/placeholder/300/300',
    price: '0.15 ETH',
    usdPrice: '$255',
    chain: 'Ethereum',
    rarity: 'Common',
    likes: 67,
    views: 234,
    timeLeft: null,
    category: 'Item',
    isAuction: false
  }
]

export function NFTMarketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedChain, setSelectedChain] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')

  const categories = ['all', 'achievement', 'pet', 'social', 'trading', 'item']
  const chains = ['all', 'ethereum', 'zetachain', 'polygon', 'bsc']
  const priceRanges = ['all', 'under-1', '1-5', 'over-5']

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

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || nft.category.toLowerCase() === selectedCategory
    const matchesChain = selectedChain === 'all' || nft.chain.toLowerCase() === selectedChain
    return matchesSearch && matchesCategory && matchesChain
  })

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
          <span>{filteredNFTs.length} items found</span>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4" />
            <span>Advanced filters</span>
          </div>
        </div>
      </div>

      {/* Hot Collections Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <FireIcon className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">🔥 Hot Collections</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'GameFi Heroes', floor: '0.8 ETH', change: '+15%' },
            { name: 'Crypto Oracles', floor: '1.2 ETH', change: '+8%' },
            { name: 'Social Badges', floor: '0.3 ETH', change: '+22%' }
          ].map((collection, index) => (
            <div key={index} className="bg-dark-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{collection.name}</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Floor: {collection.floor}</span>
                <span className="text-green-400">{collection.change}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft, index) => (
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
                <PhotoIcon className="h-20 w-20 text-gray-400" />
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

              {/* Like Button */}
              <div className="absolute top-3 right-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-dark-800/80 backdrop-blur-sm rounded-full p-2 hover:bg-red-500/20 transition-colors"
                >
                  <HeartIcon className="h-4 w-4 text-gray-400 hover:text-red-400" />
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
                  nft.category === 'Achievement' ? 'bg-yellow-500/20 text-yellow-400' :
                  nft.category === 'Pet' ? 'bg-green-500/20 text-green-400' :
                  nft.category === 'Social' ? 'bg-purple-500/20 text-purple-400' :
                  nft.category === 'Trading' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {nft.category}
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">by @{nft.creator}</p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <HeartIcon className="h-3 w-3" />
                    <span>{nft.likes}</span>
                  </span>
                  <span>{nft.views} views</span>
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
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    nft.isAuction
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  <ShoppingCartIcon className="h-4 w-4 inline mr-1" />
                  {nft.isAuction ? 'Place Bid' : 'Buy Now'}
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

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No NFTs found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
