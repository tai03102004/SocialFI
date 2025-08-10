'use client'

import { motion } from 'framer-motion'
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

const quizHistory = [
  {
    id: 1,
    category: 'DeFi Basics',
    difficulty: 'Medium',
    score: 85,
    totalQuestions: 5,
    reward: 42,
    completedAt: '2 hours ago',
    status: 'completed'
  },
  {
    id: 2,
    category: 'Bitcoin Fundamentals',
    difficulty: 'Easy',
    score: 100,
    totalQuestions: 5,
    reward: 25,
    completedAt: '1 day ago',
    status: 'completed'
  },
  {
    id: 3,
    category: 'Advanced Trading',
    difficulty: 'Hard',
    score: 60,
    totalQuestions: 5,
    reward: 60,
    completedAt: '2 days ago',
    status: 'completed'
  },
  {
    id: 4,
    category: 'NFT Technology',
    difficulty: 'Medium',
    score: 40,
    totalQuestions: 5,
    reward: 20,
    completedAt: '3 days ago',
    status: 'failed'
  }
]

export function QuizHistory() {
  return (
    <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-primary-400" />
          Recent Quizzes
        </h3>
      </div>

      <div className="space-y-4">
        {quizHistory.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-dark-700/30 rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  quiz.status === 'completed' && quiz.score >= 70
                    ? 'bg-green-400'
                    : quiz.status === 'completed'
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                }`} />
                <span className="font-medium text-white text-sm">{quiz.category}</span>
              </div>
              
              <span className={`text-xs px-2 py-1 rounded-full ${
                quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {quiz.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs mb-2">
              <div>
                <p className="text-gray-400">Score</p>
                <p className="text-white font-medium">{quiz.score}%</p>
              </div>
              <div>
                <p className="text-gray-400">Questions</p>
                <p className="text-white font-medium">{quiz.totalQuestions}</p>
              </div>
              <div>
                <p className="text-gray-400">Reward</p>
                <p className="text-yellow-400 font-medium">+{quiz.reward} GUI</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{quiz.completedAt}</span>
              <div className="flex items-center space-x-1">
                {quiz.status === 'completed' && quiz.score >= 70 ? (
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                ) : quiz.status === 'failed' ? (
                  <XCircleIcon className="h-4 w-4 text-red-400" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4 text-yellow-400" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
        View All History
      </button>
    </div>
  )
}
