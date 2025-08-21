'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, TrophyIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useGameFiQuiz } from '../../hooks/useGameFiQuiz'

export function QuizHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { isConnected } = useGameFiQuiz()

  useEffect(() => {
    loadHistory()
  }, [isConnected])

  const loadHistory = async () => {
    if (!isConnected) return

    try {
      setLoading(true)
      
      // Mock history - in real app, get from blockchain events
      const mockHistory = [
        {
          id: 1,
          category: 'DeFi Basics',
          difficulty: 'Medium',
          score: 85,
          totalQuestions: 3,
          reward: 42,
          completedAt: '2 hours ago',
          status: 'completed'
        },
        {
          id: 2,
          category: 'Bitcoin Fundamentals',
          difficulty: 'Easy',
          score: 100,
          totalQuestions: 3,
          reward: 25,
          completedAt: '1 day ago',
          status: 'completed'
        },
        {
          id: 3,
          category: 'Advanced Trading',
          difficulty: 'Hard',
          score: 60,
          totalQuestions: 3,
          reward: 60,
          completedAt: '2 days ago',
          status: 'completed'
        }
      ]
      
      setHistory(mockHistory)
    } catch (error) {
      console.error('Failed to load quiz history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quiz History</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">Connect wallet to view history</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-primary-400" />
          Quiz History
        </h3>
        <button 
          onClick={loadHistory}
          className="text-primary-400 hover:text-primary-300 text-sm font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dark-600 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-dark-600 rounded-lg p-4 bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white text-sm">{quiz.category}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      quiz.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                      quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {quiz.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">{quiz.completedAt}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  {quiz.status === 'completed' ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">
                    Score: <span className="text-white font-medium">{quiz.score}%</span>
                  </span>
                  <span className="text-gray-400">
                    {Math.round(quiz.score * quiz.totalQuestions / 100)}/{quiz.totalQuestions} correct
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 text-yellow-400">
                  <TrophyIcon className="h-4 w-4" />
                  <span className="font-medium">+{quiz.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}

          <button className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
            View All History
          </button>
        </div>
      )}
    </div>
  )
}