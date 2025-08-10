'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AcademicCapIcon, 
  ClockIcon, 
  TrophyIcon, 
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { QuizCard } from '../../components/quiz/QuizCard'
import { QuizStats } from '../../components/quiz/QuizStats'
import { QuizHistory } from '../../components/quiz/QuizHistory'

const mockQuiz = {
  id: 1,
  questions: [
    {
      id: 1,
      question: "What is the maximum supply of Bitcoin?",
      options: ["21 million", "100 million", "1 billion", "Unlimited"],
      correctAnswer: 0,
      explanation: "Bitcoin has a hard cap of 21 million coins, making it a deflationary asset."
    },
    {
      id: 2,
      question: "What consensus mechanism does Ethereum 2.0 use?",
      options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
      correctAnswer: 1,
      explanation: "Ethereum 2.0 transitioned from Proof of Work to Proof of Stake to improve energy efficiency."
    },
    {
      id: 3,
      question: "What does DeFi stand for?",
      options: ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Direct Finance"],
      correctAnswer: 1,
      explanation: "DeFi stands for Decentralized Finance, referring to financial services built on blockchain."
    }
  ],
  difficulty: 'medium',
  category: 'general',
  timeLimit: 30
}

export default function QuizPage() {
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [selectedCategory, setSelectedCategory] = useState('general')

  const difficulties = [
    { id: 'easy', label: 'Easy', color: 'text-green-400', reward: '25 GUI' },
    { id: 'medium', label: 'Medium', color: 'text-yellow-400', reward: '50 GUI' },
    { id: 'hard', label: 'Hard', color: 'text-red-400', reward: '100 GUI' }
  ]

  const categories = [
    { id: 'general', label: 'General Crypto', icon: '🪙' },
    { id: 'defi', label: 'DeFi', icon: '🏦' },
    { id: 'nft', label: 'NFTs', icon: '🎨' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'technology', label: 'Technology', icon: '⚙️' }
  ]

  const startQuiz = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to generate quiz
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentQuiz(mockQuiz)
    } catch (error) {
      console.error('Failed to load quiz:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuizComplete = (results: any) => {
    console.log('Quiz completed:', results)
    setCurrentQuiz(null)
  }

  if (currentQuiz) {
    return <QuizCard quiz={currentQuiz} onComplete={handleQuizComplete} />
  }

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
            <span className="text-gradient">Crypto Quiz</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Test your crypto knowledge and earn GUI tokens
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quiz Setup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AcademicCapIcon className="h-7 w-7 mr-3 text-primary-400" />
                Start New Quiz
              </h2>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Select Difficulty</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map((diff) => (
                    <motion.button
                      key={diff.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedDifficulty === diff.id
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                      }`}
                    >
                      <div className="text-center">
                        <h4 className={`text-lg font-semibold ${diff.color} mb-2`}>
                          {diff.label}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">Reward: {diff.reward}</p>
                        <div className="flex justify-center">
                          {Array.from({ length: diff.id === 'easy' ? 1 : diff.id === 'medium' ? 2 : 3 }).map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${diff.color}`} />
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Select Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-xl border transition-all ${
                        selectedCategory === category.id
                          ? 'border-secondary-500 bg-secondary-500/20'
                          : 'border-dark-600 bg-dark-700/30 hover:border-dark-500'
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-2xl block mb-2">{category.icon}</span>
                        <span className="text-sm text-white font-medium">{category.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuiz}
                  disabled={isLoading}
                  className="btn-primary text-lg px-12 py-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Generating Quiz...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FireIcon className="h-6 w-6" />
                      <span>Start Quiz</span>
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-medium mb-1">Quiz Rules:</p>
                    <ul className="space-y-1 text-blue-300">
                      <li>• 5 questions per quiz</li>
                      <li>• 30 seconds per question</li>
                      <li>• Earn bonus for streak answers</li>
                      <li>• Daily cooldown: 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quiz Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuizStats />
            </motion.div>

            {/* Quiz History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <QuizHistory />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
