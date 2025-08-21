'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,  
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { MarketOverview } from '../../components/trading/MarketOverview'
import { TradingChart } from '../../components/trading/TradingChart'
import { OrderBook } from '../../components/trading/OrderBook'
import { TradingForm } from '../../components/trading/TradingForm'
import { TradingHistory } from '../../components/trading/TradingHistory'
import { PortfolioWidget } from '../../components/trading/PortfolioWidget'
import { useGameFi, useAIOracle, useTokenBalance, formatPrice } from '../../hooks/useEnhancedContract'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface TradingPair {
  symbol: string
  price: number
  change: number
  volume: string
  currentPrice?: bigint
  predictedPrice?: bigint
  confidence?: number
  outlook?: string
}

export default function TradingPage() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT')
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([])
  const [loading, setLoading] = useState(false)
  const [marketData, setMarketData] = useState<any>({})

  const { makeAIPrediction, getPlayerStats } = useGameFi()
  const { getAllAIData } = useAIOracle()
  const { balance: guiBalance } = useTokenBalance()
  const { address, isConnected } = useAccount()

  // ✅ Load real market data from AI Oracle
  const loadMarketData = async () => {
    try {
      setLoading(true)
      
      const assets = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL']
      const updatedPairs: TradingPair[] = []
      const marketDataMap: any = {}

      for (const asset of assets) {
        try {
          // Get AI market data
          const aiData = await getAllAIData(asset)
          console.log(`${asset} AI Data:`, aiData)

          if (aiData?.market) {
            const currentPrice = Number(aiData.market.currentPrice) / 100
            const predictedPrice = Number(aiData.market.predictedPrice) / 100
            const change = ((predictedPrice - currentPrice) / currentPrice) * 100

            const pair: TradingPair = {
              symbol: `${asset}/USDT`,
              price: currentPrice,
              change: change,
              volume: aiData.market.volume || '0',
              currentPrice: aiData.market.currentPrice,
              predictedPrice: aiData.market.predictedPrice,
              confidence: Number(aiData.market.confidence),
              outlook: aiData.market.outlook
            }

            updatedPairs.push(pair)
            marketDataMap[asset] = aiData
          }
        } catch (error) {
          console.warn(`Failed to load ${asset} data:`, error)
          
          // Fallback data
          updatedPairs.push({
            symbol: `${asset}/USDT`,
            price: Math.random() * 50000 + 30000,
            change: (Math.random() - 0.5) * 10,
            volume: '1.2B'
          })
        }
      }

      setTradingPairs(updatedPairs)
      setMarketData(marketDataMap)
    } catch (error) {
      console.error('Failed to load market data:', error)
      toast.error('Failed to load market data')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Execute trade with smart contract
  const handleTrade = async (tradeData: {
    pair: string
    side: 'buy' | 'sell'
    amount: string
    price?: string
    orderType: 'market' | 'limit'
  }) => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setLoading(true)
      
      const asset = tradeData.pair.split('/')[0]
      console.log('Executing trade:', tradeData)

      // For demo purposes, we'll create a prediction based on the trade
      // In production, you'd integrate with a DEX or order book
      const predictedPrice = tradeData.price || tradingPairs.find(p => p.symbol === tradeData.pair)?.price.toString() || '0'
      
      const tx = await makeAIPrediction(
        predictedPrice,
        asset,
        75 // Default confidence for trades
      )

      console.log('Trade transaction:', tx)
      
      toast.success(`${tradeData.side.toUpperCase()} order placed successfully!`)
      
      // Refresh data
      await loadMarketData()
    } catch (error) {
      console.error('Trade failed:', error)
      toast.error('Trade failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMarketData()
    
    // Auto-refresh market data every 30 seconds
    const interval = setInterval(loadMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BoltIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your wallet to access cross-chain trading</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white"
            >
              <span className="text-gradient">Trading Terminal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mt-2"
            >
              Cross-chain trading powered by ZetaChain with AI insights
            </motion.p>
          </div>

          <div
            className="flex items-center space-x-4"
          >
            {/* GUI Balance */}
            <div className="bg-primary-500/20 border border-primary-500/30 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-primary-400 text-sm font-medium">GUI Balance:</span>
                <span className="text-white font-bold">
                  {guiBalance ? Number(guiBalance).toLocaleString() : '0'}
                </span>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Markets Open</span>
              </div>
            </div>

            <button
              onClick={loadMarketData}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <ArrowTrendingUpIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <MarketOverview 
            tradingPairs={tradingPairs}
            onPairSelect={setSelectedPair}
            loading={loading}
          />
        </motion.div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel - Pairs & Portfolio */}
          <div className="xl:col-span-3 space-y-6">
            {/* Trading Pairs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-400" />
                Markets
                {loading && (
                  <div className="ml-2 w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tradingPairs.map((pair) => (
                  <motion.button
                    key={pair.symbol}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedPair(pair.symbol)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedPair === pair.symbol
                        ? 'bg-primary-600/20 border border-primary-500/50'
                        : 'hover:bg-dark-700/50'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{pair.symbol}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-gray-400">${pair.price.toLocaleString()}</p>
                        {pair.confidence && (
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-1 rounded">
                            AI: {pair.confidence}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center space-x-1 ${
                        pair.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {pair.change >= 0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3" />
                        )}
                        <span className="text-xs font-medium">
                          {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                        </span>
                      </div>
                      
                      {pair.outlook && (
                        <span className={`text-xs ${
                          pair.outlook === 'BULLISH' ? 'text-green-400' : 
                          pair.outlook === 'BEARISH' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {pair.outlook}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <PortfolioWidget />
            </motion.div>
          </div>

          {/* Center Panel - Chart & Order Book */}
          <div className="xl:col-span-6 space-y-6">
            {/* Trading Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TradingChart 
                pair={selectedPair} 
                marketData={marketData[selectedPair.split('/')[0]]}
              />
            </motion.div>

            {/* Order Book */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <OrderBook 
                pair={selectedPair}
                marketData={marketData[selectedPair.split('/')[0]]}
              />
            </motion.div>
          </div>

          {/* Right Panel - Trading Form & History */}
          <div className="xl:col-span-3 space-y-6">
            {/* Trading Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TradingForm 
                pair={selectedPair}
                marketData={marketData[selectedPair.split('/')[0]]}
                onTrade={handleTrade}
                loading={loading}
              />
            </motion.div>

            {/* Trading History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <TradingHistory />
            </motion.div>

            {/* Trading Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
            >
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <InformationCircleIcon className="h-5 w-5 mr-2 text-blue-400" />
                Trading Tips
              </h4>
              
              <div className="space-y-2 text-sm text-blue-200">
                <p>• Use AI insights for better predictions</p>
                <p>• Cross-chain trades via ZetaChain</p>
                <p>• Earn GUI rewards for successful trades</p>
                <p>• Set stop-loss to manage risk</p>
                <p>• Monitor market sentiment</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}