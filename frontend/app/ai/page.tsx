'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  PaperAirplaneIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { ChatMessage } from '../../components/ai/ChatMessage'
import { AIFeatures } from '../../components/ai/AIFeatures'
import { MarketInsights } from '../../components/ai/MarketInsights'
import { TradingStrategy } from '../../components/ai/TradingStrategy'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m ZETA-AI, your personal GameFi assistant powered by Google Gemini. I can help you with trading strategies, market analysis, quiz questions, and much more. What would you like to explore today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    setNewMessage('')
    setIsLoading(true)

    try {
      // Simulate API call to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          playerStats: {
            accuracy: 75,
            totalPredictions: 45,
            currentStreak: 3
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again later. In the meantime, I can help you with trading strategies, market analysis, or answer any crypto-related questions!',
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

  const quickPrompts = [
    { text: "What's the current market sentiment?", icon: ChartBarIcon },
    { text: "Give me a trading strategy for beginners", icon: LightBulbIcon },
    { text: "Explain DeFi in simple terms", icon: DocumentTextIcon },
    { text: "How can I improve my prediction accuracy?", icon: SparklesIcon }
  ]

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
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Your intelligent companion powered by Google Gemini AI
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Features & Insights */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AIFeatures onFeatureClick={handleFeatureClick} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MarketInsights />
            </motion.div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl h-[600px] flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-dark-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">ZETA-AI</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400">Online</span>
                    </div>
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
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-dark-600">
                {/* Quick Prompts */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {quickPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFeatureClick(prompt.text)}
                      className="flex items-center space-x-2 p-2 bg-dark-700/50 hover:bg-dark-600 rounded-lg text-xs text-gray-300 transition-colors"
                    >
                      <prompt.icon className="h-3 w-3" />
                      <span className="truncate">{prompt.text}</span>
                    </motion.button>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask me anything about crypto, trading, or GameFi..."
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isLoading}
                    />
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <MicrophoneIcon className="h-5 w-5" />
                    </motion.button>
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
                  ZETA-AI can make mistakes. Consider checking important information.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Trading Strategy */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TradingStrategy />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
