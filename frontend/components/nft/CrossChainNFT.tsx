'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowsUpDownIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const supportedChains = [
  { id: 'zetachain', name: 'ZetaChain', logo: '⚡', color: 'bg-primary-500/20 text-primary-300' },
  { id: 'ethereum', name: 'Ethereum', logo: '🔷', color: 'bg-blue-500/20 text-blue-300' },
  { id: 'polygon', name: 'Polygon', logo: '🟣', color: 'bg-purple-500/20 text-purple-300' },
  { id: 'bsc', name: 'BSC', logo: '🟡', color: 'bg-yellow-500/20 text-yellow-300' },
  { id: 'arbitrum', name: 'Arbitrum', logo: '🔵', color: 'bg-blue-600/20 text-blue-300' },
  { id: 'avalanche', name: 'Avalanche', logo: '🔺', color: 'bg-red-500/20 text-red-300' }
]

const userNFTs = [
  { id: 1, name: 'Crypto Oracle #247', currentChain: 'zetachain', image: '/api/placeholder/100/100' },
  { id: 2, name: 'Quiz Master Badge', currentChain: 'ethereum', image: '/api/placeholder/100/100' },
  { id: 3, name: 'Trading Sensei', currentChain: 'bsc', image: '/api/placeholder/100/100' }
]

export function CrossChainNFT() {
  const [selectedNFT, setSelectedNFT] = useState(userNFTs[0])
  const [sourceChain, setSourceChain] = useState(selectedNFT.currentChain)
  const [targetChain, setTargetChain] = useState('ethereum')
  const [isTransferring, setIsTransferring] = useState(false)

  const handleTransfer = async () => {
    if (sourceChain === targetChain) {
      toast.error('Please select a different target chain')
      return
    }

    setIsTransferring(true)
    try {
      // Simulate cross-chain transfer
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('NFT transferred successfully!')
      
      // Update NFT current chain
      const updatedNFT = { ...selectedNFT, currentChain: targetChain }
      setSelectedNFT(updatedNFT)
      setSourceChain(targetChain)
      
    } catch (error) {
      toast.error('Transfer failed. Please try again.')
    } finally {
      setIsTransferring(false)
    }
  }

  const getChainInfo = (chainId: string) => {
    return supportedChains.find(chain => chain.id === chainId)
  }

  return (
    <div className="space-y-8">
      {/* Cross-Chain Benefits */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ArrowsUpDownIcon className="h-5 w-5 mr-2 text-blue-400" />
          Cross-Chain NFT Bridge
        </h3>
        <p className="text-blue-200 mb-4">
          Transfer your NFTs seamlessly between different blockchains using ZetaChain's Universal Smart Contracts. 
          No more being locked to a single chain!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'Multi-Chain Access', desc: 'Use NFTs across all supported chains' },
            { title: 'Lower Fees', desc: 'Optimized gas costs via ZetaChain' },
            { title: 'Instant Transfers', desc: 'Near real-time cross-chain bridging' },
            { title: 'Unified Wallet', desc: 'Manage all NFTs in one place' },
            { title: 'Market Access', desc: 'Sell on any chain marketplace' },
            { title: 'Composability', desc: 'Use NFTs in different dApps' }
          ].map((benefit, index) => (
            <div key={index} className="bg-dark-800/50 rounded-lg p-3">
              <h4 className="font-medium text-white text-sm mb-1">{benefit.title}</h4>
              <p className="text-xs text-gray-400">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Transfer Interface */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Transfer NFT</h3>

        {/* Select NFT */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Select NFT to Transfer</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userNFTs.map(nft => (
              <motion.div
                key={nft.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedNFT(nft)
                  setSourceChain(nft.currentChain)
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedNFT.id === nft.id 
                    ? 'border-primary-500/50 bg-primary-500/10' 
                    : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm">{nft.name}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-gray-400">On</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getChainInfo(nft.currentChain)?.color}`}>
                        {getChainInfo(nft.currentChain)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chain Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">From Chain</label>
            <div className={`border border-dark-600 rounded-lg p-4 ${getChainInfo(sourceChain)?.color} bg-opacity-20`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getChainInfo(sourceChain)?.logo}</span>
                <div>
                  <h4 className="font-medium text-white">{getChainInfo(sourceChain)?.name}</h4>
                  <p className="text-xs text-gray-400">Current location</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">To Chain</label>
            <select
              value={targetChain}
              onChange={(e) => setTargetChain(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg p-4"
            >
              {supportedChains
                .filter(chain => chain.id !== sourceChain)
                .map(chain => (
                  <option key={chain.id} value={chain.id}>
                    {chain.logo} {chain.name}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        {/* Transfer Arrow */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary-500/20 rounded-full p-3">
            <ArrowRightIcon className="h-6 w-6 text-primary-400" />
          </div>
        </div>

        {/* Transfer Details */}
        <div className="bg-dark-700/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-3">Transfer Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Bridge Fee:</span>
              <span className="text-white">0.001 ZETA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Gas Estimate:</span>
              <span className="text-white">~$2.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transfer Time:</span>
              <span className="text-white">~30 seconds</span>
            </div>
          </div>
        </div>

        {/* Transfer Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTransfer}
          disabled={isTransferring || sourceChain === targetChain}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isTransferring ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Transferring...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <ArrowsUpDownIcon className="h-5 w-5" />
              <span>Transfer NFT</span>
            </div>
          )}
        </motion.button>

        {/* Warning */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200 text-xs">
            <strong>⚠️ Important:</strong> Make sure the target chain supports the NFT standard. 
            Cross-chain transfers are irreversible once confirmed.
          </p>
        </div>
      </div>

      {/* Supported Chains */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Supported Networks</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {supportedChains.map(chain => (
            <motion.div
              key={chain.id}
              whileHover={{ scale: 1.05 }}
              className={`${chain.color} rounded-lg p-4 text-center border border-opacity-50`}
            >
              <div className="text-2xl mb-2">{chain.logo}</div>
              <p className="font-medium text-sm">{chain.name}</p>
              <div className="flex items-center justify-center mt-2">
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
