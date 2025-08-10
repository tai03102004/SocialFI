'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  GiftIcon, 
  TrophyIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { NFTCollection } from '../../components/nft/NFTCollection'
import { MintingProgress } from '../../components/nft/MintingProgress'
import { CrossChainNFT } from '../../components/nft/CrossChainNFT'
import { NFTMarketplace } from  '../../components/nft/NFTMarketplace'
import { RecentMints } from '../../components/nft/RecentMints'
import { NFTStats } from '../../components/nft/NFTStats'

export default function NFTPage() {
  const [activeTab, setActiveTab] = useState('collection')

  const tabs = [
    { id: 'collection', label: 'My Collection', icon: '🖼️' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'minting', label: 'Auto Mint', icon: '⚡' },
    { id: 'crosschain', label: 'Cross-Chain', icon: '🌉' }
  ]

  const milestones = [
    { 
      id: 1, 
      name: 'Market Warrior', 
      description: 'Complete 100 correct predictions',
      progress: 87,
      target: 100,
      reward: 'Legendary NFT',
      chain: 'ZetaChain',
      rarity: 'Legendary'
    },
    {
      id: 2,
      name: 'Quiz Master',
      description: 'Answer 500 quiz questions correctly',
      progress: 432,
      target: 500,
      reward: 'Epic NFT Pet',
      chain: 'Ethereum',
      rarity: 'Epic'
    },
    {
      id: 3,
      name: 'Social Influencer',
      description: 'Get 1000 likes on your posts',
      progress: 756,
      target: 1000,
      reward: 'Rare Profile NFT',
      chain: 'Polygon',
      rarity: 'Rare'
    },
    {
      id: 4,
      name: 'Trading Legend',
      description: 'Complete 50 successful trades',
      progress: 23,
      target: 50,
      reward: 'Mystic Trading Card',
      chain: 'BSC',
      rarity: 'Epic'
    }
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
            <span className="text-gradient">Cross-Chain NFTs</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Mint, collect, and trade NFTs across multiple blockchains with ZetaChain Universal Smart Contracts
          </motion.p>
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-purple-400" />
                Auto NFT Minting
              </h2>
              <p className="text-purple-200 mb-6">
                Achieve milestones and automatically receive unique NFTs minted on ZetaChain. 
                Transfer them seamlessly across Ethereum, BSC, Polygon, and more!
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  🏆 Achievement NFTs
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                  🎮 Gaming Items
                </span>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                  🐾 Virtual Pets
                </span>
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                  🎨 Profile Skins
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-dark-800/50 rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">Next Auto-Mint</h3>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                    <TrophyIcon className="h-10 w-10 text-white" />
                  </div>
                  <p className="font-semibold text-white">Market Warrior NFT</p>
                  <p className="text-sm text-gray-400">87/100 predictions completed</p>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-3">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '87%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-2 mb-8"
        >
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-[120px]
                  ${activeTab === tab.id 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
                  }
                `}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-600 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center space-x-2">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {activeTab === 'collection' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NFTCollection />
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NFTMarketplace />
              </motion.div>
            )}

            {activeTab === 'minting' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                <MintingProgress milestones={milestones} />
                
                {/* Post NFT Minting */}
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-pink-400" />
                    Mint Post NFTs
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-3">Social Post NFT</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Turn your viral posts into collectible NFTs. Perfect for memorable market calls or popular content.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Minting Fee:</span>
                          <span className="text-white">0.1 ZETA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Royalty:</span>
                          <span className="text-white">5%</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg font-medium"
                      >
                        Mint Post NFT
                      </motion.button>
                    </div>

                    <div className="bg-dark-700/50 border border-dark-600 rounded-lg p-6">
                      <h4 className="font-semibold text-white mb-3">Prediction NFT</h4>
                      <p className="text-gray-400 text-sm mb-4">
                        Immortalize your best predictions as NFTs. Show off your market expertise.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Minting Fee:</span>
                          <span className="text-white">0.05 ZETA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy Bonus:</span>
                          <span className="text-green-400">+10% value if &gt; 90%</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-medium"
                      >
                        Mint Prediction NFT
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'crosschain' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CrossChainNFT />
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* NFT Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <NFTStats />
            </motion.div>

            {/* Recent Mints */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RecentMints />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
