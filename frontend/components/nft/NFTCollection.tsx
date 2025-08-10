'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon, StarIcon, ShoppingBagIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'

const nftCollection = [
  {
    id: 1,
    name: 'Crypto Oracle #247',
    image: '/api/placeholder/300/300',
    rarity: 'Legendary',
    chain: 'ZetaChain',
    earned: 'Prediction Milestone',
    stats: { accuracy: 94, predictions: 150 },
    value: '2.5 ETH'
  },
  {
    id: 2,
    name: 'Quiz Master Badge',
    image: '/api/placeholder/300/300',
    rarity: 'Epic',
    chain: 'Ethereum',
    earned: 'Knowledge Challenge',
    stats: { questions: 500, accuracy: 87 },
    value: '0.8 ETH'
  },
  {
    id: 3,
    name: 'Social Butterfly',
    image: '/api/placeholder/300/300',
    rarity: 'Rare',
    chain: 'Polygon',
    earned: 'Community Engagement',
    stats: { likes: 1000, posts: 50 },
    value: '0.3 ETH'
  },
  {
    id: 4,
    name: 'Trading Sensei',
    image: '/api/placeholder/300/300',
    rarity: 'Epic',
    chain: 'BSC',
    earned: 'Trading Excellence',
    stats: { trades: 100, winRate: 78 },
    value: '1.2 ETH'
  },
  {
    id: 5,
    name: 'Cyber Pet Dragon',
    image: '/api/placeholder/300/300',
    rarity: 'Legendary',
    chain: 'ZetaChain',
    earned: 'Premium Reward',
    stats: { level: 25, power: 950 },
    value: '3.1 ETH'
  },
  {
    id: 6,
    name: 'Golden Prediction',
    image: '/api/placeholder/300/300',
    rarity: 'Rare',
    chain: 'Ethereum',
    earned: 'Perfect Week',
    stats: { accuracy: 100, streak: 7 },
    value: '0.5 ETH'
  }
]

export function NFTCollection() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

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

  return (
    <div className="space-y-6">
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
                <PhotoIcon className="h-20 w-20 text-gray-400" />
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
            </div>

            {/* NFT Details */}
            <div className="p-6">
              <h3 className="font-semibold text-white mb-2">{nft.name}</h3>
              <p className="text-sm text-gray-400 mb-4">Earned from: {nft.earned}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                {Object.entries(nft.stats).map(([key, value]) => (
                  <div key={key} className="bg-dark-700/50 rounded-lg p-2">
                    <p className="text-gray-400 capitalize">{key}:</p>
                    <p className="text-white font-semibold">{value}{key.includes('accuracy') || key.includes('winRate') ? '%' : ''}</p>
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
                  Sell
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

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No NFTs found</p>
          <p className="text-gray-500 text-sm">Complete milestones to earn your first NFT!</p>
        </div>
      )}
    </div>
  )
}
