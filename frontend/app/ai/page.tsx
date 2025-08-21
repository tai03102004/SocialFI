'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  PaperAirplaneIcon,
  CogIcon,
  ServerIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { ChatMessage } from '../../components/ai/ChatMessage'
import { AIFeatures } from '../../components/ai/AIFeatures'
import { useGameFi } from '../../hooks/useEnhancedContract'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

const convertBigIntStats = (rawStats: any) => {
  return {
    accuracy: rawStats?.accuracy ? Number(rawStats.accuracy) : 0,
    totalPredictions: rawStats?.totalPredictions ? Number(rawStats.totalPredictions) : 0,
    correctPredictions: rawStats?.correctPredictions ? Number(rawStats.correctPredictions) : 0,
    currentStreak: 0,
    score: rawStats?.score ? Number(rawStats.score) : 0,
    aiFollowScore: rawStats?.aiFollowScore ? Number(rawStats.aiFollowScore) : 0
  }
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m ZETA-AI, powered by advanced RAG and GraphRAG technology. I have access to comprehensive crypto knowledge and can provide personalized advice based on your performance. What would you like to explore today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useRAG, setUseRAG] = useState(true)
  const [useGraph, setUseGraph] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { getPlayerStats } = useGameFi()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    }
  
    setMessages(prev => [...prev, userMessage])
    const messageToSend = newMessage
    setNewMessage('')
    setIsLoading(true)
  
    let playerStats = null

    try {
      const rawStats = await getPlayerStats()
      console.log('Raw Player Stats:', rawStats)
      playerStats = convertBigIntStats(rawStats)
      console.log('Converted Player Stats:', playerStats)
    } catch (statError) {
      console.warn('Could not get player stats:', statError)
      playerStats = convertBigIntStats(null) 
    }

    
    try {
      // Try to get player stats, but don't fail if it doesn't work
      const rawStats = await getPlayerStats()
      console.log('Raw Player Stats:', rawStats)
      
      // ✅ Convert BigInt to regular numbers for JSON serialization
      playerStats = {
        accuracy: Number(rawStats.accuracy),
        totalPredictions: Number(rawStats.totalPredictions),
        correctPredictions: Number(rawStats.correctPredictions),
        currentStreak: 0, // Add default if not in contract
        score: Number(rawStats.score),
        aiFollowScore: Number(rawStats.aiFollowScore)
      }
      
      console.log('Converted Player Stats:', playerStats)
    } catch (statError) {
      console.warn('Could not get player stats:', statError)
      playerStats = {
        accuracy: 0,
        totalPredictions: 0,
        correctPredictions: 0,
        currentStreak: 0,
        score: 0,
        aiFollowScore: 0
      }
    }
  
    try {
      console.log("Use RAG:", useRAG)
      console.log("Use Graph:", useGraph)
  
      const requestBody = {
        message: messageToSend,
        playerStats: playerStats,
        useRAG: useRAG,
        useGraph: useGraph
      }
  
      console.log('Sending request:', requestBody)
  
      const response = await fetch('http://localhost:3002/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),        
      })
  
      console.log('Response status:', response.status)
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
  
      const data = await response.json()
      console.log('Response data:', data)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || data.message || 'I received your message but had trouble generating a response. Please try again.',
        isUser: false,
        timestamp: new Date()
      }
  
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      
      // Create detailed error message based on error type
      let errorContent = 'I\'m having trouble right now. '
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorContent += 'Cannot connect to the AI service. Please check if the backend is running.'
        } else if (error.message.includes('HTTP error')) {
          errorContent += 'The AI service returned an error. Please try again.'
        } else if (error.message.includes('BigInt')) {
          errorContent += 'There was an issue processing your game data. Please try again.'
        } else {
          errorContent += 'An unexpected error occurred. Please try again.'
        }
      } else {
        errorContent += 'Please try asking your question again.'
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeatureClick = (prompt: string) => {
    setNewMessage(prompt)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            <span className="text-gradient">ZETA-AI Assistant</span>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">RAG Enabled</span>
              <span className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full">GraphRAG</span>
            </div>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Advanced AI with Retrieval-Augmented Generation & Graph Knowledge
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - AI Settings & Features */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-primary-400" />
                AI Configuration
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">RAG Knowledge</p>
                    <p className="text-xs text-gray-400">Use knowledge base</p>
                  </div>
                  <button
                    onClick={() => setUseRAG(!useRAG)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      useRAG ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        useRAG ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Graph Insights</p>
                    <p className="text-xs text-gray-400">Entity relationships</p>
                  </div>
                  <button
                    onClick={() => setUseGraph(!useGraph)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      useGraph ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        useGraph ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ServerIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Knowledge Status</span>
                </div>
                <div className="text-xs text-blue-200 space-y-1">
                  <p>• {useRAG ? '✅' : '❌'} Vector Database: {useRAG ? 'Active' : 'Disabled'}</p>
                  <p>• {useGraph ? '✅' : '❌'} Graph Database: {useGraph ? 'Active' : 'Disabled'}</p>
                  <p>• 📚 Knowledge Base: 18 crypto docs</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AIFeatures onFeatureClick={handleFeatureClick} />
            </motion.div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl h-[700px] flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">ZETA-AI</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400">Enhanced with RAG</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {useRAG && (
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                        Knowledge Base
                      </div>
                    )}
                    {useGraph && (
                      <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                        Graph AI
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-dark-700 rounded-2xl px-4 py-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {useRAG && useGraph ? 'Analyzing knowledge & graph...' :
                           useRAG ? 'Searching knowledge base...' :
                           useGraph ? 'Querying graph database...' :
                           'Processing...'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-dark-600">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask about crypto, trading, DeFi, GameFi, or anything..."
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isLoading}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={!newMessage.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-4 py-3 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </motion.button>
                </form>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Enhanced with RAG and GraphRAG for accurate, contextual responses
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}