'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Quiz {
  id: number
  questions: Question[]
  difficulty: string
  category: string
  timeLimit: number
}

interface QuizCardProps {
  quiz: Quiz
  onComplete: (results: any) => void
}

export function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  const [showResults, setShowResults] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleQuizComplete()
    }
  }, [timeLeft, showResults])

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setIsAnswered(true)

    // Auto advance after 1 second
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setIsAnswered(false)
      } else {
        handleQuizComplete()
      }
    }, 1000)
  }

  const handleQuizComplete = () => {
    setShowResults(true)
    
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index]?.correctAnswer
    ).length

    const results = {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100),
      reward: calculateReward(correctAnswers, quiz.questions.length, quiz.difficulty)
    }

    setTimeout(() => {
      onComplete(results)
    }, 3000)
  }

  const calculateReward = (correct: number, total: number, difficulty: string) => {
    const baseReward = difficulty === 'hard' ? 100 : difficulty === 'medium' ? 50 : 25
    const percentage = correct / total
    return Math.round(baseReward * percentage)
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === quiz.questions[index]?.correctAnswer
    ).length
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100)
    const reward = calculateReward(correctAnswers, quiz.questions.length, quiz.difficulty)

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 max-w-2xl w-full text-center"
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            percentage >= 70 ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {percentage >= 70 ? (
              <CheckCircleIcon className="h-12 w-12 text-green-400" />
            ) : (
              <XCircleIcon className="h-12 w-12 text-red-400" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-3xl font-bold text-primary-400">{correctAnswers}</p>
              <p className="text-gray-400">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gradient">{percentage}%</p>
              <p className="text-gray-400">Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">+{reward}</p>
              <p className="text-gray-400">GUI Rewards</p>
            </div>
          </div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6 mx-auto max-w-md"
          />
          
          <p className="text-gray-300 mb-6">
            {percentage >= 90 ? 'Excellent work! 🏆' :
             percentage >= 70 ? 'Great job! 🎉' :
             percentage >= 50 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </p>
        </motion.div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center px-4">
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Crypto Quiz</h2>
            <p className="text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-2 rounded-lg">
              <ClockIcon className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-medium">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-600 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
            {question.question}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                  isAnswered
                    ? index === question.correctAnswer
                      ? 'bg-green-500/20 border-green-500/50 text-green-300'
                      : selectedAnswers[currentQuestion] === index
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-dark-700/50 border-dark-600 text-gray-400'
                    : 'bg-dark-700/50 border-dark-600 hover:border-primary-500/50 text-white hover:bg-dark-600/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isAnswered && index === question.correctAnswer
                      ? 'border-green-400 bg-green-400'
                      : isAnswered && selectedAnswers[currentQuestion] === index
                      ? 'border-red-400 bg-red-400'
                      : 'border-gray-500'
                  }`}>
                    <span className="text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
          >
            <p className="text-blue-200 text-sm leading-relaxed">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
